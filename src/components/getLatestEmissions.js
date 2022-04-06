// unpack the us emissions data for 2018 and total up all 4 categories by state
export function getLatestUsData (data) {
  for (var key of Object.keys(data)) {
    var year_data = data[key].emissionsByYear.filter(v => v.year === 2018)[0]
    if (key !== "united_states") {
      return year_data
    }
  }
  return {}
}

export function getLatestEmissions (data) {
  const sortedYears = [...data[Object.keys(data)[0]].emissionsByYear].sort((a, b) => a.year - b.year)
  const latestYear = sortedYears[0].year
  let mutableDataObj = {}

  for (var key of Object.keys(data)) {
    var year_data = data[key].emissionsByYear.filter(v => v.year === latestYear)[0]
    mutableDataObj[key] = Math.round(year_data.dirty_power + year_data.buildings + year_data.transportation + year_data.dumps_farms_industrial_other)
  }
  return mutableDataObj
}