import re
import sys
from html.parser import HTMLParser
import pandas as pd

# Converts a saved copy of the AFDC "Vehicle Registration Counts by State" page
# (https://afdc.energy.gov/vehicle-registration) into the raw CSV we keep in
# version control. AFDC only publishes the latest year as an HTML table, so we
# parse it from the page. See UPDATE_PROCESS.md for how this is run.
#
# Counts are light-duty vehicles (cars, SUVs, pickups) by fuel type, as of the
# end of the year, rounded by AFDC to the nearest hundred.

# AFDC column headers mapped to our raw CSV column names
AFDC_FUEL_COLUMNS = {
    'Electric (EV)': 'ev',
    'Plug-In Hybrid Electric (PHEV)': 'phev',
    'Hybrid Electric (HEV)': 'hev',
    'Biodiesel': 'biodiesel',
    'Ethanol/Flex (E85)': 'e85',
    'Compressed Natural Gas (CNG)': 'cng',
    'Propane': 'propane',
    'Hydrogen': 'hydrogen',
    'Methanol': 'methanol',
    'Gasoline': 'gasoline',
    'Diesel': 'diesel',
    'Unknown Fuel': 'unknown_fuel',
}

# collects the text of every cell in the page's first table, row by row
class TableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows = []
        self.in_table = False
        self.done = False
        self.cell = None

    def handle_starttag(self, tag, attrs):
        if tag == 'table' and not self.done:
            self.in_table = True
        elif self.in_table and tag == 'tr':
            self.rows.append([])
        elif self.in_table and tag in ['td', 'th']:
            self.cell = ''

    def handle_endtag(self, tag):
        if tag == 'table' and self.in_table:
            self.in_table = False
            self.done = True
        elif self.in_table and tag in ['td', 'th'] and self.cell is not None:
            self.rows[-1].append(self.cell.strip())
            self.cell = None

    def handle_data(self, data):
        if self.cell is not None:
            self.cell += data

if __name__ == '__main__':
    path_to_html = sys.argv[1]

    with open(path_to_html, encoding='utf-8') as html_file:
        page = html_file.read()

    # e.g. "2025 Light-Duty Vehicle Registration Counts by State and Fuel Type"
    year = int(re.search(r'(\d{4}) Light-Duty Vehicle Registration Counts', page).group(1))

    parser = TableParser()
    parser.feed(page)
    header, rows = parser.rows[0], [row for row in parser.rows[1:] if row]

    registrations = pd.DataFrame(rows, columns=header)
    registrations = registrations.rename(columns={'State': 'state', **AFDC_FUEL_COLUMNS})
    for col in AFDC_FUEL_COLUMNS.values():
        registrations[col] = registrations[col].str.replace(',', '').astype(int)

    registrations.insert(1, 'year', year)

    print(registrations.to_csv(index=False), end='')
