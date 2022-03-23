// unpack the us emissions data for 2018 and total up all 4 categories by state
export default function get_2018_emissions_group (data) {
  for (var key of Object.keys(data.finalJson)) {
    var year_data = data.finalJson[key].filter(v => v.year === 2018)[0]
    if (key === "united_states") {
      return year_data
    }
  }
  return {}
}