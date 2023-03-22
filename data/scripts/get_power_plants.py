import sys
import json

from utils import get_and_clean_csv, json_data_builder
from slugify import slugify

if __name__ == '__main__':
    path_to_data = sys.argv[1]
    cols_to_keep = ["fossil_fuel_category","state", "plant_name", "utility_name", "county", "capacity_mw", "Plant annual CO2 equivalent emissions (tons)", "Plant annual NOx emissions (tons)", "Plant annual SO2 emissions (tons)", "Plant annual CO2 emissions (tons)", "Plant annual CH4 emissions (lbs)", "Plant annual N2O emissions (lbs)", "Plant annual net generation (MWh)", "Latitude", "Longitude"]
    number_cols = ["capacity_mw", "Plant annual CO2 equivalent emissions (tons)", "Plant annual NOx emissions (tons)", "Plant annual SO2 emissions (tons)", "Plant annual CO2 emissions (tons)", "Plant annual CH4 emissions (lbs)", "Plant annual N2O emissions (lbs)", "Plant annual net generation (MWh)", "Latitude", "Longitude"]
    power_plants = get_and_clean_csv(path_to_data, state_col="state", cols_to_keep=cols_to_keep, number_cols=number_cols)

    for p in power_plants:
        p['slug'] = slugify(p['place_name'])
        

    output = json.dumps(json_data_builder(power_plants, 'power_plants', is_array=True, array_key="power_plants"))

    print(output)
