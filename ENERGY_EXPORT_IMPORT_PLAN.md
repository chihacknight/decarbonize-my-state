# Energy Export vs Import Plan

Show how much electricity each state imports from or exports to other states, because it changes how we should read a state's power emissions.

## Why it matters

The EPA emissions inventory we use counts emissions from power **generated** in each state. So:

- A big **net importer** (e.g. California, Virginia) gets credit for clean generation at home while buying fossil power from its neighbors, so its power emissions look lower than what its homes and businesses actually use.
- A big **net exporter** (e.g. Pennsylvania, Wyoming) carries emissions for power that's used elsewhere, so its power emissions look higher.

Showing trade as a share of supply flags this on each state page.

## Data source

**EIA State Electricity Profiles, "Supply and Disposition of Electricity"** (Table 10 of each state's profile).

- Annual, every state, 1990 to the latest profile year, in megawatthours (MWh).
- Includes total supply, **net interstate trade** (imports minus exports; the sign says whether a state is a net importer or exporter), and international imports and exports.
- Available from EIA's API v2 (`electricity/state-electricity-profiles/source-disposition`, needs a free EIA API key) or as per-state spreadsheets on each state's profile page.

For a sense of scale: in 2023 Virginia had the largest net interstate receipts, 50.1 million MWh, 36% of its supply. In 2019 California's net imports were 70.8 million MWh (25% of supply) and Pennsylvania's net exports 70.5 million MWh (24%).

A longer history (back to 1960) exists in EIA's State Energy Data System (SEDS) as "net interstate flow of electricity", but in energy units (Btu). Only worth it if we want history before 1990.

## What we'd show

- **Net trade as a share of total supply**, e.g. "Virginia imports 36% of its electricity from other states" or "Pennsylvania exports 24% of the electricity it generates".
- Shown in the power section of each state page, next to the carbon-free share, with a short note on what it means for emissions.
- Later, possibly a trend over time, like the other trend charts.

## What it doesn't tell us

**The data has no fuel breakdown.** Net trade is one number per state per year, so it says how much power crossed state lines, not whether it came from coal, gas or wind. EIA suggests using exporting states' generation mix as a rough estimate, but the data doesn't say which states traded with which.

Ways to estimate the fuel mix of imports, for a possible phase 2:

1. **Neighbors' generation mix.** Assume imports look like the region's exporting states. Easy with data we have, but coarse.
2. **EIA Hourly Electric Grid Monitor (EIA-930).** Hourly flows between balancing authorities (like PJM or CAISO) plus each one's generation by fuel, so imports can be traced to fuels. Balancing authorities don't line up with state lines.
3. **Open Grid Emissions (Singularity Energy).** Already publishes consumption-based emission rates by balancing authority, with imports accounted for. Closest to a fair "emissions including imports" number. Check which years it covers.
4. **State reporting.** A few states, like California, report imports by fuel themselves. Precise, but only for those states.

## Caveats to show on the site

- **It's a residual.** EIA calculates net trade as total supply minus retail sales, direct use, international exports and *estimated* line losses, so small states can show some noise.
- **State lines, not grids.** Power flows across regional grids, and state totals are an accounting view of them.
- **Net, not gross.** A state can import and export a lot at once and show a small net number.

## Latest-year test (done)

Fetched Table 10 for every state from the per-state profile spreadsheets (no API key needed), latest year **2024** (released November 2025):

- **Checks out against EIA.** Virginia's 2023 net imports of 50.1M MWh, 35.5% of supply, match EIA's published figure. Interstate exports (394.9M MWh) and imports (399.0M MWh) balance within about 1%, and Alaska and Hawaii show exactly 0.
- **Biggest net importers (share of supply):** D.C. 98%, Delaware 62%, Massachusetts 61%, Maryland 43%, Tennessee 31%, Virginia 31%. California is 21% counting imports from other countries.
- **Biggest net exporters (share of generation):** Wyoming 52%, Montana 38%, Pennsylvania 35% (84.7M MWh, the most of any state), Connecticut 34%, Alabama 32%.
- **International trade matters.** Vermont exports to other states but imports more from Canada, so it's a net importer (42%). Washington is about even with other states but exports 7.5M MWh to Canada. So we count both.

The state pages now show this under the power generation pie chart, with a bar of made in state vs imported (or used in state vs exported) and a note on which way it skews the state's power emissions. States within 2% either way read as generating about what they use.

## Steps

1. **Latest-year test.** Done, see above.
2. **Pipeline.** Done for the latest year: `data/scripts/fetch_eia_trade.py` saves `data/raw/eia_state_electricity_trade.csv`, `data/scripts/get_trade.py` builds `data/final/trade/trade.json`, with `make update-trade-raw` and a section in `data/UPDATE_PROCESS.md`. Next: keep every year (back to 1990) in a `byYear` array, like the other datasets.
3. **Site.** The stat and note under the power pie chart are in. Next: a trend chart if it's useful.
4. **Phase 2, maybe.** An estimated fuel mix or emissions including imports, using one of the approaches above.

## Open questions

- ~~API or spreadsheets?~~ Spreadsheets: no key needed, and 51 small downloads are fine.
- ~~Share of what?~~ Imports as a share of supply (what a state uses), exports as a share of generation (what it makes).
- ~~Include international trade?~~ Yes, it flips Vermont from exporter to importer.
- How prominent should it be: a stat with a note (for now), or something that adjusts how we present power emissions?

## Sources

- [EIA Today in Energy: net interstate electricity trade, 2023](https://www.eia.gov/todayinenergy/detail.php?id=64104)
- [EIA Today in Energy: California the largest net importer, 2019](https://www.eia.gov/todayinenergy/detail.php?id=46156)
- [EIA State Electricity Profiles](https://www.eia.gov/electricity/state/)
- [EIA State Energy Data System (SEDS)](https://www.eia.gov/state/seds/seds-data-complete.php)
- [EIA Hourly Electric Grid Monitor](https://www.eia.gov/electricity/gridmonitor/)
