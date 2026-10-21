import sys
import re
import json
import zipfile
import pandas as pd

from utils import us_state_to_abbrev

# Converts the EIA bulk electricity download (ELEC.zip, ~300MB) into the much
# smaller raw CSV we keep in version control. See UPDATE_PROCESS.md for how this
# is run.
#
# We keep annual net generation for all sectors, by state and energy source, for
# the 50 states + DC. Values are in thousand megawatthours (GWh).

TERRITORIES = ["AS", "GU", "MP", "PR", "UM", "VI"]

# EIA energy source codes (the middle of series IDs like ELEC.GEN.COW-IL-99.A)
# mapped to our raw CSV column names
EIA_FUEL_COLUMNS = {
    'ALL': 'all_fuels',
    'COW': 'coal',
    'NG': 'natural_gas',
    'OOG': 'other_gas',
    'PEL': 'petro_liquids',
    'PC': 'petro_coke',
    'NUC': 'nuclear',
    'HYC': 'hydro_electric',
    'HPS': 'hydro_electric_storage',
    'TSN': 'all_solar',
    'WND': 'wind',
    'SUN': 'utility_scale_solar',
    'SPV': 'utility_scale_photovoltaic',
    'DPV': 'small_scale_photovoltaic',
    'AOR': 'other_renewables',
    'STH': 'utility_scale_thermal',
    'GEO': 'geothermal',
    'WAS': 'other_biomass',
    'WWW': 'wood_fuels',
    'OTH': 'other',
}

# annual (A) net generation (GEN) for all sectors (99) in a state
SERIES_ID_PATTERN = re.compile(r'^ELEC\.GEN\.([A-Z0-9]+)-([A-Z]{2})-99\.A$')

if __name__ == '__main__':
    path_to_zip = sys.argv[1]

    states = [abbrev for abbrev in us_state_to_abbrev.values() if abbrev not in TERRITORIES]
    records = []

    # the bulk file is one JSON series per line, too big to load all at once
    with zipfile.ZipFile(path_to_zip) as eia_zip:
        with eia_zip.open('ELEC.txt') as bulk_file:
            for line in bulk_file:
                if b'"ELEC.GEN.' not in line[:40]:
                    continue

                series = json.loads(line)
                match = SERIES_ID_PATTERN.match(series.get('series_id', ''))
                if match is None:
                    continue

                fuel, state = match.groups()
                if fuel not in EIA_FUEL_COLUMNS or state not in states:
                    continue

                # data is a list of [year, value] pairs, newest first. Missing
                # values are strings like "--", which we treat as zero
                for year, value in series['data']:
                    if not isinstance(value, (int, float)):
                        value = 0
                    records.append({'state': state, 'year': int(year),
                                    'fuel': EIA_FUEL_COLUMNS[fuel], 'value': value})

    generation = pd.DataFrame(records).pivot_table(index=['state', 'year'], columns='fuel',
                                                   values='value', aggfunc='sum', fill_value=0)
    generation = generation.reindex(columns=list(EIA_FUEL_COLUMNS.values()), fill_value=0)

    # EIA's all solar (TSN) series starts in 2014, when small-scale solar
    # estimates begin. Before that, fill it in from utility-scale + small-scale
    generation['all_solar'] = generation['all_solar'].where(
        generation['all_solar'] > 0,
        generation['utility_scale_solar'] + generation['small_scale_photovoltaic'])

    generation = generation.reset_index().sort_values(['state', 'year'], ascending=[True, False])

    print(generation.round(5).to_csv(index=False), end='')
