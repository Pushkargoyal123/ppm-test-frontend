import classNames from "classnames";
import { Box, makeStyles } from "@material-ui/core";
import MaterialTable from 'material-table';
import { useEffect, useState } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { getData } from "../../../service/service";

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

  const [stockEvaluation, setStockEvaluation] = useState([]);
  const [message, setMessage] = useState(false);

  const fetchAllStocks = async () => {
    const result = await getData("stock/getallstockdetails");
    if (result.length) {
      setMessage(1)
      setStockEvaluation(result);
    }
    console.log(result);
    setMessage(2);
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
                  lookup: { "buy": 'BUY', "sell": 'SELL', "strong buy": "STRONG BUY", "strong sell": "STRONG SELL" },
                  render: rowData => { if (rowData.Signal === "buy") return <span style={{ color: "green", fontWeight: 700 }}>BUY</span>; else if (rowData.Signal === "sell") return <span style={{ color: "red", fontWeight: 700 }}>SELL</span>; else if (rowData.Signal === "strong buy") return <span style={{ color: "green", fontWeight: 700 }}>STRONG BUY</span>; else if (rowData.Signal === "strong sell") return <span style={{ color: "red", fontWeight: 700 }}>STRONG SELL</span> }
                },
              ]
              }
              data={
                stockEvaluation.map(function (item) {
                  return { CompanyCode: item.companyCode, CompanyName: item.companyName, CurrentPrice: "₹" + item.currentPrice, HighPrice: "₹" + item.highPrice, LowPrice: "₹" + item.lowPrice, Variance: "₹" + item.variance, Signal: item.stockSignal }
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
      </div>
    </Box>)
}