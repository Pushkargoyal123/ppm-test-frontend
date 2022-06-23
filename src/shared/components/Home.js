import React, { Fragment } from "react";
import HeadSection from "./HeadSection";
import FeatureSection from "./FeatureSection";
import PricingSection from "./PricingSection";
import OurStats from "./OurStats";
// import ExcelToTable from "./ExcelToTable";

function Home(props) {

  return (
    <Fragment>
      <HeadSection />
      <FeatureSection />
      <PricingSection />
      <OurStats/>
      {/* <ExcelToTable/> */}
    </Fragment>
  );
}

export default Home;
