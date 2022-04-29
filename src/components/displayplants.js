import React from "react"

const DisplayPlants = ({ plants, plantImage }) => {
  return (
    <div className="row">
      { plants.map((plant, index) => {
        if ((index === 10) && plants.length > 15) { return <span className="h4"> ...and {plants.length - 10} more</span> }
        if ((index > 9) && plants.length > 15) { return null }

        const title = "Name: " + plant.plant_name + "\n" +
                      "County: " + plant.county + "\n" +
                      "Megawatt Capacity: " + plant.capacity_mw + "\n" +
                      "Utility: " + plant.utility_name + "\n"
        return (
          <div className="col-lg-3 col-6">
            <img 
              src={plantImage}
              className="img-fluid mx-auto d-block"
              title={title}
              alt={title}
            />
            <p class='text-center'>{plant.plant_name}</p>
          </div>
        )
      })}
    </div>
  )
}

export default DisplayPlants