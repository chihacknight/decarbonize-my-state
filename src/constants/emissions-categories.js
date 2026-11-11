import HomeIcon from "../images/icons/home.svg"
import AutomobileIcon from "../images/icons/automobile.svg"
import PlugIcon from "../images/icons/plug.svg"
import IndustryIcon from "../images/icons/industry.svg"

/**
 * The emissions categories, in the order they appear on state pages, shared by
 * the vertical SingleBarChart and the horizontal SectionProgressBar.
 *
 * - key:       The category's field in the emissions data
 * - sectionId: The ID of its section on state pages
 * - emoji:     An icon, shown before the name
 * - icon:      Optional single-color SVG icon (Font Awesome 4), which the
 *              mobile section progress bar and state page bar chart can show
 *              instead of the emoji
 * - name:      A short name, like "Power"
 * - longName:  A full name, used where there's room, like "Dirty Power"
 * - fill:      The bar's default fill
 * - greenFill: The bar's fill once the category is electrified
 */
export const EmissionsCategories = {
  buildings: {
    key: "buildings",
    sectionId: "buildings",
    emoji: "🏠",
    icon: HomeIcon,
    name: "Buildings",
    longName: "Buildings",
    fill: "#dcdcdc",
    greenFill: "#a3d7a4",
  },
  transport: {
    key: "transportation",
    sectionId: "transport",
    emoji: "🚗",
    icon: AutomobileIcon,
    name: "Transport",
    longName: "Transportation",
    fill: "#c2c2c2",
    greenFill: "#6ebf70",
  },
  power: {
    key: "dirty_power",
    sectionId: "power",
    emoji: "🔌",
    icon: PlugIcon,
    name: "Power",
    longName: "Dirty Power",
    fill: "#a6a6a6",
    greenFill: "#4caf50",
  },
  other: {
    key: "dumps_farms_industrial_other",
    sectionId: "other",
    emoji: "🏭",
    icon: IndustryIcon,
    name: "Other",
    longName: "Farms, Industry & Other",
    fill: "#ad8669",
    // This category cannot be electrified so make the greenFill red to be
    // clearly bad
    greenFill: "#ff0000",
  },
}

/** The fill for the category whose section you're on */
export const ActiveCategoryFill = "#ff5722"
