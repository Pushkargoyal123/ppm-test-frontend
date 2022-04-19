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

    useEffect(function () {

        const fetchPortfolioHistory = async () => {

            const resultportfolio = await getData("stock/fetchportfoliohistory");

            if (resultportfolio.success) { 
                setMessage(1);
                let totalBuyPrice =0, stockLeft=0, totalCurrentPrice=0,count = 0 , totalProfitLoss=0;
                resultportfolio.data.forEach(function(item, index){
                        item.averageBuyingPrice = item.totalBuyingPrice / item.totalBuyStock;
                        item.totalBuyingPrice = item.totalBuyingPrice - item.totalSellingPrice;
                        item.PL = item.totalCurrentPrice - item.totalBuyingPrice;
                })
                resultportfolio.data.forEach(function(item, index){
                    totalProfitLoss += item.PL
                    totalBuyPrice += item.totalBuyingPrice; 
                    stockLeft += parseInt(item.stockLeft);
                    totalCurrentPrice += parseFloat(item.totalCurrentPrice);
                    count += item.count;
                })
                setTotalBuyPrice(totalBuyPrice);
                setTotalStock(stockLeft);
                setTotalCurrentPrice(totalCurrentPrice);
                setTotalPL(totalProfitLoss);
                setCount(count);
                setData(resultportfolio.data);
            }
            else {
                setMessage(2);
            }
        }

        fetchPortfolioHistory();
        const fetchVirtualAmount = async () => {
            const result = await getData("user/findvirtualamountyuserid");
            if (result.success)
                setVirtualAmount(result.data.virtualAmount.toFixed(2));
        }
        fetchVirtualAmount();
    }, [])

    return (
        <Box
            className={classNames("lg-p-top", classes.wrapper)}
            display="flex"
            justifyContent="center"
        >
            <div className={classes.blogContentWrapper  + " animation-bottom-top"}>
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
                        onClick={()=>props.setComponent(<TransactionHistory setUnderlinedButton = {props.setUnderlinedButton} setComponent={props.setComponent}/>)}>
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
                                style={{ color: "blue", fontWeight: "600", border: "1px blue solid", width:"100%" }} >
                                {rowData.companyCode}
                            </Button>
                        </span>}/>
                    },
                    {
                        title: 'Average Buying Price',
                        field: 'averageBuyingPrice',
                        render: rowData => "₹" + (rowData.averageBuyingPrice).toFixed(2)
                    },
                    {
                        title: 'Total Buying Price',
                        field: 'totalBuyingPrice',
                        render: rowData => "₹" + (rowData.totalBuyingPrice).toFixed(2)
                    },
                    {
                        title: 'Stock Left',
                        field: 'stockLeft',
                        cellStyle: { fontWeight: "600" },
                        render: rowData => rowData.stockLeft
                    },
                    {
                        title: 'Current Price',
                        field: 'currentPrice',
                        render: rowData => "₹" + rowData.currentPrice.toFixed(2)
                    },
                    {
                        title: 'Total Current Price',
                        field: 'totalCurrentPrice',
                        render: rowData => "₹" + (rowData.totalCurrentPrice).toFixed(2)
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
                                    <TableCell style={{ color: totalPL >= 0 ? totalPL === 0 ? "orange" : "green" : "red", fontSize: "1.2rem", fontWeight: "800" }}>₹{totalPL.toFixed(2)}</TableCell>
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
