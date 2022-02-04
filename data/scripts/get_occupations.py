import sys
import csv
import json
from slugify import slugify

from utils import thousandsToInt, strToFloat, strToInt, strFormat, \
    calcPercent, calcPerThousand, states_territories, fieldnames, processRow

if __name__ == '__main__':
    input = sys.argv[1]

    # extract 'Total, 16 years and over' for totals per state
    totals_row = {}
    with open(input) as csvfile:
        dictreader = csv.DictReader(csvfile, fieldnames=fieldnames)
        for index, row in enumerate(dictreader):
            
            # the totals row is in position 4 on the CSV file
            if index == 4:
                totals_row = processRow(row)
                break

    data = []
    with open(input) as csvfile:
        dictreader = csv.DictReader(csvfile, fieldnames=fieldnames)

        # skip the header rows and the totals row
        for skip in range(5):
            next(dictreader)

        for row in dictreader:
            if row['occupation']:
                row['occupation-slug'] = slugify(row['occupation'])
                row['total-employed'] = thousandsToInt(row['total-employed'])
                row = processRow(row)

                for s in states_territories:
                    # calculate concentration of occupation in this state
                    row[s + '-concentration'] = calcPercent(row[s],row['states-total-employed'])
                    row[s + '-perthousand'] = calcPerThousand(row[s],totals_row[s])

                # calculate percent other race
                if (row['perc-white'] is not None):
                    row['perc-other'] = round((100.0 - row['perc-white'] - row['perc-asian'] - row['perc-black-aa']), 1)

                data.append(row)

    print(json.dumps(data, indent=4))
