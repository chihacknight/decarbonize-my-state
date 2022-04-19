import sys
import json

from utils import get_and_clean_csv, json_data_builder

if __name__ == '__main__':
    path_to_data = sys.argv[1]
    cols_to_keep = ["fossil_fuel_category","state", "plant_name", "utility_name", "county", "capacity_mw"]
    power_plants = get_and_clean_csv(path_to_data, state_col="state", cols_to_keep=cols_to_keep)

    output = json.dumps(json_data_builder(power_plants, 'power_plants', is_array=True, array_key="power_plants"))

    print(output)
