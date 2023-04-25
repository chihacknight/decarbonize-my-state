import React from "react"
import hash from "object-hash"

const DisplayPlants = ({ plants, plantImage, stateSlug }) => {
  function formatNum(number) {
    return Math.round(number).toLocaleString()
  }

  return (
    <div className="display-plants mt-4">
      {plants.map((plant, index) => {
        return (
          <a
            className="display-plant col-lg-4 col-6"
            key={hash(plant)}
            href={`/${stateSlug}/power-plant/${plant.slug}`}
          >
            {/* Since we list the power plant details below, the image is just
                  decorative - removing it doesn't remove any information */}
            <img
              src={plantImage}
              className="img-fluid mx-auto d-block pl-3 pr-3"
              alt=""
            />

            <div className="plant-text font-weight-bold text-center h6">
              <div className="plant-title">{plant.plant_name}</div>

              <span className="small">
                {plant.county} County
                <br />
                {formatNum(plant.capacity_mw)} MW
              </span>
            </div>
          </a>
        )
      })}
    </div>
  )
}

export default DisplayPlants
