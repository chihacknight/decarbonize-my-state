import pandas as pd
import json

### Setting Test DataFrames to more easily test functions
#us_emissions = pd.read_csv('../raw/us_emissions_2000_2018.csv')
#us_generation = pd.read_csv('../raw/us_electric_generation_2001_20.csv')

# define function to perform the grouping calculations on a dataframe
# returns the cleaned grouped df
def group_df_by_emissions(emissions_data):
    dirty_power = ['emission_sub_electric']
    buildings = ['emission_sub_residential', 'emission_sub_commercial']
    transportation = ['emission_sub_transportation']
    dumps_farms_industrial_other = ['emission_by_waste', 'emission_sub_industrial', 
                                    'emission_by_industrial', 'emission_by_agriculture', 'emission_sub_fugitive']

    columns_list = [['dirty_power', dirty_power], 
                    ['buildings', buildings],
                    ['transportation', transportation], 
                    ['dumps_farms_industrial_other', dumps_farms_industrial_other]]

    # build each bucketed totals
    for calc in columns_list: 
        emissions_data[calc[0]] = emissions_data.loc[:, calc[1]].sum(axis=1)
    
    # this section is going to calculate `%_of_total`
    # it's not currently being used, but can be accessed if you add '%_whatever_the_calculation_is' to the `cols_to_keep` object
    buckets = ['dirty_power', 'buildings', 'transportation', 'dumps_farms_industrial_other'] # emitted fuels from the totals for now
    # build the bucket % makeup for that year
    for bucket in buckets:
        emissions_data['%_'+bucket] = round(emissions_data[bucket] / emissions_data[buckets].sum(axis=1), 2) * 100
        # round the main value by it's nearest 1st decimal point
        emissions_data[bucket] = emissions_data[bucket].apply(lambda value: round(value,1))
    
    # rename state & year so they are lower case
    emissions_data.rename(columns={'State':'state', 'Year':'year'}, inplace=True)
    emissions_data['state'] = emissions_data['state'].apply(lambda state: state.lower())
    emissions_data['state'] = emissions_data['state'].apply(lambda state: state.replace(" ", "_"))

    #keep only relevant columns for our stats right now
    cols_to_keep = ['state', 'year', 'dirty_power', 'buildings', 'transportation', 'dumps_farms_industrial_other']

    prepped_dictionary = json_data_builder(emissions_data[cols_to_keep], 'emissions')

    return json.dumps(prepped_dictionary)

# define function to perform the grouping calculations on a dataframe
# returns the cleaned grouped df
def group_df_by_generation(generation_data):
    # first, i'll calculate % of total
    columns_list = ['coal', 'natural_gas', 'petro_liquids', 'nuclear', 'hydro_electric', 'all_solar', 'wind']

    # build each bucketed totals
    for calc in columns_list: 
        generation_data[calc+'_%'] = round(generation_data[calc] / generation_data[columns_list].sum(axis=1), 2) * 100
        # round the value to it's nearest first decimal
        generation_data[calc] = generation_data[calc].apply(lambda value: round(value,1))

    # replace the state_abbreviations with their full name to match the emissions data
    generation_data['state'] = generation_data['state'].replace(dict(map(reversed, us_state_to_abbrev.items())))
    generation_data['state'] = generation_data['state'].apply(lambda state: state.lower())
    generation_data['state'] = generation_data['state'].apply(lambda state: state.replace(" ", "_"))

    cols_to_keep = ['state', 'year', 'coal', 'natural_gas', 'petro_liquids', 'nuclear', 'hydro_electric', 'all_solar', 'wind']

    prepped_dictionary = json_data_builder(generation_data[cols_to_keep], 'generation')

    return json.dumps(prepped_dictionary)

# this function takes in a dataframe object, and reformats it to match our needs as a json object
def json_data_builder(dataframe, outer_tag="default", is_array=True, array_key="emissionsByYear"):
    '''
    Goal:
        For every state, we will subset the dataframe to just that state
        using the to_dict method with the `records` param will return all a list of 
        dictionaries in the following format:
    
    [{
      'year': 2001,
        'metric': value
       etc...},
      {
        'year':2002,
        'metric': value
         etc...
    }]

    So at that point, all we need to do is set larger key for that whole list as whatever the state is
    And then then json_object matches the format we need. 
    '''
    dataframe=dataframe.applymap(lambda x: "" if pd.isnull(x) else x)
    # initiate empty json object to iterate with
    json_object = []

    # grab list of unique states for for_loop
    unique_states = list(set(dataframe['state']))
    
    for state in unique_states:
        state_df = dataframe.loc[dataframe['state']==state]
        # need to set state as the index here, so it's not duplicated in our final json
        if is_array:
            state_df.set_index('state', inplace=True)
            state_json = state_df.to_dict('records')
            json_object.append({"state": state, array_key: state_json})
        else:
            state_json = state_df.to_dict('records')[0]
            json_object.append(state_json)

    # outer tag output object
    return json_object

# using this object to align our us state names with their abbreviation
# code copied from https://gist.github.com/rogerallen/1583593
# to invert it, simply run `dict(map(reversed, us_state_to_abbrev.items()))`

def get_and_clean_csv(path_to_csv, state_col="state", cols_to_keep=None):
    df = pd.read_csv(path_to_csv)

    # replace abbreviated states with full names
    df[state_col] = df[state_col].replace(dict(map(reversed, us_state_to_abbrev.items())))
    df[state_col] = df[state_col].str.lower().str.replace(' ', '_')
    if cols_to_keep is None:
        return df
    else:
        return df[cols_to_keep]


us_state_to_abbrev = {
    "Alabama": "AL",
    "Alaska": "AK",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "Florida": "FL",
    "Georgia": "GA",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY",
    "District of Columbia": "DC",
    "American Samoa": "AS",
    "Guam": "GU",
    "Northern Mariana Islands": "MP",
    "Puerto Rico": "PR",
    "United States Minor Outlying Islands": "UM",
    "U.S. Virgin Islands": "VI",
} 
