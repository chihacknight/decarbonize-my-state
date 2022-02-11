// kind of a silly function to use - placeholder until we get lowercase slugs in the source data
function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function convertSlug (key) {
  if (key === undefined || key === null)
    return null
  else {
    var response = (key.split('_').map(capitalize).join('_')).replace(" of "," Of ").replace(/ /g,"_")
    return response
  }
}