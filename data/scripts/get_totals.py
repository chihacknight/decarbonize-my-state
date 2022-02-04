import sys
import csv
import json
from slugify import slugify

from utils import thousandsToInt, strToFloat, strToInt, \
    states_territories, fieldnames, processRow, calcPercent


if __name__ == '__main__':
    input1 = sys.argv[1]

    with open(input1) as csvfile:
        dictreader = csv.DictReader(csvfile, fieldnames=fieldnames)
        for index, row in enumerate(dictreader):
            
            # the totals row is in position 4 on the CSV file
            if index == 4:
                row = processRow(row)
                row['total-employed'] = thousandsToInt(row['total-employed'])

                print(json.dumps([row], indent=4))
                break

