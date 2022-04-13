import sys
import json

from utils import get_and_clean_csv, json_data_builder

if __name__ == '__main__':
    path_to_data = sys.argv[1]
    cols_to_keep = ["Plant primary coal/oil/gas/ other fossil fuel category","state", "Plant name", "Utility name", "Plant county name", "Plant nameplate capacity (MW)"]
    power_plants = get_and_clean_csv(path_to_data, state_col="state", cols_to_keep=cols_to_keep)

    output = json.dumps(json_data_builder(power_plants, 'power_plants', is_array=False))

    print(output)


# [
#   {
#     "state": "illinois",
#     "power_plants": [
#       {
#         "type": "coal",
#         "plants": [
#           {
#             "name": "E D Edwards",
#             "utility_name": "Will County Energy LLC",
#             "county_name": "Will",
#             "power_capacity": "1,268.80"
#           },
#           ...
#         ]
#       },
#       {
#           "type": "gas",
#           "plants": [
#             ...
#           ]
#       }
#     ]
#   },
# ]