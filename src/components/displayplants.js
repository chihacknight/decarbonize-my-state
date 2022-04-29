import React from "react"

const DisplayPlants = ({ plants, plantImage }) => {
  return (
    plants.map((plant, index) => {
      if ((index === 20) && plants.length > 25) { return <span className="h4"> ...and {plants.length - 20} more!</span> }
      if ((index > 19) && plants.length > 25) { return null }
      return <img src={plantImage}
        title={"Name: " + plant.plant_name + "\n" +
          "County: " + plant.county + "\n" +
          "Megawatt Capacity: " + plant.capacity_mw + "\n" +
          "Utility: " + plant.utility_name + "\n"}
        alt="a power plant which needs to be replaced"
      >
      </img>
    })
  )
}

export default DisplayPlants