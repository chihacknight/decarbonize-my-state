import sys
import csv
import json
import pandas as pd
from slugify import slugify

from utils import group_df_by_generation

if __name__ == '__main__':
    input1 = sys.argv[1]

    generation_data = pd.read_csv('../raw/us_electric_generation_2001_20.csv')
    generation_out = group_df_by_generation(generation_data)
    
    print(generation_out.to_json())
