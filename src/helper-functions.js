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

/**
 * Converts a very large number to a more readable string.
 *
 * 2_114_602 -> '2.1 million'
 * 76_125 -> '76 thousand'
 */
export function numberToHumanString(num) {
  // Return clear error string if the number is null or undefined
  if (num === undefined || num === null) {
    return "?"
  }

  // If in the thousands, return '{rounded_num} thousands', e.g.76_126 ->
  // 76 thousand
  if (num > 1_000 && num < 1_000_000) {
    return `${Math.round(num / 1_000)},000`
  }
  // If in the millions return '${rounded_num_one_decimal} millions', e.g.
  // 2_114_602 -> 2.1 million
  else if (num > 1_000_000 && num < 1_000_000_000) {
    return `${(num / 1_000_000).toFixed(1)} million`
  }

  // If in the hundreds or something else, return rounded to an integer
  // (e.g 534.451312 -> 534)
  return Math.round(num)
}

const compactFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

/**
 * A short number for chart axes, e.g. 164_900 -> '164.9K', 10_304_900 ->
 * '10.3M'
 */
export function formatCompactNumber(num) {
  return compactFormat.format(num)
}

/** A rounded number with commas, e.g. 1234567.8 -> '1,234,568' */
export function formatNumber(num) {
  return Math.round(num).toLocaleString("en-US")
}
