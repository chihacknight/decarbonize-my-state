import argparse
import os
import re
from html.parser import HTMLParser
import pandas as pd

# Converts saved copies of the AFDC "Vehicle Registration Counts by State" page
# (https://afdc.energy.gov/vehicle-registration) into the raw CSV we keep in
# version control. AFDC publishes each year as an HTML table (pick the year with
# ?year=2016 etc.), so we parse it from the page. Pass several pages to convert
# several years, and --existing to keep the years already in the raw CSV. See
# UPDATE_PROCESS.md for how this is run.
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

def convert_page(path_to_html):
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
    return registrations

if __name__ == '__main__':
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument('pages', nargs='+', help='saved AFDC pages, one per year')
    arg_parser.add_argument('--existing', help='raw CSV whose other years to keep')
    args = arg_parser.parse_args()

    registrations = pd.concat([convert_page(page) for page in args.pages])

    # years in the new pages replace the same years in the existing CSV
    if args.existing and os.path.exists(args.existing):
        existing = pd.read_csv(args.existing)
        existing = existing[~existing['year'].isin(registrations['year'])]
        registrations = pd.concat([existing, registrations])

    # one row per state per year, with the same state order as AFDC's table
    state_order = {state: i for i, state in enumerate(registrations['state'].drop_duplicates())}
    registrations = registrations.sort_values(
        ['state', 'year'], key=lambda col: col.map(state_order) if col.name == 'state' else col)

    print(registrations.to_csv(index=False), end='')
