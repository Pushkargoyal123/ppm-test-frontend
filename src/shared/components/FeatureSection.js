import React from "react";
import PropTypes from "prop-types";
import { Grid, Typography, isWidthUp, withWidth } from "@material-ui/core";
import calculateSpacing from "./calculateSpacing";
import FeatureCard from "./FeatureCard";

const features = [
  {
    color: "#00C853",
    headline: "Unescorted Money Trading",
    text:
      "Praedico’s Stock Trading Simulator let you allow to take dummy trades in the real time market scenario with Virtual Money and without investing a single penny.",
    icon: <i style={{fontSize:30}} class="far fa-money-bill-alt"></i>,
    mdDelay: "0",
    smDelay: "0"
  },
  {
    color: "#6200EA",
    headline: "Neural Network Predictions",
    text:
      "PSTS provides suggestive signals on each stock based on the neural network working behind the platform with an accuracy of or more than 80% approximately.",
    icon: <i style={{fontSize:30}} class="fas fa-chart-bar"></i>,
    mdDelay: "200",
    smDelay: "200"
  },
  {
    color: "#0091EA",
    headline: "Sentimental Predictive Signals",
    text:
      "PSTS provides predictions for each stock on the on the basis of News Trend going in the Live Market with an accuracy of or more than 90% approximately.",
    icon: <i style={{fontSize:30}} class="far fa-clock"></i>,
    mdDelay: "400",
    smDelay: "0"
  },
  {
    color: "#d50000",
    headline: "Cost Convenient",
    text:
      "Praedico comes up with the inexpensive price for its products. Exciting cash prices and offers are administered ever often.",
    icon: <i  style={{fontSize:30}} class="fas fa-thumbs-up"></i>,
    mdDelay: "0",
    smDelay: "200"
  },
];

function FeatureSection(props) {
  const { width } = props;
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div className="container-fluid">
        <Typography variant="h3" align="center" style={{marginBottom:20}}>
          Features
        </Typography>
        <div className="container-fluid">
          <Grid container spacing={calculateSpacing(width)}>
            {features.map(element => (
              <Grid
                item
                xs={6}
                md={3}
                data-aos="zoom-in-up"
                data-aos-delay={
                  isWidthUp("md", width) ? element.mdDelay : element.smDelay
                }
                key={element.headline}
              >
                <FeatureCard
                  Icon={element.icon}
                  color={element.color}
                  headline={element.headline}
                  text={element.text}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  );
}

FeatureSection.propTypes = {
  width: PropTypes.string.isRequired
};

export default withWidth()(FeatureSection);
