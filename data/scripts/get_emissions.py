import sys
import csv
import json
import pandas as pd
from slugify import slugify

from utils import group_df_by_emissions

if __name__ == '__main__':
    input1 = sys.argv[1]

    us_emissions = pd.read_csv(input1)
    us_emissions.index = us_emissions[['State','Year']]\
        .drop(['State','Year'],axis=1)
    emissons_out = group_df_by_emissions(us_emissions)

    print(emissons_out.to_json())

