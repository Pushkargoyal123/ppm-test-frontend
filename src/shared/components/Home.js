import React, { Fragment } from "react";
import { useLocation } from "react-router-dom";

import HeadSection from "./HeadSection";
import HomePageModal from "./HomePageModal";
import FeatureSection from "./FeatureSection";
import PricingSection from "./PricingSection";
import OurStats from "./OurStats";
// import ExcelToTable from "./ExcelToTable";

function Home(props) {

  const location = useLocation();

  return (
    <Fragment>
      <HeadSection />
      <FeatureSection />
      {
        location.pathname === "/" ? <HomePageModal/> : <div></div>
      }
      <PricingSection />
      <OurStats/>
      {/* <ExcelToTable/> */}
    </Fragment>
  );
}

export default Home;
