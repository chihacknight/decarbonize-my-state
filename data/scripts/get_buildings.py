import sys
import json
import numpy as np
import pandas as pd

from utils import json_data_builder

# Builds the share of homes in each state that already heat without burning
# fuel, from American Community Survey (ACS) table B25040 "House Heating Fuel"
# (occupied housing units by main heating fuel), for the latest year and every
# year before it. See UPDATE_PROCESS.md

# B25040 lines, each with an estimate (E) and margin of error (M) column in
# raw/acs_house_heating_fuel.csv, e.g. B25040_004E and B25040_004M
HEATING_FUEL_LINES = {
    '001': 'total',
    '002': 'utility_gas',
    '003': 'bottled_tank_lp_gas',
    '004': 'electricity',
    '005': 'fuel_oil_kerosene',
    '006': 'coal',
    '007': 'wood',
    '008': 'solar',
    '009': 'other_fuel',
    '010': 'no_fuel',
}

# Homes heated with electricity or solar, or that don't heat at all (common in
# Hawaii), don't need their heating electrified. Everything else burns fuel
FOSSIL_FREE_COLS = ['electricity', 'solar', 'no_fuel']
FOSSIL_COLS = [name for name in HEATING_FUEL_LINES.values()
               if name not in FOSSIL_FREE_COLS + ['total']]

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

def sum_moe(df, cols):
    """Margin of error of a sum of estimates, Census's root-sum-of-squares
    approximation"""
    return np.sqrt((df[[col + '_moe' for col in cols]] ** 2).sum(axis=1))


def share_moe(part, part_moe, total, total_moe):
    """Margin of error of part / total, as a percent, using Census's formula
    for a proportion (and its ratio fallback when the first is undefined)"""
    share = part / total
    inner = part_moe ** 2 - share ** 2 * total_moe ** 2
    inner = inner.where(inner >= 0, part_moe ** 2 + share ** 2 * total_moe ** 2)
    return 100 * np.sqrt(inner) / total


if __name__ == '__main__':
    path_to_data = sys.argv[1]

    heating_fuel = pd.read_csv(path_to_data, dtype={'state_fips': str})

    # 50 states + DC, no territories
    heating_fuel['state'] = heating_fuel['state_fips'].map(STATE_FIPS)
    heating_fuel = heating_fuel[heating_fuel['state'].notnull()]
    for line, name in HEATING_FUEL_LINES.items():
        heating_fuel[name] = heating_fuel[f'B25040_{line}E']
        heating_fuel[name + '_moe'] = heating_fuel[f'B25040_{line}M']

    heating_fuel['homes'] = heating_fuel['total']
    heating_fuel['fossilFreeHomes'] = heating_fuel[FOSSIL_FREE_COLS].sum(axis=1)
    heating_fuel['fossilFreeHomesMoe'] = sum_moe(heating_fuel, FOSSIL_FREE_COLS).round().astype(int)
    heating_fuel['fossilHomes'] = heating_fuel[FOSSIL_COLS].sum(axis=1)
    heating_fuel['fossilHomesMoe'] = sum_moe(heating_fuel, FOSSIL_COLS).round().astype(int)
    heating_fuel['fossilFreeHeatingPct'] = (
        100 * heating_fuel['fossilFreeHomes'] / heating_fuel['total']).round(1)
    heating_fuel['fossilFreeHeatingPctMoe'] = share_moe(
        heating_fuel['fossilFreeHomes'], sum_moe(heating_fuel, FOSSIL_FREE_COLS),
        heating_fuel['total'], heating_fuel['total_moe']).round(1)
    heating_fuel['fossilHeatingPct'] = (100 - heating_fuel['fossilFreeHeatingPct']).round(1)

    # The headline stats use the latest year
    latest = heating_fuel[heating_fuel['year'] == heating_fuel['year'].max()]
    cols_to_keep = ["state", "homes", "fossilHeatingPct", "fossilFreeHeatingPct"]
    buildings = json_data_builder(latest[cols_to_keep], 'buildings', is_array=False)

    # Every year for the home heating chart, oldest first. ACS skipped 2020
    by_year_cols = ["state", "year", "homes", "fossilFreeHeatingPct", "fossilFreeHeatingPctMoe",
                    "fossilFreeHomes", "fossilFreeHomesMoe", "fossilHomes", "fossilHomesMoe"]
    by_year = json_data_builder(heating_fuel.sort_values('year')[by_year_cols],
                                'buildings', array_key='byYear')
    by_year = {row['state']: row['byYear'] for row in by_year}
    for row in buildings:
        row['byYear'] = by_year[row['state']]

    print(json.dumps(buildings))
