import sys
import json
import pandas as pd

from utils import json_data_builder

# Builds the share of homes in each state that already heat without burning
# fuel, from Census ACS table B25040 "House Heating Fuel" (occupied housing
# units by main heating fuel). See UPDATE_PROCESS.md

# B25040 estimate columns
HEATING_FUEL_COLS = {
    'B25040_E001': 'total',
    'B25040_E002': 'utility_gas',
    'B25040_E003': 'bottled_tank_lp_gas',
    'B25040_E004': 'electricity',
    'B25040_E005': 'fuel_oil_kerosene',
    'B25040_E006': 'coal',
    'B25040_E007': 'wood',
    'B25040_E008': 'solar',
    'B25040_E009': 'other_fuel',
    'B25040_E010': 'no_fuel',
}

# Homes heated with electricity or solar, or that don't heat at all (common in
# Hawaii), don't need their heating electrified. Everything else burns fuel
FOSSIL_FREE_COLS = ['electricity', 'solar', 'no_fuel']

# State FIPS codes (the end of GEO_IDs like 0400000US17) for the 50 states + DC
STATE_FIPS = {
    '01': 'alabama', '02': 'alaska', '04': 'arizona', '05': 'arkansas', '06': 'california',
    '08': 'colorado', '09': 'connecticut', '10': 'delaware', '11': 'district_of_columbia',
    '12': 'florida', '13': 'georgia', '15': 'hawaii', '16': 'idaho', '17': 'illinois',
    '18': 'indiana', '19': 'iowa', '20': 'kansas', '21': 'kentucky', '22': 'louisiana',
    '23': 'maine', '24': 'maryland', '25': 'massachusetts', '26': 'michigan', '27': 'minnesota',
    '28': 'mississippi', '29': 'missouri', '30': 'montana', '31': 'nebraska', '32': 'nevada',
    '33': 'new_hampshire', '34': 'new_jersey', '35': 'new_mexico', '36': 'new_york',
    '37': 'north_carolina', '38': 'north_dakota', '39': 'ohio', '40': 'oklahoma', '41': 'oregon',
    '42': 'pennsylvania', '44': 'rhode_island', '45': 'south_carolina', '46': 'south_dakota',
    '47': 'tennessee', '48': 'texas', '49': 'utah', '50': 'vermont', '51': 'virginia',
    '53': 'washington', '54': 'west_virginia', '55': 'wisconsin', '56': 'wyoming',
}

if __name__ == '__main__':
    path_to_data = sys.argv[1]

    heating_fuel = pd.read_csv(path_to_data, sep='|', dtype={'GEO_ID': str})

    # keep state rows (summary level 040), e.g. 0400000US17
    heating_fuel = heating_fuel[heating_fuel['GEO_ID'].str.startswith('0400000US')]
    heating_fuel['state'] = heating_fuel['GEO_ID'].str[-2:].map(STATE_FIPS)
    heating_fuel = heating_fuel[heating_fuel['state'].notnull()]
    heating_fuel = heating_fuel.rename(columns=HEATING_FUEL_COLS)

    heating_fuel['homes'] = heating_fuel['total']
    heating_fuel['fossilFreeHeatingPct'] = (
        100 * heating_fuel[FOSSIL_FREE_COLS].sum(axis=1) / heating_fuel['total']).round(1)
    heating_fuel['fossilHeatingPct'] = (100 - heating_fuel['fossilFreeHeatingPct']).round(1)

    cols_to_keep = ["state", "homes", "fossilHeatingPct", "fossilFreeHeatingPct"]
    output = json.dumps(json_data_builder(heating_fuel[cols_to_keep], 'buildings', is_array=False))

    print(output)
