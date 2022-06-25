import React, { useEffect, useState } from "react";
import { Grid, Typography, isWidthUp, withWidth } from "@material-ui/core";

import { getData } from "../../service/service";
import calculateSpacing from "./calculateSpacing";

const features = [
  {
    headline: "Users",
    quantity: 22000,
    icon: "fas fa-user",
    mdDelay: "0",
    smDelay: "0"
  },
  {
    headline: "Cities",
    quantity: 60,
    icon: "fas fa-map-marker-alt",
    mdDelay: "200",
    smDelay: "200"
  },
  {
    headline: "Transactions",
    quantity: 500000,
    icon: "fas fa-toolbox",
    mdDelay: "400",
    smDelay: "0"
  },
  {
    headline: "Groups",
    quantity: 513,
    icon: "fas fa-users",
    mdDelay: "0",
    smDelay: "200"
  },
];

function OurStats(props) {
  const { width } = props;

  const [statics, setStatics] = useState(features);

  useEffect(function () {
    const getUsersCount = async () => {
      const data = await getData("user/countUser");
      if (data.success) {
        let temp = statics
        temp[0].quantity += data.data;
        setStatics(temp)
      }
    }

    const getTransactionCount = async () => {
      const data = await getData("stock/countTotalTransactions");
      if (data.success) {
        let temp = statics;
        temp[2].quantity += data.data;
        setStatics(temp)
      }
    }

    getUsersCount();
    getTransactionCount();
  }, [statics])

  return (
    <div style={{ backgroundColor: "#FFFFFF", marginTop: "80px" }}>
      <div className="container-fluid">
        <Typography variant="h3" align="center" style={{ marginBottom: 20 }}>
          Our Stats
        </Typography>
        <div className="container-fluid">
          <Grid container spacing={calculateSpacing(width)}>
            {statics.map(element => (
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
                <div style={{ height: 150, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "red" }}>
                  <i style={{ fontSize: 60, color: "white" }} className={element.icon}></i>
                </div>
                <div style={{ textAlign: "center", fontSize: 30 }}>{element.quantity}+</div>
                <div style={{ textAlign: "center", color: "grey", fontSize: 25 }}>{element.headline}</div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default withWidth()(OurStats);