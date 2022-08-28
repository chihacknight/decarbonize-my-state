// unpack the us emissions data for 2018 and total up all 4 categories by state
export function getLatestUsData(data) {
  const sortedYears = [...data[Object.keys(data)[0]].emissionsByYear].sort(
    (a, b) => b.year - a.year
  );
  const latestYear = sortedYears[0].year;
  return data["united_states"].emissionsByYear.filter(
    v => v.year === latestYear
  );
}

export function getLatestEmissions(data) {
  const sortedYears = [...data[Object.keys(data)[0]].emissionsByYear].sort(
    (a, b) => b.year - a.year
  );
  const latestYear = sortedYears[0].year;
  let mutableDataObj = {};

  for (var key of Object.keys(data)) {
    if (key !== "united_states") {
      var year_data = data[key].emissionsByYear.filter(
        v => v.year === latestYear
      )[0];
      mutableDataObj[key] = Math.round(
        year_data.dirty_power +
          year_data.buildings +
          year_data.transportation +
          year_data.dumps_farms_industrial_other
      );
    }
  }
  return mutableDataObj;
}
