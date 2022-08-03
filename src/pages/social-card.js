import React from "react"
import SEO from "../components/seo"

//TODO: move to shared file with state details
const slugToTitle = (placeName) => {
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

const SocialCardPage = () => {
    let params = new URLSearchParams(document.location.search);
    let currentState = params.get("state")

    // place info and string
    // clean up title as needed
    const placeTitle = slugToTitle(currentState)
    const stateFaceClass = currentState.toLowerCase().replaceAll(" ", "-")

    return(<div>
        <SEO title="Social Card" />

        <h1 id="main" className="d-flex align-items-center mr-4 mt-0 mb-0">
          <span
            className={"display-3 mr-4 sf-" + stateFaceClass}
            aria-hidden="true"
          ></span>
          <span className="title font-weight-bold h4 mb-0">{placeTitle}</span>
        </h1>
    </div>)
}

export default SocialCardPage
