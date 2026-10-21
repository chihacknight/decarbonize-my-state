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
| Dirty power (`dirty_power`) | Electric Power Industry, fuel combustion only (fossil fuel CO2, stationary combustion, waste incineration) |
| Buildings (`buildings`) | Residential, Commercial (except waste, below) |
| Transportation (`transportation`) | Transportation |
| Dumps, farms, industrial & other (`dumps_farms_industrial_other`) | Industry, Agriculture, the waste subsectors EPA files under Commercial (municipal landfills, wastewater treatment, composting, anaerobic digestion), and the non-combustion parts of Electric Power Industry (SF6 from electrical equipment, carbonates used in scrubbers) |

Land use and forestry (LULUCF) carbon sinks and U.S. territories are left out. The `united_states` totals are the sum of the 50 states + DC. EPA's "National" rows only contain unallocated leftovers, which are all zero.

## Power generation

The power generation mix (and the "% carbon-free" stat) comes from the EIA's annual net generation by state and energy source, for all sectors, currently covering **2001–2025** (bulk file updated September 2026). We use EIA's [bulk download](https://www.eia.gov/opendata/bulkfiles.php) because it includes small-scale (rooftop) solar, which is a large share of solar in many states. The [historical state data](https://www.eia.gov/electricity/data/state/) spreadsheets are utility-scale only.

The bulk file (`ELEC.zip`) is ~300MB, so we convert it to `raw/eia_state_net_generation.csv` (~200KB) and commit that CSV instead. The conversion (`scripts/convert_eia_bulk.py`) keeps the annual all-sector net generation series (IDs like `ELEC.GEN.COW-IL-99.A`) for the 50 states + DC, one column per energy source. Values are in thousand megawatthours (GWh).

### Updating to a new EIA release

1. On the [EIA bulk download page](https://www.eia.gov/opendata/bulkfiles.php), download the "Electricity" zip (`ELEC.zip`) and move it into this `data/` folder (zips here are ignored by git). EIA updates it as new data comes in. Final annual data for a year usually lands around September of the next year.
2. Convert the bulk file into the raw CSV, then rebuild the final JSON:

   ```bash
   make update-generation-raw EIA_ZIP=ELEC.zip
   make final/power_generation/power_generation.json
   ```

   Or with Docker: `docker-compose run --rm --entrypoint "make update-generation-raw final/power_generation/power_generation.json EIA_ZIP=ELEC.zip" make`
3. Delete the zip from `data/`.
4. Update the `power-generation` entry in `src/constants/source-citations.js` (title year range and date).
5. Update the years in the first paragraph of this section.

### How the site uses it

`group_df_by_generation` in `scripts/utils.py` computes each source's share of generation from seven sources: coal, natural gas, petroleum liquids, nuclear, hydroelectric, all solar (utility-scale + small-scale) and wind. "% carbon-free" on the state page is nuclear + hydro + solar + wind. Other sources (biomass, wood, other gases, geothermal, pumped storage) are left out of the total, so states with a lot of those (e.g. Vermont's wood power) show a higher carbon-free share.

## Wind and solar built

The "MWs of Wind and Solar Built" stat compares each state's wind and solar targets (`raw/state_renewable_gen_targets.csv`) with how much wind and solar it generates today. `scripts/get_target_generations.py` takes "today" from the latest year of the [power generation](#power-generation) data (`all_solar`, which includes small-scale solar, and `wind`), so this updates automatically when the power generation data does. Run `make final/target_generation/target_generation.json` after updating it.

Everything here is **generation in GWh per year**, not installed capacity. The site converts to "MW" by dividing by the hours in a year, so these are average MW. Don't compare them with nameplate capacity figures (e.g. state clean energy dashboards), which run about 3x higher for wind and 4-5x higher for solar.

The targets (`total_gen_by_solar`, `total_gen_by_wind`) were added in April 2022 and their source isn't recorded. They appear to be sized to roughly double each state's electricity use. Percent built is current / target per source, capped at 100%, and the bar shows the average of the solar and wind percentages.
