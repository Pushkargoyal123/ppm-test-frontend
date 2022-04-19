import classNames from "classnames";
import { Box, makeStyles } from "@material-ui/core";
import MaterialTable from 'material-table';
import { useEffect, useState } from "react"
import { getData } from "../../../service/service";
import CircularProgress from '@material-ui/core/CircularProgress';
import ToolTip from "../../../shared/components/ToolTip";
import KeyboardBackspaceRoundedIcon from '@material-ui/icons/KeyboardBackspaceRounded';
import Portfolio from "./Portfolio";

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

export default function TransactionHistory(props) {
    const classes = useStyles();

    const [data, setData] = useState([]);
    const [message, setMessage] = useState(false);

    useEffect(function () {
        const fetchTransactionHistory = async () => {
            const resultportfolio = await getData("stock/fetchusertransactionhistory")
            if (resultportfolio.success) {
                setMessage(1)
                setData(resultportfolio.data);
            }
            else{
                setMessage(2);
            }
        }
        fetchTransactionHistory()
    }, [])

    return (
        <Box
            className={classNames("lg-p-top", classes.wrapper)}
            display="flex"
            justifyContent="center"
        >
            <div className={classes.blogContentWrapper + " animation-bottom-top"}>
                <div style={{ fontSize: 40, textAlign: "center" }}><u>Transaction History</u></div>

                {
                    !message ? <div className="ParentFlex">
                        <CircularProgress color="secondary" className="preloader" />
                    </div>
                        :
                        <MaterialTable
                            title= <ToolTip title="Back" component= {()=><KeyboardBackspaceRoundedIcon
                                color="secondary"
                                style={{ border: "1px blue solid", fontSize: "2rem", cursor: "pointer" }}
                                onClick={() => props.setComponent(<Portfolio setUnderlinedButton = {props.setUnderlinedButton} setComponent={props.setComponent} />)}
                            />} />

                            style={{ fontWeight: 500 }}
                columns={[
                    {
                        title: 'Trans_ID',
                        field: 'id',
                        cellStyle: { textAlign: "center", backgroundColor: "#e55039", color: "white", fontWeight: "600", width: "4%" },
                        customFilterAndSearch: (term, rowData) => term === parseInt(rowData.id) + 1000 + "",
                        render: rowData => parseInt(rowData.id) + 1000
                    },
                    {
                        title: 'Company',
                        field: 'companyName',
                        render: rowData => rowData.companyName + "(" + rowData.companyCode + ")"
                    },
                    {
                        title: 'Status',
                        field: 'buyStock',
                        customFilterAndSearch: (term, rowData) => term.toUpperCase() === "BUY" ? rowData.buyStock : rowData.sellStock,
                        render: rowData => rowData.buyStock > 0 ? <span style={{ color: "green", fontWeight: 600 }}>BUY</span> : <span style={{ color: "red", fontWeight: 600 }}>SELL</span>,
                    },
                    {
                        title: 'Stocks',
                        field: 'buyStock',
                        render: rowData => rowData.buyStock > 0 ? <span>{rowData.buyStock}</span> : <span>{rowData.sellStock}</span>
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
                ]}
                data={data}
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
                    pageSize: 50,
                    maxBodyHeight: '80vh',
                    emptyRowsWhenPaging: false,
                    pageSizeOptions: [50, 100, 150, 200],
                    filtering: true,
                    headerStyle: {
                        fontSize: "1.1rem",
                        fontWeight: "500",
                        backgroundColor: "#D1D1D8",
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
