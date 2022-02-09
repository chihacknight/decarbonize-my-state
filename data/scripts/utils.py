import pandas as pd

# define function to perform the grouping calculations on a dataframe
# returns the cleaned grouped df
def group_df_by_emissions(emissions_data):
    dirty_power = ['emission_sub_electric']
    buildings = ['emission_sub_residential', 'emission_sub_commercial']
    transportation = ['emission_sub_transportation']
    dumps_farms_industrial = ['emission_by_waste', 'emission_sub_industrial', 'emission_by_agriculture']
    fuels = ['emission_sub_fugitive', 'emission_by_bunker_fuel']

    columns_list = [['dirty_power', dirty_power], 
                    ['buildings', buildings],
                    ['transportation', transportation], 
                    ['dumps_farms_industrial', dumps_farms_industrial], 
                    ['fuels', fuels]]

    # build each bucketed totals
    for calc in columns_list: 
        emissions_data[calc[0]] = emissions_data.loc[:, calc[1]].sum(axis=1)
    
    # just rewrite a buckets list to concat through, sheer laziness here
    buckets = ['dirty_power', 'buildings', 'transportation', 'dumps_farms_industrial'] # emitted fuels from the totals for now
    # build the bucket % makeup for that year
    for bucket in buckets:
        emissions_data['%_'+bucket] = round(emissions_data[bucket] / emissions_data[buckets].sum(axis=1), 2) * 100
    
    # rename state & year so they are lower case
    emissions_data.rename(columns={'State':'state', 'Year':'year'}, inplace=True)

    #keep only relevant columns for our stats right now
    cols_to_keep = ['dirty_power', 'buildings', 'transportation', 'dumps_farms_industrial']

    # set state and year as a multi index
    emissions_data.set_index(['state', 'year'], inplace=True)

    return emissions_data[cols_to_keep]

# define function to perform the grouping calculations on a dataframe
# returns the cleaned grouped df
def group_df_by_generation(generation_data):
    columns_list = ['coal', 'natural_gas', 'petro_liquids', 'nuclear', 'hydro_electric', 'all_solar', 'wind']

    # build each bucketed totals
    for calc in columns_list: 
        generation_data[calc+'_%'] = round(generation_data[calc] / generation_data[columns_list].sum(axis=1), 2) * 100

    generation_data.set_index(['state', 'year'], inplace=True)

    return generation_data[columns_list]
    