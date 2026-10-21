import sys
import zipfile
import pandas as pd

from utils import us_state_to_abbrev

# Converts the EPA "Inventory of U.S. Greenhouse Gas Emissions and Sinks by
# State" zip download into the much smaller raw CSV we keep in version control.
# See UPDATE_PROCESS.md for how this is run.
#
# We keep the "Data by Economic Sectors" sheet, summed up by state, economic
# sector and subsector, for the 50 states + DC (no territories). Values are in
# Tg (= million metric tons) CO2e.

TERRITORIES = ["AS", "GU", "MP", "PR", "UM", "VI"]

if __name__ == '__main__':
    path_to_zip = sys.argv[1]

    with zipfile.ZipFile(path_to_zip) as epa_zip:
        workbook_name = [name for name in epa_zip.namelist() if name.endswith('.xlsx')][0]
        with epa_zip.open(workbook_name) as workbook:
            epa = pd.read_excel(workbook, sheet_name='Data by Economic Sectors', engine='openpyxl')

    states = [abbrev for abbrev in us_state_to_abbrev.values() if abbrev not in TERRITORIES]
    epa = epa[epa['geo_ref'].isin(states)]

    year_cols = [col for col in epa.columns if col.startswith('Y')]
    by_subsector = epa.groupby(['geo_ref', 'econ_sector', 'econ_subsector'])[year_cols].sum().reset_index()
    by_subsector.rename(columns={'geo_ref': 'state'}, inplace=True)

    print(by_subsector.round(6).to_csv(index=False), end='')
