import sys
import json

from utils import get_and_clean_csv, json_data_builder

if __name__ == '__main__':
    path_to_data = sys.argv[1]
    # ,nrelRes,nrelCom,resNonElHeating,comNonElHeating,resNonElWaterHeating,resNonElWaterHeating,resNonElRange,pctResNonElHeating,pctComNonElHeating,pctResNonElWaterHeating,pctComNonElWaterHeating,pctResNonElRange
    us_target_generations = get_and_clean_csv(path_to_data, state_col="state")
    output = json.dumps(json_data_builder(us_target_generations, 'target_generations', is_array=False))

    print(output)