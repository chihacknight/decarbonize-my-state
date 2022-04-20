import sys
import json

from utils import get_and_clean_csv, json_data_builder

if __name__ == '__main__':
    path_to_data = sys.argv[1]
    cols_to_keep = ["state","buildings","weightedFossilBuildingsPct","weightedEleBuildingsPct"]
    # ,nrelRes,nrelCom,resNonElHeating,comNonElHeating,resNonElWaterHeating,resNonElWaterHeating,resNonElRange,pctResNonElHeating,pctComNonElHeating,pctResNonElWaterHeating,pctComNonElWaterHeating,pctResNonElRange
    us_buildings = get_and_clean_csv(path_to_data, state_col="state", cols_to_keep=cols_to_keep)
    output = json.dumps(json_data_builder(us_buildings, 'buildings', is_array=False))

    print(output)