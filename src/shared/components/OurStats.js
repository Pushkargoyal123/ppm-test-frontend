import React from "react";
import { Grid, Typography, isWidthUp, withWidth } from "@material-ui/core";
import calculateSpacing from "./calculateSpacing";

const features = [
  {
    headline: "Users",
    quantity:"22310+",
    icon: "fas fa-user",
    mdDelay: "0",
    smDelay: "0"
  },
  {
    headline: "Cities",
    quantity:"60+",
    icon: "fas fa-map-marker-alt",
    mdDelay: "200",
    smDelay: "200"
  },
  {
    headline: "Transactions",
    quantity:"500,755+",
    icon: "fas fa-toolbox",
    mdDelay: "400",
    smDelay: "0"
  },
  {
    headline: "Groups",
    quantity:"513+",
    icon: "fas fa-users",
    mdDelay: "0",
    smDelay: "200"
  },
];

function OurStats(props) {
  const { width } = props;
  return (
    <div style={{ backgroundColor: "#FFFFFF", marginTop:"80px" }}>
      <div className="container-fluid">
        <Typography variant="h3" align="center" style={{marginBottom:20}}>
          Our Stats
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
                <div style={{height:150, display:"flex", justifyContent:"center", alignItems:"center", backgroundColor:"red"}}><i style={{fontSize:60, color:"white"}} className={ element.icon}></i></div>
                <div style={{textAlign:"center", fontSize:30}}>{element.quantity}</div>
                <div style={{textAlign:"center", color:"grey", fontSize:25}}>{element.headline}</div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default withWidth()(OurStats);
