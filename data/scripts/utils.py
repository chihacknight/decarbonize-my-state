states_territories = [
    'alabama',
    'alaska',
    'arizona',
    'arkansas',
    'california',
    'colorado',
    'connecticut',
    'delaware',
    'district-of-columbia',
    'florida',
    'georgia',
    'guam',
    'hawaii',
    'idaho',
    'illinois',
    'indiana',
    'iowa',
    'kansas',
    'kentucky',
    'louisiana',
    'maine',
    'maryland',
    'massachusetts',
    'michigan',
    'minnesota',
    'mississippi',
    'missouri',
    'montana',
    'nebraska',
    'nevada',
    'new-hampshire',
    'new-jersey',
    'new-mexico',
    'new-york',
    'north-carolina',
    'north-dakota',
    'ohio',
    'oklahoma',
    'oregon',
    'pennsylvania',
    'puerto-rico',
    'rhode-island',
    'south-carolina',
    'south-dakota',
    'tennessee',
    'texas',
    'utah',
    'vermont',
    'virgin-islands',
    'virginia',
    'washington',
    'west-virginia',
    'wisconsin',
    'wyoming'
]

fieldnames = [
    'sort-order',
    'occupation-slug',
    'occupation',
    'total-employed',
    'perc-women',
    'perc-white',
    'perc-black-aa',
    'perc-asian',
    'perc-hispanic-latino',
    'perc-union',
    'age-16-19',
    'age-20-24',
    'age-25-34',
    'age-35-44',
    'age-45-54',
    'age-55-64',
    'age-65-plus',
    'age-median',
    'weekly-earnings',
    'states-total-employed',
    'alabama',
    'alaska',
    'arizona',
    'arkansas',
    'california',
    'colorado',
    'connecticut',
    'delaware',
    'district-of-columbia',
    'florida',
    'georgia',
    'guam',
    'hawaii',
    'idaho',
    'illinois',
    'indiana',
    'iowa',
    'kansas',
    'kentucky',
    'louisiana',
    'maine',
    'maryland',
    'massachusetts',
    'michigan',
    'minnesota',
    'mississippi',
    'missouri',
    'montana',
    'nebraska',
    'nevada',
    'new-hampshire',
    'new-jersey',
    'new-mexico',
    'new-york',
    'north-carolina',
    'north-dakota',
    'ohio',
    'oklahoma',
    'oregon',
    'pennsylvania',
    'puerto-rico',
    'rhode-island',
    'south-carolina',
    'south-dakota',
    'tennessee',
    'texas',
    'utah',
    'vermont',
    'virgin-islands',
    'virginia',
    'washington',
    'west-virginia',
    'wisconsin',
    'wyoming',
    'education',
    'experience',
    'training',
    'green-job'
]

def processRow(row):
    # states total employed is the accurate value and will be used 
   #row['total-employed'] = strToInt(row['states-total-employed'])
   #row.pop('states-total-employed', None)
    
    age_rows = [
        'age-16-19',
        'age-20-24',
        'age-25-34',
        'age-35-44',
        'age-45-54',
        'age-55-64',
        'age-65-plus'
    ]

    total_age = 0
    for index in age_rows:
        total_age += strToInt(row[index])

    for index in age_rows:
        row[index] = calcPercent(row[index], total_age)

    # Convert to floats
    for index in [
        'perc-women',
        'perc-white',
        'perc-black-aa',
        'perc-asian',
        'perc-hispanic-latino',
        'perc-union',
        'age-median'
    ]:
        row[index] = strToFloat(row[index])

    # Convert string to ints
    for index in [
        'weekly-earnings'
    ]:
        row[index] = strToInt(row[index])

    for index in states_territories:
        row[index] = strToInt(row[index])

    # Handle #N/A values
    for index in [
        'education',
        'experience',
        'training'
    ]:
        row[index] = strFormat(row[index])

    row['green-job'] = True if row['green-job'] == '1' else False

    return row

def thousandsToInt(string):
    try:
        return int(string.replace(',', '')) * 1000
    except ValueError:
        return None


def strToFloat(string):
    try:
        return float(string)
    except ValueError:
        return None


def calcPercent(top, bottom):
    top = strToInt(top)
    bottom = strToInt(bottom)

    if top and bottom:
        return round(float(top) / bottom * 100, 1)
    else:
        return None

# Despite the name, this actually calculates jobs per ten thousand
def calcPerThousand(top, bottom):
    top = strToInt(top)
    bottom = strToInt(bottom)
    
    if top and bottom:
        return round(float(top) / bottom * 10000, 1)
    else:
        return None

def strToInt(s):
    if s is None or isinstance(s, int):
        return s
    s = s.replace('$', '').replace(',', '')
    
    try:
        return int(s)
    except ValueError:
        return None

def strFormat(string):
    if string == "#N/A":
        return None
    else:
        return string
