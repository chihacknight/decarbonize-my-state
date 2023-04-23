/**
 * Converts a slug to the capitalized title, e.g. 'new_mexico' -> New Mexico
 */
export function slugToTitle(placeName) {
  const words = placeName.split("_")

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    if (word === "of") {
      words[i] = word
    } else {
      words[i] = word.charAt(0).toUpperCase() + word.slice(1)
    }
  }

  return words.join(" ")
}
