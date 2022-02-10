import sys
import pandas as pd

from utils import group_df_by_generation

if __name__ == '__main__':
    input1 = sys.argv[1]

    generation_data = pd.read_csv(input1)
    generation_out = group_df_by_generation(generation_data)
    
    print(generation_out)
