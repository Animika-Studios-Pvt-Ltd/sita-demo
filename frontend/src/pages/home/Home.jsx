import React, { useEffect, useState } from "react"
import { usePreloadedData } from "../../context/DataContext"

import Banner from "./Banner"
import FeaturedBooks from "./FeaturedBooks"
import AboutAuthor from "./AboutAuthor"
import ReaderThoughts from "./ReaderThoughts"
import ReadersFeedback from "./ReadersFeedback"
import InspirationBoard from "./InspirationBoard"
import Corners from "./corners"
import DynamicPage from "../Add pages/DynamicPage"

const Home = () => {
  const preloadedData = usePreloadedData()
  const [homeSections, setHomeSections] = useState([])

  useEffect(() => {
    if (preloadedData.pages) {
      const homePageSections = preloadedData.pages.filter(
        (p) => p.displayLocations?.includes("home") && !p.suspended
      );

      setHomeSections(homePageSections)
    }
  }, [preloadedData])

  return (
    <>
      <Banner />
      <FeaturedBooks />
      <ReaderThoughts />
      <ReadersFeedback />
      <InspirationBoard />
      <Corners />
      <AboutAuthor />

      {homeSections.map((page) => (
        <DynamicPage key={page._id} page={page} />
      ))}
    </>
  )
}

export default Home
