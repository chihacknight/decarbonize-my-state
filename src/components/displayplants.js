import React from "react"
import hash from "object-hash"

const DisplayPlants = ({ plants, plantImage }) => {
  function formatNum (number) {
    return Math.round(number).toLocaleString()
  }

  return (
    <div className="row mt-4 pl-2 pr-2">
      {plants.map((plant, index) => {
        // The number of power plants we have to be over to start cutting off -
        // this is a bit away from our MaxIcons so we never say ...and 1 more
        const TruncateThreshold = 14

        // The maximum number of icons if we have a TON of power plants
        // (like 80)
        const MaxIcons = 4

        if (plants.length > TruncateThreshold) {
          if (index === MaxIcons) {
            return (
              <div
                key={hash(plant)}
                className="h4 text-center text-muted text-lg-left col-6 col-lg-5 pl-4 pt-2"
              >
                ...and {plants.length - MaxIcons} more
              </div>
            )
          } else if (index > MaxIcons) {
            return null
          }
        }

        const title =
          `Name: ${plant.plant_name}\n` +
          `County: ${plant.county}\n` +
          `Megawatt Capacity: ${formatNum(plant.capacity_mw)}\n` +
          `Utility: ${plant.utility_name}\n`

        return (
          <div className="col-lg-3 col-4 pl-0 pr-0" key={hash(plant)}>
            <img
              src={plantImage}
              className="img-fluid mx-auto d-block pl-3 pr-3"
              title={title}
              alt={title}
            />
            <p className="font-weight-bold text-center">
              {plant.plant_name} <br />
              <span className="small">
                {plant.county} County
                <br />
                {formatNum(plant.capacity_mw)} MW
              </span>
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default DisplayPlants
