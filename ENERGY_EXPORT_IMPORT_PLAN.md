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

## Steps

1. **Latest-year test.** Fetch net interstate trade and total supply for the latest year for every state, check the numbers against EIA's published figures (Virginia, California and Pennsylvania above), and look at the ranking. This decides whether it's worth building out.
2. **Pipeline.** Following the other datasets:
   - `data/scripts/fetch_eia_trade.py` saves `data/raw/eia_state_electricity_trade.csv` (all years, every state).
   - `data/scripts/get_trade.py` builds `data/final/trade/trade.json`, with the latest year's values and a `byYear` array.
   - `data/Makefile` targets and a section in `data/UPDATE_PROCESS.md`.
   - An `EIA_API_KEY` in `data/.env` if we use the API (documented in `data/.env.example`, like the Census key).
3. **Site.** The stat and note in the power section, then a trend chart if it's useful.
4. **Phase 2, maybe.** An estimated fuel mix or emissions including imports, using one of the approaches above.

## Open questions

- API (needs a key) or the published spreadsheets (no key, but one file per state)?
- Show trade as a share of supply, of in-state generation, or of sales? Share of supply matches how EIA reports it.
- Include international trade (matters for border states like Vermont, Washington and Michigan), or interstate only?
- How prominent should it be: a stat with a note, or something that adjusts how we present power emissions?

## Sources

- [EIA Today in Energy: net interstate electricity trade, 2023](https://www.eia.gov/todayinenergy/detail.php?id=64104)
- [EIA Today in Energy: California the largest net importer, 2019](https://www.eia.gov/todayinenergy/detail.php?id=46156)
- [EIA State Electricity Profiles](https://www.eia.gov/electricity/state/)
- [EIA State Energy Data System (SEDS)](https://www.eia.gov/state/seds/seds-data-complete.php)
- [EIA Hourly Electric Grid Monitor](https://www.eia.gov/electricity/gridmonitor/)
