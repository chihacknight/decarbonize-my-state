export default function convertSlug(key) {
  if (key === undefined || key === null)
    return null
  else {
    return key.replace(" of "," Of ").replace(/ /g,"_")
  }
}