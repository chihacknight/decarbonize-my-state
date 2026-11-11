import csv
import datetime
import json
import os
import sys
import time
import urllib.error
import urllib.request

# Fetches American Community Survey (ACS) 1-year table B25040 "House Heating
# Fuel" (occupied homes by main heating fuel) for every state and year from the
# Census API, newest year first, and writes one CSV row per state and year to
# stdout. One request per year covers every state. See UPDATE_PROCESS.md
#
# The API needs a free key (https://api.census.gov/data/key_signup.html), read
# from CENSUS_API_KEY in the environment or in data/.env (see .env.example).
#
# Usage: python scripts/fetch_acs_heating_fuel.py [latest_year] > raw/acs_house_heating_fuel.csv
# latest_year defaults to last year. If it isn't released yet, it's skipped

FIRST_YEAR = 2005
# ACS didn't publish standard 1-year estimates for 2020 (COVID disrupted
# collection), only experimental ones
SKIP_YEARS = {2020}
# Be polite to the API between requests
PAUSE_SECONDS = 1

# Estimate and margin of error for each B25040 line (001 total ... 010 no fuel)
VARIABLES = [f'B25040_{line:03d}{kind}' for line in range(1, 11) for kind in ('E', 'M')]


ENV_PATH = os.path.join(os.path.dirname(__file__), '..', '.env')


def get_api_key():
    """CENSUS_API_KEY from the environment, or else from data/.env"""
    if os.environ.get('CENSUS_API_KEY'):
        return os.environ['CENSUS_API_KEY']
    if os.path.exists(ENV_PATH):
        with open(ENV_PATH) as env_file:
            for line in env_file:
                name, _, value = line.strip().partition('=')
                if name == 'CENSUS_API_KEY' and value:
                    return value.strip('"\'')
    return None


def fetch_year(year, api_key):
    url = (f'https://api.census.gov/data/{year}/acs/acs1'
           f'?get={",".join(VARIABLES)}&for=state:*&key={api_key}')
    request = urllib.request.Request(url, headers={'User-Agent': 'state-decarb-data-script'})
    with urllib.request.urlopen(request, timeout=60) as response:
        rows = json.load(response)
    header, data = rows[0], rows[1:]
    return [dict(zip(header, row)) for row in data]


def main():
    latest_year = int(sys.argv[1]) if len(sys.argv) > 1 else datetime.date.today().year - 1
    api_key = get_api_key()
    if not api_key:
        sys.exit('Set CENSUS_API_KEY in data/.env (see data/.env.example)')
    writer = csv.writer(sys.stdout)
    writer.writerow(['state_fips', 'year'] + VARIABLES)

    for year in range(latest_year, FIRST_YEAR - 1, -1):
        if year in SKIP_YEARS:
            continue
        try:
            rows = fetch_year(year, api_key)
        except urllib.error.HTTPError as error:
            # The newest year may not be released yet, keep going back
            if year == latest_year and error.code == 404:
                print(f'{year}: not released yet', file=sys.stderr)
                continue
            sys.exit(f'{year}: failed ({error}), stopping')
        except (urllib.error.URLError, json.JSONDecodeError) as error:
            # A bad key or an outage fails every year the same way, so stop
            sys.exit(f'{year}: failed ({error}), stopping')
        else:
            for row in sorted(rows, key=lambda r: r['state']):
                writer.writerow([row['state'], year] + [row[v] for v in VARIABLES])
            print(f'{year}: {len(rows)} states', file=sys.stderr)
        time.sleep(PAUSE_SECONDS)


if __name__ == '__main__':
    main()
