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
| Buildings (`buildings`) | Residential, Commercial (except waste and refrigerant leaks, below) |
| Transportation (`transportation`) | Transportation |
| Dumps, farms, industrial & other (`dumps_farms_industrial_other`) | Industry, Agriculture, the waste subsectors EPA files under Commercial (municipal landfills, wastewater treatment, composting, anaerobic digestion), refrigerant (HFC) leaks EPA files under Residential and Commercial ("Substitution of Ozone Depleting Substances"), and the non-combustion parts of Electric Power Industry (SF6 from electrical equipment, carbonates used in scrubbers) |

Land use and forestry (LULUCF) carbon sinks and U.S. territories are left out. The `united_states` totals are the sum of the 50 states + DC. EPA's "National" rows only contain unallocated leftovers, which are all zero.

## Power generation

The power generation mix (and the "% carbon-free" stat) comes from the EIA's annual net generation by state and energy source, for all sectors, currently covering **2001–2025** (bulk file updated September 2026). We use EIA's [bulk download](https://www.eia.gov/opendata/bulkfiles.php) because it includes small-scale (rooftop) solar, which is a large share of solar in many states. The [historical state data](https://www.eia.gov/electricity/data/state/) spreadsheets are utility-scale only.

EIA only estimates small-scale solar from 2014 on, and its "all solar" series starts then too. For earlier years the conversion fills `all_solar` in from utility-scale solar, so solar shows a jump in 2014 when rooftop solar starts being counted.

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

## Vehicles

The "Vehicles Electrified" stat comes from the AFDC's [Vehicle Registration Counts by State](https://afdc.energy.gov/vehicle-registration), currently **2025** (counts as of the end of the year). These are light-duty vehicles (cars, SUVs and pickups) by fuel type, derived by the National Laboratory of the Rockies from Experian registration data. AFDC adds a new year about once a year.

We use AFDC for both numbers: EVs are the "Electric (EV)" column (all-electric only, plug-in hybrids aren't counted), and the total is every fuel type added up. Using one source keeps both numbers the same year and the same definition of a light-duty vehicle.

AFDC publishes each year as a table on that page, picked with `?year=` (its downloadable spreadsheets lag a year or more behind), so we convert saved copies of the page to `raw/afdc_vehicle_registrations.csv` with `scripts/convert_afdc_registrations.py`. The raw CSV keeps every year from **2016** (the first AFDC publishes) to the latest. The headline stats use the latest year, and the EV growth chart on each state page uses all of them (`byYear` in `vehicles.json`).

### Updating to a new AFDC release

1. Open the [AFDC vehicle registration page](https://afdc.energy.gov/vehicle-registration) and check that it shows the newest year.
2. Save the page into this `data/` folder as `afdc_vehicle_registration.html` (in most browsers, File > Save Page As, "Webpage, HTML Only"). HTML files here are ignored by git.
3. Add the new year to the raw CSV, then rebuild the final JSON. Years already in the raw CSV are kept, and a year in the page replaces the same year in the CSV (AFDC sometimes revises past years):

   ```bash
   make update-vehicles-raw AFDC_HTML=afdc_vehicle_registration.html
   make final/vehicles/vehicles.json
   ```

   Or with Docker: `docker-compose run --rm --entrypoint "make update-vehicles-raw final/vehicles/vehicles.json AFDC_HTML=afdc_vehicle_registration.html" make`

   To re-pull several years, save each one (`https://afdc.energy.gov/vehicle-registration?year=2016` and so on) and pass them all, e.g. `AFDC_HTML="afdc_2016.html afdc_2017.html"`.
4. Delete the HTML files from `data/`.
5. Update the `vehicles` entry in `src/constants/source-citations.js` (title year range and date).
6. Update the year in the first paragraph of this section.

## Home heating

The buildings section ("X% of homes already heat without burning any fuel") and its chart over time come from the Census Bureau's American Community Survey (ACS) 1-year estimates, table **B25040 House Heating Fuel**, currently covering **2005–2025** (2025 released October 2026). It's the number of occupied homes in each state by main heating fuel. The headline stats use the latest year. The Census releases a new year every fall.

There's no 2020: the Census didn't publish standard 1-year estimates that year because of COVID, so the chart draws a dashed line over it.

We only track each home's **main heating source**, not stoves, water heaters or commercial buildings. Homes heated with electricity or solar, or that don't use any heating fuel (common in Hawaii and Florida), count as already fossil-free. Homes heated with gas, propane, fuel oil, coal, wood or other fuels count as still to electrify. See `get_buildings.py`.

These are survey estimates, so each comes with a margin of error (90% confidence). We keep the margins in `raw/acs_house_heating_fuel.csv` and the chart shades them, since small states' year-to-year changes can be mostly noise.

### Updating to a new ACS release

The raw CSV comes from the [Census API](https://www.census.gov/data/developers/data-sets/acs-1year.html), one request per year for every state. It needs a free API key in `data/.env` (see [Environment variables](../README.md#environment-variables)).

1. Refetch every year (re-fetching all of them picks up any Census revisions too):

   ```bash
   make update-buildings-raw
   ```

   This saves `raw/acs_house_heating_fuel.csv`, from last year back to 2005. If last year isn't released yet, it's skipped.
2. Rebuild the final JSON:

   ```bash
   make final/buildings/buildings.json
   ```

   Or with Docker: `docker-compose run --rm --entrypoint "make final/buildings/buildings.json" make`
3. Update the `home-heating` entry in `src/constants/source-citations.js` (title years, date and the `ACSDT1Y<year>` part of the link).
4. Update the years and release date in the first paragraph of this section.

## Data updates page

The [data updates page](https://decarbmystate.com/data-updates) (`src/pages/data-updates.js`) shows how each state's key stats changed with the 2020 to 2025 data update. It reads a frozen snapshot, `src/data/data-updates/2020-2025.json`, made by `scripts/build-data-update.mjs`.

The script compares the site's stats at `BASE_REF` (default `main`) with the working tree, so run it on a data update branch before it's merged:

```bash
node scripts/build-data-update.mjs
```

After the merge `main` already has the new data, so to rebuild the snapshot later set `BASE_REF` to the commit before the merge: `BASE_REF=<commit> node scripts/build-data-update.mjs`.

