import classNames from "classnames";
import { Box, Button, makeStyles, useMediaQuery, Dialog } from "@material-ui/core";
import MaterialTable from 'material-table';
import React, { useEffect, useState } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTheme } from '@material-ui/core/styles';

import { getData } from "../../../service/service";
import ToolTip from "../../../shared/components/ToolTip";
import CalledModal from "../../../service/CalledModal";

const useStyles = makeStyles((theme) => ({
  blogContentWrapper: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
    },
    minHeight: 500,
    maxWidth: 1280,
    width: "100%",
    boxShadow: " rgba(0, 0, 0, 0.56) 0px 22px 70px 4px"

  },
  wrapper: {
    minHeight: "60vh",
  },
  message: {
    color: "red",
    fontWeight: "600"
  }
}))

export default function Stock() {

  const classes = useStyles();
  useEffect(function () {
    fetchAllStocks();
  }, []);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [stockEvaluation, setStockEvaluation] = useState([]);
  const [message, setMessage] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [body, setBody] = React.useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchAllStocks = async () => {
    const result = await getData("stock/getallstockdetails");
    if (result.length) {
      setMessage(1)
      setStockEvaluation(result);
    } else {
      setMessage(2);
    }
  }

  return (
    <Box
      className={classNames("lg-p-top", classes.wrapper)}
      display="flex"
      justifyContent="center"
    >
      <div className={classes.blogContentWrapper + " animation-bottom-top"}>

        {
          !message ? <div className="ParentFlex">
            <CircularProgress color="secondary" className="preloader" />
          </div>
            :
            <MaterialTable
              style={{ minWidth: "80%", textAlign: "center", fontWeight: 500 }}
              title="Stock Details"
              columns={[
                {
                  title: 'Company Code',
                  field: 'CompanyCode',
                  cellStyle: { textAlign: "center", color: "blue", fontWeight: "600" }
                },
                {
                  title: 'Company Name',
                  field: 'CompanyName',
                  cellStyle: { textAlign: "center" },
                  render: rowData => parseInt(rowData.Variance.substring(1)) > 0 ? <span style={{ color: "green" }}>{rowData.CompanyName}</span> : <span style={{ color: "red" }}>{rowData.CompanyName}</span>
                },
                {
                  title: 'Current Price',
                  field: 'CurrentPrice',
                  cellStyle: { textAlign: "center" },
                  customFilterAndSearch: (term, rowData) => term >= parseInt(rowData.CurrentPrice.substring(1))
                },
                {
                  title: 'High Price',
                  field: 'HighPrice',
                  cellStyle: { textAlign: "center" },
                  customFilterAndSearch: (term, rowData) => term >= parseInt(rowData.CurrentPrice.substring(1))
                },
                {
                  title: 'Low Price',
                  field: 'LowPrice',
                  cellStyle: { textAlign: "center" },
                  customFilterAndSearch: (term, rowData) => term >= parseInt(rowData.CurrentPrice.substring(1))
                },
                {
                  title: 'Variance',
                  field: 'Variance',
                  cellStyle: { textAlign: "center" }
                },
                {
                  title: 'Signal',
                  field: 'Signal',
                  cellStyle: { textAlign: "center" },
                  render: rowData => <span key={rowData.CompanyCode}>
                    <ToolTip
                      title="Click here to show Signal"
                      component={() => <Button style={{ backgroundColor: "#82ccdd" }} onClick={() => { setOpen(true); setBody(1) }} fullWidth>Show Signal</Button>} />
                  </span>
                },
              ]
              }
              data={
                stockEvaluation.map(function (item) {
                  return { CompanyCode: item.companyCode, CompanyName: item.companyName, CurrentPrice: "₹" + item.currentPrice, HighPrice: "₹" + item.highPrice, LowPrice: "₹" + item.lowPrice, Variance: "₹" + item.variance }
                })
              }

              localization={{
                body: message === 1 ?
                  stockEvaluation.length ? null : {
                    emptyDataSourceMessage: (
                      "You haven't Buy or Sell Any Stock"
                    ),
                  } :
                  {
                    emptyDataSourceMessage: (
                      <span className={classes.message}>!!OOPS Server Error</span>
                    ),
                  },
              }}

              options={{
                pageSize: 50,
                maxBodyHeight: '80vh',
                emptyRowsWhenPaging: false,
                pageSizeOptions: [50, 100, 150, 200],
                filtering: true,
                headerStyle: {
                  fontWeight: "500",
                  backgroundColor: "#D1D1D8",
                  textAlign: "center"
                },
                searchFieldStyle: {
                  backgroundColor: "#D1D1D8",
                },
                // rowStyle: (rowData, index) => {
                //      if(index%2 === 0 ) {
                //        return {backgroundColor: '#c7ecee'};
                //      }
                //    return {backgroundColor: '#ecf0f1'};
                //  }
              }}
            />

        }
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {CalledModal(open, setGeneratedOTP, setEmail, generatedOTP, setOpen, body, setBody, loginEmail, setLoginEmail, email, password, setPassword, setLoginPassword, loginPassword)}
        </Dialog>
      </div>
    </Box>)
}