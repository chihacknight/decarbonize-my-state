#%%
import geopandas as gpd
import pandas as pd
import fiona

#%%
path_to_cali_ms_data = "F:/CHI-HACK/decarb/sanity/MS/California.geojson/cali.gpkg"
path_to_il_ms_data = "F:/CHI-HACK/decarb/sanity/MS/Illinois.geojson/il.gpkg"
path_to_vt_ms_data = "F:/CHI-HACK/decarb/sanity/MS/Vermont.geojson/vt.gpkg"
# %%
path_to_chicago_footprints_gov_data = "F:/CHI-HACK/decarb/sanity/CHI_FOOTPRINTS/buildings.shp"
path_to_la_footprints_gov_data = "F:/CHI-HACK/decarb/sanity/LA_FOOTPRINTS/e63e5597-6c0d-464f-8ba1-a7288771575e2020330-1-h41qrd.fsqij.shp"
path_to_vt_footprints_gov_data = "F:/CHI-HACK/decarb/sanity/vt.gpkg"

# %%
cali_ms = gpd.read_file(path_to_cali_ms_data)
il_ms = gpd.read_file(path_to_il_ms_data)
vt_ms = gpd.read_file(path_to_vt_ms_data)
chicago_footprints = gpd.read_file(path_to_chicago_footprints_gov_data)
la_footprints = gpd.read_file(path_to_la_footprints_gov_data)
vt_footprints = gpd.read_file(path_to_vt_ms_data)
# %%
# Get bounding hull for chicago and LA
chicago_footprints['geometry'] = chicago_footprints['geometry'].centroid
chicago_footprints84 = chicago_footprints[chicago_footprints.geometry.notnull()].to_crs('EPSG:4326')
chi_bounds = chicago_footprints84.unary_union.convex_hull

la_footprints['geometry'] = la_footprints['geometry'].centroid
la_bounds = la_footprints[la_footprints.geometry.notnull()].unary_union.convex_hull
# %%
# Convert to centroids, and get buildings within
cali_ms['geometry'] = cali_ms['geometry'].centroid
within_la = cali_ms[cali_ms.geometry.within(la_bounds)]
il_ms['geometry'] = il_ms['geometry'].centroid
within_chi = il_ms[il_ms.geometry.within(chi_bounds)]
# %% 
# Results!
print(f"VERMONT E911: {len(vt_footprints)} footprints. MS: {len(vt_ms)}")
print(f"CHI FOOTPRINTS: {len(chicago_footprints)} footprints. MS: {len(within_chi)}")
print(f"LA FOOTPRINTS: {len(la_footprints)} footprints. MS: {len(within_la)}")
# VERMONT E911: 419331 footprints. MS: 351266
# CHI FOOTPRINTS: 820606 footprints. MS: 907967
# LA FOOTPRINTS: 1122422 footprints. MS: 1339971