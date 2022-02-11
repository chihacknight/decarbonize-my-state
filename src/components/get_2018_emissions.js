// unpack the us emissions data for 2018 and total up all 4 categories by state
export default function get_2018_emissions (data) {
  var emissions_2018 = {}
  for (var key of Object.keys(data.finalJson)) {
    var year_data = data.finalJson[key].filter(v => v.year == 2018)[0]
    if (key != "united_states")
      emissions_2018[key] = Math.round(year_data.dirty_power + year_data.buildings + year_data.transportation + year_data.dumps_farms_industrial)
  }
  return emissions_2018
}