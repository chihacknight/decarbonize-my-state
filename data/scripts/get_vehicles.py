import sys
import json

from utils import get_and_clean_csv, json_data_builder

# AFDC fuel type columns in raw/afdc_vehicle_registrations.csv, which together
# add up to all light-duty vehicles in a state
FUEL_COLS = ['ev', 'phev', 'hev', 'biodiesel', 'e85', 'cng', 'propane', 'hydrogen',
             'methanol', 'gasoline', 'diesel', 'unknown_fuel']

if __name__ == '__main__':
    path_to_data = sys.argv[1]

    us_vehicles = get_and_clean_csv(path_to_data, state_col="state")

    # Keep the field names the frontend queries. Cars_All is all light-duty
    # vehicles (cars, SUVs, pickups) and EV_Registration is all-electric only
    us_vehicles['Cars_All'] = us_vehicles[FUEL_COLS].sum(axis=1)
    us_vehicles['EV_Registration'] = us_vehicles['ev']

    # The headline stats use the latest year
    latest = us_vehicles[us_vehicles['year'] == us_vehicles['year'].max()]
    cols_to_keep = ["state", "Cars_All", "EV_Registration"]
    vehicles = json_data_builder(latest[cols_to_keep], 'vehicles', is_array=False)

    # Every year for the EV growth chart, oldest first
    by_year = json_data_builder(
        us_vehicles.sort_values('year')[["state", "year", "Cars_All", "EV_Registration"]],
        'vehicles', array_key='byYear')
    by_year = {row['state']: row['byYear'] for row in by_year}
    for row in vehicles:
        row['byYear'] = by_year[row['state']]

    print(json.dumps(vehicles))
