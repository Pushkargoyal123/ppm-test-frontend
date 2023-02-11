import classNames from "classnames";
import MaterialTable, { MTableBody } from 'material-table';
import { TableCell, TableFooter, TableRow } from "@material-ui/core";
import { useEffect, useState } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    Box,
    Button,
    makeStyles
} from "@material-ui/core";
import KeyboardBackspaceRoundedIcon from '@material-ui/icons/KeyboardBackspaceRounded';
import InfoIcon from '@material-ui/icons/Info';
import { useSelector } from "react-redux";

import Portfolio from "./Portfolio";
import { getData, postData } from "../../../service/service";
import ToolTip from "../../../shared/components/ToolTip";
import StockData from "./StockData";
import DreamNiftyHeading from "../DreamNiftyHeading";

const useStyles = makeStyles((theme) => ({
    blogContentWrapper: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(4),
            marginRight: theme.spacing(4),
        },
        maxWidth: 1280,
        width: "100%",
        textAlign: "justify-all",
        boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px"
    },
    wrapper: {
        minHeight: "60vh",
    },
    flex: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    message: {
        color: "red",
        fontWeight: "600"
    }
}))

export default function CompanyDetail(props) {
    const classes = useStyles();

    const [message, setMessage] = useState(false)
    const [data, setData] = useState([]);
    const [totalBuyStock, setTotalBuyStock] = useState("");
    const [totalSellStock, setTotalSellStock] = useState("");
    const [totalBuyPrice, setTotalBuyPrice] = useState(0);
    const [totalSellPrice, setTotalSellPrice] = useState(0);

    let group = useSelector(state => state.group)
    let groupId = Object.values(group)[0];
    useSelector((state) => state);

    const eventInfo = JSON.parse(sessionStorage.getItem('clickedEvent'));

    useEffect(() => {
        setMessage(false);
        const fetchcompanyStockBuySell = async () => {
            let result;
            if (eventInfo) {
                const body = { companyCode: props.data.companyCode, ppmDreamNiftyId: eventInfo.id };
                result = await postData("dreamNifty/portfolio/companyDetailList", body);
            } else {
                result = await getData("stock/portfolio/detail?companyCode=" + props.data.companyCode + "&ppmGroupId=" + groupId.group);
            }
            let buyStockSum = 0, sellStockSum = 0, buyStockPriceSum = 0, sellStockPriceSum = 0;
            if (result.success) {
                setMessage(1)
                result.data.forEach((item) => {
                    if (item.stocks > 0) {
                        buyStockSum += item.stocks;
                        buyStockPriceSum += item.totalStockPrice;
                    }
                    else {
                        sellStockSum += item.stocks;
                        sellStockPriceSum += item.totalStockPrice;
                    }
                });
                setTotalBuyStock(buyStockSum);
                setTotalSellStock(sellStockSum);
                setTotalBuyPrice(buyStockPriceSum);
                setTotalSellPrice(sellStockPriceSum);

                setData(result.data);
            }
            else {
                setMessage(2)
            }
        }
        fetchcompanyStockBuySell();
        // eslint-disable-next-line
    }, [props.data.companyCode, groupId.group])

    const handleBuySellStocks = () => {
        props.setComponent(<StockData
            data={{ CompanyCode: props.data.companyCode, CompanyName: props.data.companyName }}
            setComponent={props.setComponent}
            setUnderlinedButton={props.setUnderlinedButton}
        />);
        props.setUnderlinedButton("Stocks");
    }

    return (
        <Box
            className={classNames("lg-p-top", classes.wrapper)}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
        >
            <DreamNiftyHeading />
            <div className={classes.blogContentWrapper + " animation-bottom-top"}>
                <div style={{ fontSize: 40, textAlign: "center" }}><u>{props.data.companyName}</u></div>
                <div>
                    {
                        !message ? <div className="ParentFlex">
                            <CircularProgress color="secondary" className="preloader" />
                        </div>
                            :

                            <MaterialTable
                                style={{ minWidth: "70%", textAlign: "center", fontWeight: 500 }}
                                title=<div> <ToolTip title="Back" component={() => <KeyboardBackspaceRoundedIcon
                                    color="secondary"
                                    style={{ border: "1px blue solid", fontSize: "2rem", cursor: "pointer" }}
                                    onClick={() => props.setComponent(<Portfolio setComponent={props.setComponent} setUnderlinedButton={props.setUnderlinedButton} />)}
                                />} />
                                    <div style={{ color: "green", fontSize: "1.1rem" }}>
                                        Current Price <span style={{ fontWeight: "bold" }}> ₹ {props.data.currentPrice} </span>
                                    </div>
                                </div>

                                columns={[
                                    {
                                        title: 'S.No.',
                                        field: 'tableData.id',
                                        cellStyle: { textAlign: "center", backgroundColor: "#f1c40f", fontWeight: "600", width: "4%" },
                                        render: rowData => rowData.tableData.id + 1
                                    },
                                    {
                                        title: 'Price Per Stock',
                                        field: 'pricePerStock',
                                        cellStyle: { fontWeight: "600" },
                                        render: rowData => "₹" + Math.abs(rowData.pricePerStock)
                                    },
                                    {
                                        title: 'Stocks',
                                        field: 'stocks',
                                        render: rowData => Math.abs(rowData.stocks)
                                    },
                                    {
                                        title: 'Total Stock Price',
                                        field: 'totalStockPrice',
                                        render: rowData => "₹" + Math.abs(rowData.totalStockPrice)
                                    },
                                    {
                                        title: 'Status',
                                        render: rowData => rowData.totalStockPrice > 0 ?
                                            <Button style={{ color: "green", fontWeight: "bold" }}>Buy</Button> :
                                            <Button style={{ color: "red", fontWeight: "bold" }}>Sell</Button>
                                    },
                                    {
                                        title: 'Date',
                                        field: 'dateTime',
                                        render: rowData => rowData.dateTime.split(" ")[0]
                                    },
                                    {
                                        title: 'Time',
                                        field: 'dateTime',
                                        render: rowData => rowData.dateTime.split(" ")[1]
                                    },
                                    {
                                        title: "info",
                                        render: rowData => <ToolTip title={rowData.comment} component={() => <InfoIcon style={{ color: rowData.totalStockPrice > 0 ? "green" : "red" }} />} />
                                    }
                                ]
                                }
                                data={data}

                                localization={{
                                    body: message === 1 ?
                                        data.length ? null : {
                                            emptyDataSourceMessage: (
                                                "No record found"
                                            ),
                                        } :
                                        {
                                            emptyDataSourceMessage: (
                                                <span className={classes.message}>!!OOPS Server Error</span>
                                            ),
                                        },
                                }}

                                components={{
                                    Body: (prop) => <>
                                        <MTableBody {...prop} />
                                        <TableFooter>
                                            <TableRow style={{ backgroundColor: "#74b9ff" }}>
                                                <TableCell className="tablecell" colSpan={3}> Total Stock Buy : {totalBuyStock} </TableCell>
                                                <TableCell colSpan={2} className="tablecell">Total Buying Price : {totalBuyPrice.toFixed(2)}</TableCell>
                                                <TableCell colSpan={3} className="tablecell">
                                                    <ToolTip
                                                        title={"Buy some stock of " + props.data.companyName}
                                                        component={() => <Button onClick={() => handleBuySellStocks()} style={{ backgroundColor: "green", color: "white" }}>BUY</Button>}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow style={{ backgroundColor: "#81ecec" }}>
                                                <TableCell colSpan={3} className="tablecell"> Total Stock Sell : {Math.abs(totalSellStock)} </TableCell>
                                                <TableCell colSpan={2} className="tablecell">Total Selling Price :  {Math.abs(totalSellPrice).toFixed(2)}</TableCell>
                                                <TableCell className="tablecell" colSpan={3}>
                                                    <ToolTip
                                                        title={"Sell some stock of " + props.data.companyName}
                                                        component={() => <Button onClick={() => handleBuySellStocks()} style={{ backgroundColor: "red", color: "white" }}>SELL</Button>}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow style={{ backgroundColor: "#2f3542" }}>
                                                <TableCell colSpan={3} className="tablecell white"> Total Stock Left : {totalBuyStock + totalSellStock} </TableCell>
                                                <TableCell colSpan={2} className="tablecell white">Total Amount Invested : {(totalBuyPrice + totalSellPrice).toFixed(2)} </TableCell>
                                                <TableCell className="tablecell" colSpan={3}> </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </>
                                }}

                                options={{
                                    pageSize: 50,
                                    maxBodyHeight: '80vh',
                                    emptyRowsWhenPaging: false,
                                    pageSizeOptions: [50, 100, 150, 200],
                                    headerStyle: {
                                        fontWeight: "500",
                                        backgroundColor: "#D1D1D8",
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
            </div>
        </Box>)
}
