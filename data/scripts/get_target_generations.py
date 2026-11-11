import sys
import json

from utils import get_and_clean_csv, json_data_builder

# Combines each state's wind and solar generation targets with how much wind and
# solar it generates today, from the latest year of EIA net generation data.
# All values are in GWh (thousand megawatthours) per year

if __name__ == '__main__':
    path_to_targets = sys.argv[1]
    path_to_generation = sys.argv[2]

    # TODO: Find and cite where the targets came from (added Apr 2022, source not recorded)
    us_target_generations = get_and_clean_csv(path_to_targets, state_col="state")

    generation = get_and_clean_csv(path_to_generation, state_col="state",
                                   cols_to_keep=['state', 'year', 'all_solar', 'wind'])
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

    output = json.dumps(json_data_builder(us_target_generations, 'target_generations', is_array=False))

    print(output)
