# Buildings Data Notes

Sources:

- [Microsoft building footprint counts](https://github.com/microsoft/USBuildingFootprints#should-we-import-the-data-into-openstreetmap)
- National Renewable Energy Lab building energy types (see [Commercial](https://comstock.nrel.gov/), [Residential](https://resstock.nrel.gov/), also, direct links to [ComStock meta](https://data.openei.org/s3_viewer?bucket=oedi-data-lake&prefix=nrel-pds-building-stock%2Fend-use-load-profiles-for-us-building-stock%2F2021%2Fcomstock_tmy3_release_1%2Ftimeseries_aggregates_metadata%2F) and [ResStock meta](https://data.openei.org/s3_viewer?bucket=oedi-data-lake&prefix=nrel-pds-building-stock%2Fend-use-load-profiles-for-us-building-stock%2F2021%2Fresstock_amy2018_release_1%2Ftimeseries_aggregates_metadata%2F) full data)

Methods:

- Microsoft data taken directly, a little clean up by nothing major
- ComStock and ResStock, grouping by state name, then filtering for non-electric heating, water, and cooking range sources. Pandas used to calculate percentages of buildings, nothing fancy!

Other experiments:

- OSM was attempted to see if the building coverage was good, but unfortunately it was not. See `scripts/osm_building_count.py` for posterity
- See also `sanity_check_ms_data` for methodology on a quick validation on MS data.
