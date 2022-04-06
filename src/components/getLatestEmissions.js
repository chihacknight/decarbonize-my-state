// unpack the us emissions data for 2018 and total up all 4 categories by state
export function getLatestUsData(data){
  for (var key of Object.keys(data)) {
    var year_data = data[key].emissionsByYear.filter(v => v.year === 2018)[0]
    if (key !== "united_states") {
      return year_data
    }
  }
  return {}
}

export function getLatestEmissions(data) {
  let year;
  let mutableDataObj = {};

  for (var key of Object.keys(data)) {
    if (year === undefined){
      const sortedYears = [...data[key].emissionsByYear].sort((a, b) => a.year - b.year)
      year = sortedYears[0].year
    }
    var year_data = data[key].emissionsByYear.filter(v => v.year === year)[0]
    mutableDataObj[key] = Math.round(year_data.dirty_power + year_data.buildings + year_data.transportation + year_data.dumps_farms_industrial_other)
  }
  return mutableDataObj;
}