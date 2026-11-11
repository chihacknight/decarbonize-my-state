import sys
import json

from utils import get_and_clean_csv, json_data_builder

# Combines each state's wind and solar generation targets with how much wind and
# solar it generates today, from the latest year of EIA net generation data.
# Generation values are in GWh (thousand megawatthours) per year.
#
# The site talks about MW of wind and solar to build, which means capacity (the
# most a generator can produce at once), so this also estimates the capacity
# behind each GWh value: spread over every hour of the year that's average
# output in MW, and dividing by the capacity factor (the share of capacity
# produced on average) gives capacity. We use national averages, as capacity
# factors vary by state. See UPDATE_PROCESS.md

# EIA Electric Power Monthly Table 6.07.B, 2025 utility scale
WIND_CAPACITY_FACTOR = 0.338
SOLAR_CAPACITY_FACTOR = 0.24

HOURS_PER_YEAR = 24 * 365


def gwh_to_capacity_mw(gwh, capacity_factor):
    """MW of capacity it takes to generate gwh a year at this capacity factor"""
    return gwh / HOURS_PER_YEAR * 1000 / capacity_factor


if __name__ == '__main__':
    path_to_targets = sys.argv[1]
    path_to_generation = sys.argv[2]

    # TODO: Find and cite where the targets came from (added Apr 2022, source not recorded)
    us_target_generations = get_and_clean_csv(path_to_targets, state_col="state")

    generation = get_and_clean_csv(path_to_generation, state_col="state",
                                   cols_to_keep=['state', 'year', 'all_solar', 'wind'])
    generation['all_solar'] = generation['all_solar'].fillna(0)
    generation['wind'] = generation['wind'].fillna(0)
    latest_generation = generation[generation['year'] == generation['year'].max()]
    latest_generation = latest_generation.rename(columns={'all_solar': 'current_solar', 'wind': 'current_wind'})

    us_target_generations = us_target_generations.merge(
        latest_generation[['state', 'current_solar', 'current_wind']], on='state')

    us_target_generations['current_solar'] = us_target_generations['current_solar'].round(0).astype(int)
    us_target_generations['current_wind'] = us_target_generations['current_wind'].round(0).astype(int)

    # percent of each target already built, capped at 100 since some states
    # already generate more wind than their target
    us_target_generations['perc_solar_target'] = (
        100 * us_target_generations['current_solar'] / us_target_generations['total_gen_by_solar']
    ).clip(upper=100).round(1)
    us_target_generations['perc_wind_target'] = (
        100 * us_target_generations['current_wind'] / us_target_generations['total_gen_by_wind']
    ).clip(upper=100).round(1)

    # Capacity estimates for the MW the state page talks about
    us_target_generations['wind_capacity_factor'] = WIND_CAPACITY_FACTOR
    us_target_generations['solar_capacity_factor'] = SOLAR_CAPACITY_FACTOR
    for source, gen_col, factor in [('wind', 'wind', WIND_CAPACITY_FACTOR),
                                    ('solar', 'solar', SOLAR_CAPACITY_FACTOR)]:
        us_target_generations[f'target_{source}_mw'] = gwh_to_capacity_mw(
            us_target_generations[f'total_gen_by_{gen_col}'], factor).round().astype(int)
        us_target_generations[f'current_{source}_mw'] = gwh_to_capacity_mw(
            us_target_generations[f'current_{gen_col}'], factor).round().astype(int)

    targets = json_data_builder(us_target_generations, 'target_generations', is_array=False)

    # Every year's estimated capacity for the wind and solar built chart, oldest
    # first
    generation['wind_mw'] = gwh_to_capacity_mw(generation['wind'], WIND_CAPACITY_FACTOR).round().astype(int)
    generation['solar_mw'] = gwh_to_capacity_mw(
        generation['all_solar'], SOLAR_CAPACITY_FACTOR).round().astype(int)
    by_year = json_data_builder(generation.sort_values('year')[['state', 'year', 'wind_mw', 'solar_mw']],
                                'target_generations', array_key='capacityByYear')
    by_year = {row['state']: row['capacityByYear'] for row in by_year}
    for row in targets:
        row['capacityByYear'] = by_year[row['state']]

    output = json.dumps(targets)

    print(output)
