import sys
import json

from utils import get_and_clean_csv, json_data_builder

if __name__ == '__main__':
    path_to_data = sys.argv[1]
    cols_to_keep = ["state","Cars_All","EV_Registration"]
    # state,Cars_Private,Cars_Public,Cars_All,Buses_Private,Buses_Public,Buses_All,Trucks_Private,Trucks_Public,Trucks_All,Motorcycles_Private,Motorcycles_Public,Motorcycles_All,MotorVehicles_Private,MotorVehicles_Public,MotorVehicles_All,EV_Registration

    us_vehicles = get_and_clean_csv(path_to_data, state_col="state", cols_to_keep=cols_to_keep)
    output = json.dumps(json_data_builder(us_vehicles, 'vehicles', is_array=False))

    print(output)