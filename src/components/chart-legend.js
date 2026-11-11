import React from "react"

/**
 * A chart legend as HTML below the chart, rather than Recharts' legend, so it
 * lays out in even rows on a light grey background with dark, readable text.
 *
 * `marginLeft` and `marginRight` should match the chart's y-axis widths and
 * right margin, so the legend lines up with the plot area rather than starting
 * under the axis labels.
 *
 * @param items An array, in display order, of
 *
 * {
 *   key: string;
 *   name: string;
 *   color: string;
 *   // "area" (default) is a square, "line" and "dashed" are short lines
 *   type?: "area" | "line" | "dashed";
 *   // Fades the swatch, e.g. to match faded fossil fuels in the power mix
 *   faded?: boolean;
 * }
 */
const ChartLegend = ({ items, marginLeft = 0, marginRight = 0 }) => (
  <ul
    className="chart-legend"
    style={{
      // As variables so charts.css can drop them on mobile
      "--legend-margin-left": `${marginLeft}px`,
      "--legend-margin-right": `${marginRight}px`,
      // Up to 4 columns, fewer when there are fewer items, see charts.css
      "--legend-columns": Math.min(items.length, 4),
    }}
  >
    {items.map(({ key, name, color, type = "area", faded = false }) => (
      <li key={key}>
        <span
          className={`chart-legend-swatch -${type}`}
          style={{
            // Dashed lines draw their color as a border, see charts.css
            [type === "dashed" ? "borderColor" : "background"]: color,
            opacity: faded ? 0.35 : 1,
          }}
        />
        {name}
      </li>
    ))}
  </ul>
)

export default ChartLegend
