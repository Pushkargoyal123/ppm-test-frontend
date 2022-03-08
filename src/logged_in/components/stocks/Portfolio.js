import classNames from "classnames";
import { Divider, Box, makeStyles, Button } from "@material-ui/core";
import { useEffect } from "react";
import MaterialTable, { MTableBody } from 'material-table';
import { useState } from "react";
import { TableCell, TableFooter, TableRow } from "@material-ui/core";
import TransactionHistory from "./TransactionHistory"
import { getData } from "../../../service/service";
import { useSelector } from "react-redux";
import CircularProgress from '@material-ui/core/CircularProgress';
import CompanyDetail from "./CompanyDetail";
import ToolTip from "../../../shared/components/ToolTip";


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
        boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px"
    },
    wrapper: {
        minHeight: "60vh",
    },
    message: {
        color: "red",
        fontWeight: "600"
    }
}))

export default function Portfolio(props) {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [totalBuyPrice, setTotalBuyPrice] = useState(0);
    const [totalStock, setTotalStock] = useState("");
    const [totalCurrentPrice, setTotalCurrentPrice] = useState(0);
    const [count, setCount] = useState(0);
    const [virtualAmount, setVirtualAmount] = useState(0);
    const [totalPL, setTotalPL] = useState(0);
    const [message, setMessage] = useState(false);

    const user = useSelector(state => state.user)
    const userData = Object.values(user)[0];
    const userId = userData.id

    useEffect(function () {

        const fetchPortfolioHistory = async () => {
            const resultgroup = await getData("stock/fetchallstockbuysell?UserId=" + userId);

            const resultportfolio = await getData("stock/fetchportfoliohistory?UserId=" + userId);

            let count = 0;

            if (resultgroup.success && resultportfolio.success) {
                setMessage(1);
                const tableData = resultgroup.data.map(function (groupItem, index) {

                    const filteredHistory = resultportfolio.data.filter(function (portfolioItem, index) {
                        if (groupItem.companyName === portfolioItem.companyName) {
                            return portfolioItem
                        }
                        return null
                    })

                    filteredHistory[0]["length"] = filteredHistory.filter(function (item) {
                        return item.buyStock > 0
                    }).length;

                    let stocks = filteredHistory[0].buyStock !== 0 ? filteredHistory[0].buyStock : filteredHistory[0].sellStock
                    filteredHistory[0]["current"] = filteredHistory[0].currentPrice / stocks

                    const listOfCompanies = filteredHistory.reduce(function (total, item) {
                        const existing = total.find(x => x.companyName === item.companyName);
                        if (existing) {
                            existing.buyStock += item.buyStock;
                            existing.sellStock += item.sellStock;
                            existing.totalBuyPrice += item.totalBuyPrice;
                            existing.totalSellPrice += item.totalSellPrice;
                        } else {
                            total.push(item);
                        }
                        count++;
                        return total;
                    }, [])

                    return listOfCompanies
                })

                let finalData = tableData.map(r => {
                    const { ...record } = r;
                    return record["0"];
                });

                let status = null;
                let PL = 0, totalPL = 0;

                finalData.forEach(function (item) {
                    if (item.current > (item.totalBuyPrice / item.buyStock)) {
                        status = 'Profit';
                    }
                    else if ((item.current === (item.totalBuyPrice / item.buyStock)) || ((item.buyStock - item.sellStock) === 0)) {
                        status = 'Neutral';
                    }
                    else {
                        status = 'Loss';
                    }

                    if ((item.buyStock - item.sellStock) === 0) {
                        if (item.totalBuyPrice > item.totalSellPrice) {
                            PL = item.totalSellPrice - item.totalBuyPrice;
                            status = 'Loss';
                        }
                        else {
                            PL = item.totalSellPrice - item.totalBuyPrice;
                            status = 'Profit';
                        }
                    }
                    else {
                        PL = Math.round((item.currentPrice * (item.buyStock - item.sellStock)) - (item.totalBuyPrice - item.totalSellPrice))

                        if (PL === 0) {
                            status = 'Neutral';
                        }
                        else if (PL > 0) {
                            status = 'Profit';
                        }
                        else {
                            status = 'Loss';
                        }
                    }
                    item["PL"] = PL;
                    item["status"] = status;
                    totalPL += parseInt(PL);
                })

                setTotalPL(totalPL);

                setTotalBuyPrice(finalData.reduce(function (total, item) {
                    return total + (item.totalBuyPrice - item.totalSellPrice);
                }, 0));

                setTotalStock(finalData.reduce(function (total, item) {
                    return total + (item.buyStock - item.sellStock);
                }, 0))

                setTotalCurrentPrice(finalData.reduce(function (total, item) {
                    return total + (item.currentPrice * (item.buyStock - item.sellStock));
                }, 0))
                setCount(count);
                setData(finalData);
            }
            else {
                setMessage(2);
            }
        }

        fetchPortfolioHistory();
        const fetchVirtualAmount = async () => {
            const result = await getData("group/findbyuserid?UserId=" + userId);
            if (result.success)
                setVirtualAmount(result.data.virtualAmount.toFixed(2));
        }
        fetchVirtualAmount();
    }, [userId])

    return (
        <Box
            className={classNames("lg-p-top", classes.wrapper)}
            display="flex"
            justifyContent="center"
        >
            <div className={classes.blogContentWrapper}>
                <div style={{ fontSize: 40, textAlign: "center" }}><u>List Of Companies</u></div>

                {
                    !message ? <div className="ParentFlex">
                        <CircularProgress color="secondary" className="preloader" />
                    </div>
                        :      
                 <MaterialTable
                    title={<ToolTip title="Transaction History" component = {()=>  <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={()=>props.setComponent(<TransactionHistory setComponent={props.setComponent}/>)}>
                            Transaction History
                        </Button>}/>}

                  style={{ fontWeight: 500, marginTop: 20 }}
                columns={[
                    {
                        title: 'S.No.',
                        field: 'tableData.id',
                        cellStyle: { textAlign: "center", backgroundColor: "#f1c40f", fontWeight: "600", width: "4%"},
                        render: rowData => rowData.tableData.id + 1
                    },
                    {
                        title: 'Company Code',
                        field: 'companyCode',
                        render: rowData => <ToolTip title= {"See "+rowData.companyName+ " Transaction History"} component= {()=> <span >
                            <Button
                                onClick={() => props.setComponent(<CompanyDetail data={rowData} setComponent={props.setComponent} setUnderlinedButton = {props.setUnderlinedButton}></CompanyDetail>)}
                                style={{ color: "blue", fontWeight: "600", border: "1px blue solid" }} >
                                {rowData.companyCode}
                            </Button>
                        </span>}/>
                    },
                    {
                        title: 'Average Buying Price',
                        field: 'totalBuyPrice',
                        render: rowData => "₹" + (rowData.totalBuyPrice / (rowData.buyStock)).toFixed(2)
                    },
                    {
                        title: 'Total Buying Price',
                        field: 'totalBuyPrice',
                        render: rowData => "₹" + (rowData.totalBuyPrice / rowData.buyStock * (rowData.buyStock - rowData.sellStock)).toFixed(2)
                    },
                    {
                        title: 'Stock Left',
                        field: 'buyStock',
                        cellStyle: { fontWeight: "600" },
                        render: rowData => rowData.buyStock - rowData.sellStock
                    },
                    {
                        title: 'Current Price',
                        field: 'currentPrice',
                        render: rowData => "₹" + rowData.currentPrice.toFixed(2)
                    },
                    {
                        title: 'Total Current Price',
                        field: 'currentPrice',
                        render: rowData => "₹" + (rowData.currentPrice * (rowData.buyStock - rowData.sellStock)).toFixed(2)
                    },
                    {
                        title: 'Profit/Loss',
                        field: 'PL',
                        render: rowData => <span style={{ fontWeight: 900, fontSize: "1.2rem", color: rowData.PL >= 0 ? rowData.PL === 0 ? "orange" : "green" : "red" }}> ₹{rowData.PL.toFixed(2)} </span>
                    },
                ]
                }
                data={data}
                components={{
                    Body: (props) => (
                        <>
                            <MTableBody {...props} />
                            <TableFooter>
                                <TableRow style={{ backgroundColor: "#48dbfb" }}>
                                    <TableCell colSpan={2} style={{ textAlign: "center", color: "black", fontSize: "1.2rem", fontWeight: "600" }}>TOTAL  </TableCell>
                                    <TableCell style={{ color: "black", fontSize: "1.2rem" }}>:</TableCell>
                                    <TableCell style={{ color: "black", fontSize: "1.2rem", fontWeight: "500" }}>₹{totalBuyPrice.toFixed(2)}</TableCell>
                                    <TableCell style={{ color: "black", fontSize: "1.2rem", fontWeight: "500" }}>{totalStock}</TableCell>
                                    <TableCell style={{ color: "black", fontSize: "1.2rem" }}></TableCell>
                                    <TableCell style={{ color: "black", fontSize: "1.2rem", fontWeight: "500" }}>₹{totalCurrentPrice.toFixed(2)}</TableCell>
                                    <TableCell style={{ color: totalPL >= 0 ? totalPL === 0 ? "orange" : "green" : "red", fontSize: "1.2rem", fontWeight: "800" }}>₹{totalPL}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="tablecell" colSpan={8}>
                                        <Divider style={{ margin: 20 }} />
                                        <div style={{ margin: 10 }}>Current Invested Amount : <span style={{ color: "red" }}>₹{totalBuyPrice.toFixed(2)}</span></div>
                                        <div style={{ margin: 10 }}>Total Brokerage Charge : <span style={{ color: "red" }}>₹{count * 10} </span></div>
                                        <div style={{ margin: 10 }}>Amount left in your bucket for buying stocks : <span style={{ color: "red" }}>₹{virtualAmount}</span></div>
                                        <div style={{ margin: 10 }}>Net Amount : <span style={{ color: "red" }}>₹{(parseFloat(totalBuyPrice) + parseFloat(virtualAmount) + totalPL).toFixed(2)}</span></div>
                                        <Divider style={{ margin: 20 }} />
                                        <div style={{ margin: 10, color: totalPL > 0 ? "green" : "red" }}>{userData.userName} is in {totalPL > 0 ? "Profit" : "Loss"} of ₹{totalPL.toFixed(2)}</div>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </>
                    )
                }}
                localization={{
                    body: message === 1 ?
                        data.length ? null : {
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
                    paging: false,
                    headerStyle: {
                        fontSize: "1.1rem",
                        fontWeight: "500",
                        backgroundColor: "#D1D1D8",
                        textAlign: "center",
                    },
                    searchFieldStyle: {
                        backgroundColor: "#D1D1D8",
                    },
                }}    
                />
            }
            </div>
        </Box>)
}
