import csv
import io
import sys
import time
import urllib.parse
import urllib.request

import openpyxl

# Fetches each state's electricity supply and trade from the EIA State
# Electricity Profiles, Table 10 "Supply and disposition of electricity", and
# writes one CSV row per state to stdout. For now, only the latest year in the
# profiles. See ENERGY_EXPORT_IMPORT_PLAN.md
#
# Each state's profile is one spreadsheet, so this makes one request per state.
# No API key is needed.
#
# Usage: python scripts/fetch_eia_trade.py > raw/eia_state_electricity_trade.csv

# One spreadsheet per state, named by its postal abbreviation
URL = 'https://www.eia.gov/electricity/state/xls/SEP Tables for {abbr}.xlsx'
SHEET = '10. Source-Disposition'
# Be polite to EIA between requests
PAUSE_SECONDS = 0.5

# 50 states + DC, by the slugs the rest of the data uses
STATE_ABBRS = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
    'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'district_of_columbia': 'DC',
    'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL',
    'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA',
    'maine': 'ME', 'maryland': 'MD', 'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN',
    'mississippi': 'MS', 'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
    'new_hampshire': 'NH', 'new_jersey': 'NJ', 'new_mexico': 'NM', 'new_york': 'NY',
    'north_carolina': 'NC', 'north_dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK', 'oregon': 'OR',
    'pennsylvania': 'PA', 'rhode_island': 'RI', 'south_carolina': 'SC', 'south_dakota': 'SD',
    'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT', 'virginia': 'VA',
    'washington': 'WA', 'west_virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY',
}

# Table 10 rows to keep (as labeled in the sheet) and their CSV columns, all in
# megawatthours. EIA's net interstate trade is total supply minus sales, direct
# use, international exports and estimated losses, and is negative for a net
# importer
ROWS = {
    'Total net generation': 'net_generation',
    'Total international imports': 'international_imports',
    'Total international exports': 'international_exports',
    'Net interstate trade': 'net_interstate_trade',
    'Total supply': 'total_supply',
    'Total electric industry sales': 'retail_sales',
}


def fetch_table(abbr):
    """The Table 10 sheet's rows, as lists of cell values"""
    url = urllib.parse.quote(URL.format(abbr=abbr), safe=':/')
    with urllib.request.urlopen(url, timeout=60) as response:
        workbook = openpyxl.load_workbook(io.BytesIO(response.read()), read_only=True)
    # Read-only workbooks stay open until closed
    try:
        return [list(row) for row in workbook[SHEET].iter_rows(values_only=True)]
    finally:
        workbook.close()


def latest_year(rows):
    """The latest year's values for ROWS. The header row's columns are labeled
    like "Year\\n2024", newest first"""
    header = next(row for row in rows if row and row[0] == 'Category')
    year = int(str(header[1]).split()[-1])
    values = {}
    for row in rows:
        label = str(row[0]).strip() if row and row[0] else ''
        if label in ROWS:
            values[ROWS[label]] = int(row[1] or 0)
    missing = set(ROWS.values()) - set(values)
    if missing:
        raise ValueError(f'Missing rows: {", ".join(sorted(missing))}')
    return year, values


if __name__ == '__main__':
    writer = csv.writer(sys.stdout)
    writer.writerow(['state', 'year'] + list(ROWS.values()))

    for state, abbr in STATE_ABBRS.items():
        year, values = latest_year(fetch_table(abbr))
        writer.writerow([state, year] + [values[col] for col in ROWS.values()])
        print(f'{state}: {year}', file=sys.stderr)
        time.sleep(PAUSE_SECONDS)
