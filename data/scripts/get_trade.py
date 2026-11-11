import csv
import json
import sys

# Builds each state's net electricity imports or exports from the EIA State
# Electricity Profiles supply and disposition table (raw CSV from
# scripts/fetch_eia_trade.py). See ENERGY_EXPORT_IMPORT_PLAN.md
#
# Net imports combine trade with other states and with other countries, since
# leaving international trade out gets border states wrong (Vermont trades
# power out to other states but imports more from Canada). Positive is a net
# importer, negative a net exporter. All values are in megawatthours.
#
# Usage: python scripts/get_trade.py raw/eia_state_electricity_trade.csv > final/trade/trade.json


def build_row(row):
    supply = int(row['total_supply'])
    generation = int(row['net_generation'])
    # EIA's net interstate trade is negative for a net importer
    interstate = -int(row['net_interstate_trade'])
    international = int(row['international_imports']) - int(row['international_exports'])
    net_imports = interstate + international

    return {
        'state': row['state'],
        'year': int(row['year']),
        'totalSupply': supply,
        'netGeneration': generation,
        'netImports': net_imports,
        'interstateNetImports': interstate,
        'internationalNetImports': international,
        # Imports as a share of the electricity a state uses (its supply), and
        # exports as a share of what it generates
        'netImportsPct': round(100 * net_imports / supply, 1) if net_imports > 0 else 0,
        'netExportsPct': round(-100 * net_imports / generation, 1) if net_imports < 0 else 0,
    }


if __name__ == '__main__':
    with open(sys.argv[1]) as f:
        rows = [build_row(row) for row in csv.DictReader(f)]
    print(json.dumps(rows))
