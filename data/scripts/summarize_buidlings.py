# %%
import pandas as pd
# %%
# path to data, see
# res stock meta: https://data.openei.org/s3_viewer?bucket=oedi-data-lake&prefix=nrel-pds-building-stock%2Fend-use-load-profiles-for-us-building-stock%2F2021%2Fresstock_amy2018_release_1%2Ftimeseries_aggregates_metadata%2F
# com stock meta: https://data.openei.org/s3_viewer?bucket=oedi-data-lake&prefix=nrel-pds-building-stock%2Fend-use-load-profiles-for-us-building-stock%2F2021%2Fcomstock_tmy3_release_1%2Ftimeseries_aggregates_metadata%2F
comStockPath = "F:/CHI-HACK/decarb/commercial_nerl.tsv"
resStockPath = "F:/CHI-HACK/decarb/residential_nerl.tsv"
# %%
com_data = pd.read_csv(comStockPath, sep="\t")
res_data = pd.read_csv(resStockPath, sep="\t")

geog_col = 'in.state_name'
heating_fuel = 'in.heating_fuel'
# %%
def cleanGroup(df, colName):
    temp = df.groupby(geog_col).count().reset_index()[[geog_col, 'bldg_id']]
    temp.columns = ['geoid', colName]
    return temp
# %%
res_count = cleanGroup(res_data, 'res-count')
com_count = cleanGroup(com_data, 'com-count')
# %%
# pull relevant columns and group by state
res_non_el_heating = cleanGroup(res_data[res_data['in.heating_fuel'] != "Electricity"], 'res-non-ele-heating')
com_non_el_heating = cleanGroup(com_data[com_data['in.heating_fuel'] != "Electricity"], 'com-non-ele-heating')
res_non_el_water_heating = cleanGroup(res_data[res_data['in.water_heater_fuel'] != "Electricity"], 'res-non-ele-water-heating')
com_non_el_water_heating = cleanGroup(com_data[com_data['in.service_water_heating_fuel'] != "Electricity"], 'com-non-ele-water-heating')
res_non_el_range = cleanGroup(res_data[~res_data['in.cooking_range'].str.contains("Electric")], 'res-non-ele-range')
# %%
# Merge em up!
merged = res_count.merge(com_count, on="geoid", how="outer") \
    .merge(res_non_el_heating, on="geoid",) \
    .merge(com_non_el_heating, on="geoid",) \
    .merge(res_non_el_water_heating, on="geoid",) \
    .merge(com_non_el_water_heating, on="geoid",) \
    .merge(res_non_el_range, on="geoid",) 
# %%
# calculate percentages
merged['pct-res-non-ele-heating'] = merged['res-non-ele-heating'] / merged['res-count'] * 100
merged['pct-com-non-ele-heating'] = merged['com-non-ele-heating'] / merged['com-count'] * 100
merged['pct-res-non-ele-water-heating'] = merged['res-non-ele-water-heating'] / merged['res-count'] * 100
merged['pct-com-non-ele-water-heating'] = merged['com-non-ele-water-heating'] / merged['com-count'] * 100
merged['pct-res-non-ele-range'] = merged['res-non-ele-range'] / merged['res-count'] * 100
# %%
# export!
merged.to_csv("../raw/nrel_summary.csv", index=False)
# %%
## combine with MS footprint data
ms_buildings = pd.read_csv('../raw/microsoft_footprints.csv')
ms_buildings['Microsoft Footprint Count'] = ms_buildings['Microsoft Footprint Count'].str.replace(',','').astype('int64')# %%

# %%
output = ms_buildings[['State','Microsoft Footprint Count']].merge(merged, left_on="State", right_on="geoid")
output = output.drop(columns={"geoid"})
# %%
# cleanup
output['res-count'] = output['res-count'].astype('int64')
output['com-count'] = output['com-count'].astype('int64')
output = output.rename(columns={
    'res-count':'nrelRes', 
    'com-count':'nrelCom',
    "Microsoft Footprint Count": "buildings",
    "pct-res-non-ele-heating": "pctResNonElHeating",
    "pct-com-non-ele-heating": "pctComNonElHeating",
    "pct-res-non-ele-water-heating": "pctResNonElWaterHeating",
    "pct-com-non-ele-water-heating": "pctComNonElWaterHeating",
    "pct-res-non-ele-range": "pctResNonElRange",
    'res-non-ele-heating': 'resNonElHeating',
    'com-non-ele-heating': 'comNonElHeating',
    'res-non-ele-water-heating': 'resNonElWaterHeating', 
    'com-non-ele-water-heating': 'resNonElWaterHeating',
    'res-non-ele-range': 'resNonElRange'
    
    })
# %%
output['State'] = output['State'].str.replace(' ','_').str.lower()
# %%
output.round(2).to_csv('../final/buildings_data.csv', index=False)
# %%
