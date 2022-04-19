# %%
import osmium
import requests 
import pandas as pd
import json
# %%

# All US states currnetly included in geofabrik's OSM extracts
states = [
    {"state":"Alabama", "fips":"01"},
    {"state":"Alaska", "fips":"02"},
    {"state":"Arizona", "fips":"04"},
    {"state":"Arkansas", "fips":"05"},
    {"state":"California", "fips":"06"},
    {"state":"Colorado", "fips":"08"},
    {"state":"Connecticut", "fips":"09"},
    {"state":"Delaware", "fips":"10"},
    {"state":"District of Columbia", "fips":"11"},
    {"state":"Florida", "fips":"12"},
    {"state":"Georgia", "fips":"13"},
    {"state":"Hawaii", "fips":"15"},
    {"state":"Idaho", "fips":"16"},
    {"state":"Illinois", "fips":"17"},
    {"state":"Indiana", "fips":"18"},
    {"state":"Iowa", "fips":"19"},
    {"state":"Kansas", "fips":"20"},
    {"state":"Kentucky", "fips":"21"},
    {"state":"Louisiana", "fips":"22"},
    {"state":"Maine", "fips":"23"},
    {"state":"Maryland", "fips":"24"},
    {"state":"Massachusetts", "fips":"25"},
    {"state":"Michigan", "fips":"26"},
    {"state":"Minnesota", "fips":"27"},
    {"state":"Mississippi", "fips":"28"},
    {"state":"Missouri", "fips":"29"},
    {"state":"Montana", "fips":"30"},
    {"state":"Nebraska", "fips":"31"},
    {"state":"Nevada", "fips":"32"},
    {"state":"New Hampshire", "fips":"33"},
    {"state":"New Jersey", "fips":"34"},
    {"state":"New Mexico", "fips":"35"},
    {"state":"New York", "fips":"36"},
    {"state":"North Carolina", "fips":"37"},
    {"state":"North Dakota", "fips":"38"},
    {"state":"Ohio", "fips":"39"},
    {"state":"Oklahoma", "fips":"40"},
    {"state":"Oregon", "fips":"41"},
    {"state":"Pennsylvania", "fips":"42"},
    {"state":"Puerto Rico", "fips":"72"},
    {"state":"Rhode Island", "fips":"44"},
    {"state":"South Carolina", "fips":"45"},
    {"state":"South Dakota", "fips":"46"},
    {"state":"Tennessee", "fips":"47"},
    {"state":"Texas", "fips":"48"},
    {"state":"US Virgin Islands", "fips":"78"},
    {"state":"Utah", "fips":"49"},
    {"state":"Vermont", "fips":"50"},
    {"state":"Virginia", "fips":"51"},
    {"state":"Washington", "fips":"53"},
    {"state":"West Virginia", "fips":"54"},
    {"state":"Wisconsin", "fips":"55"},
    {"state":"Wyoming", "fips":"56"}
]

# Format state name for use in URL
def clean_state(state):
    return state.replace(" ", "-").lower()

# Helper function for cleaned state name to URL
def get_url(state):
    return f"http://download.geofabrik.de/north-america/us/{state}-latest.osm.pbf"

def get_state_data(state):
    # Fetch the data from geofabric's OSM extracts
    url = get_url(clean_state(state))
    print(f"Fetching data for {state}: {url}")
    r = requests.get(url)
    # write to disk
    with open(f'./{state}.osm.pbf', 'wb') as f:
        f.write(r.content)
    # return the path
    return f"{state}.osm.pbf"

# %%

# Class for use with osmium's python bindings
# This is the primary way of handling data with osmium
class BuildingHandler(osmium.SimpleHandler):
    def __init__(self):
        super(BuildingHandler, self).__init__()
        # A counter for the number of buildings
        self.buildings = 0
    # way here checks all ways, buildings are a 4 sided (or more) polygon with a tag of building
    def way(self, w):
        # Check if there is a building tag
        # And if it is yes
        if 'building' in w.tags and w.tags['building'] == "yes":
            self.buildings += 1

# %%

def get_state_num_buildings(state):
    dataPath = get_state_data(state)
    print('DATA')
    b = BuildingHandler()
    b.apply_file(dataPath)
    os.remove(dataPath)
    return b.buildings
    
# %%
if __name__ == "__main__":
    for idx, state in enumerate(states):
        num_osm_buildings = get_state_num_buildings(state['state'])
        states[idx]['num_osm_buildings'] = num_osm_buildings
    pd.DataFrame(states).to_csv('../raw/osm_buildings.csv', index=False)
