# Data Update Process

How to refresh each dataset behind the site. All commands below are run from this `data/` folder. For how the pipeline works in general, see [Data processing](../README.md#data-processing) in the main README.

## Emissions

Emissions totals and the sector breakdown come from the EPA's [Inventory of U.S. Greenhouse Gas Emissions and Sinks by State](https://www.epa.gov/ghgemissions/state-ghg-emissions-and-removals), currently covering **1990–2022** (released August 2024). EPA updates it about once a year, after the national inventory. Check the page above for a newer zip.

EPA publishes it as a zip containing a ~20MB Excel workbook, which is too big to keep in git. We convert it to `raw/epa_state_ghg_by_econ_sector.csv` (~1MB) and commit that CSV instead. The conversion (`scripts/convert_epa_workbook.py`) keeps only the "Data by Economic Sectors" sheet and sums it by state, economic sector and subsector for the 50 states + DC. Values are in million metric tons CO2e.

### Updating to a new EPA release

1. On the [EPA state GHG page](https://www.epa.gov/ghgemissions/state-ghg-emissions-and-removals), download the "all state GHG data" zip (e.g. `allstateghgdata90-22_v082924.zip`) and move it into this `data/` folder (zips here are ignored by git).
2. Convert the workbook into the raw CSV, then rebuild the final JSON, setting `EPA_ZIP` to the zip's filename:

   ```bash
   make update-emissions-raw EPA_ZIP=allstateghgdata90-22_v082924.zip
   make final/emissions/emissions.json
   ```

   Or with Docker: `docker-compose run --rm --entrypoint "make update-emissions-raw final/emissions/emissions.json EPA_ZIP=allstateghgdata90-22_v082924.zip" make`
3. Delete the zip from `data/`.
4. Update the `emissions` entry in `src/constants/source-citations.js` (title year range and date).
5. Update the release years in the first paragraph of this section.
6. Regenerate the state social cards (see [Social Cards](../README.md#social-cards)), since they show each state's emissions rank.

### How EPA sectors map to the site's categories

The mapping lives in `get_emissions_bucket` in `scripts/utils.py`:

| Site category | EPA economic sectors |
|---|---|
| Dirty power (`dirty_power`) | Electric Power Industry |
| Buildings (`buildings`) | Residential, Commercial (except waste, below) |
| Transportation (`transportation`) | Transportation |
| Dumps, farms, industrial & other (`dumps_farms_industrial_other`) | Industry, Agriculture, and the waste subsectors EPA files under Commercial (municipal landfills, wastewater treatment, composting, anaerobic digestion) |

Land use and forestry (LULUCF) carbon sinks and U.S. territories are left out. The `united_states` totals are the sum of the 50 states + DC. EPA's "National" rows only contain unallocated leftovers, which are all zero.
