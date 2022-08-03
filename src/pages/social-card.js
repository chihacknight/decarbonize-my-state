import React from "react"
import SEO from "../components/seo"

const SocialCardPage = () => {
    let params = new URLSearchParams(document.location.search);
    let name = params.get("state"); // is the string "Jonathan"

    return(<div>
        <SEO title="Social Card" />
        <h1>Social Card for {name}</h1>
    </div>)
}

export default SocialCardPage
