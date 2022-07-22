import React, { useEffect, useState } from "react";
import { Grid, Typography, isWidthUp, withWidth } from "@material-ui/core";

import { getData } from "../../service/service";
import calculateSpacing from "./calculateSpacing";

function OurStats(props) {
  const { width } = props;

  const [userCount, setUserCount] = useState(1000);
  const [transactionCount, setTransactionCount] = useState(50000);
  const [groupCount, setGroupCount] = useState(500);

  useEffect(function () {
    const getUsersCount = async () => {
      const data = await getData("user/countUser");
      if (data.success) {
        setUserCount(data.data);
      }
    }

    const getTransactionCount = async () => {
      const data = await getData("stock/countTotalTransactions");
      if (data.success) {
        setTransactionCount(data.data);
      }
    }

    const getGroupsCount = async () => {
      const data = await getData("group/countTotalGroups");
      if (data.success) {
        setGroupCount(data.data);
      }
    }

    getUsersCount();
    getTransactionCount();
    getGroupsCount();
  }, [])

  return (
    <div style={{ backgroundColor: "#FFFFFF", marginTop: "80px" }}>
      <div className="container-fluid">
        <Typography variant="h3" align="center" style={{ marginBottom: 20 }}>
          Our Stats
        </Typography>
        <div className="container-fluid">
          <Grid container spacing={calculateSpacing(width)}>

            <Grid
              item
              xs={6}
              md={3}
              data-aos="zoom-in-up"
              data-aos-delay={
                isWidthUp("md", width) ? "0" : "0"
              }
            >
              <div style={{ height: 150, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "red" }}>
                <i style={{ fontSize: 60, color: "white" }} className="fas fa-user"></i>
              </div>
              <div style={{ textAlign: "center", fontSize: 30 }}>{userCount}+</div>
              <div style={{ textAlign: "center", color: "grey", fontSize: 25 }}>Users</div>
            </Grid>

            <Grid
              item
              xs={6}
              md={3}
              data-aos="zoom-in-up"
              data-aos-delay={
                isWidthUp("md", width) ? "0" : "200"
              }
            >
              <div style={{ height: 150, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "red" }}>
                <i style={{ fontSize: 60, color: "white" }} className="fas fa-map-marker-alt"></i>
              </div>
              <div style={{ textAlign: "center", fontSize: 30 }}>60+</div>
              <div style={{ textAlign: "center", color: "grey", fontSize: 25 }}>Cities</div>
            </Grid>

            <Grid
              item
              xs={6}
              md={3}
              data-aos="zoom-in-up"
              data-aos-delay={
                isWidthUp("md", width) ? "400" : "0"
              }
            >
              <div style={{ height: 150, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "red" }}>
                <i style={{ fontSize: 60, color: "white" }} className="fas fa-toolbox"></i>
              </div>
              <div style={{ textAlign: "center", fontSize: 30 }}>{transactionCount}+</div>
              <div style={{ textAlign: "center", color: "grey", fontSize: 25 }}>Transactions</div>
            </Grid>

            <Grid
              item
              xs={6}
              md={3}
              data-aos="zoom-in-up"
              data-aos-delay={
                isWidthUp("md", width) ? "400" : "0"
              }
            >
              <div style={{ height: 150, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "red" }}>
                <i style={{ fontSize: 60, color: "white" }} className="fas fa-users"></i>
              </div>
              <div style={{ textAlign: "center", fontSize: 30 }}>{groupCount}+</div>
              <div style={{ textAlign: "center", color: "grey", fontSize: 25 }}>Groups</div>
            </Grid>

          </Grid>
        </div>
      </div>
    </div>
  );
}

export default withWidth()(OurStats);