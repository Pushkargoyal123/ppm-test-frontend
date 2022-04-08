import classNames from "classnames";
import CircularProgress from '@material-ui/core/CircularProgress';
import { useEffect, useState } from "react"
import MaterialTable from 'material-table';
import { Box, makeStyles } from "@material-ui/core";

import { getData } from "../../../service/service";

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
        textAlign: "justify-all"
    },
    wrapper: {
        minHeight: "60vh",
    },
}))

export default function WatchList(props) {
    const classes = useStyles();

    useEffect(function () {
        const fetchUsersWatchList = async () => {
            const result = await getData("watchlist/fetchuserwatchlist")
            console.log(result);
            if (result.success) {
                setMessage(1)
                setData(result.data);
            }
            else{
                setMessage(2);
            }
        }
        fetchUsersWatchList()
    }, [])

    const [data, setData] = useState([]);
    const [message, setMessage] = useState(false);

    return (
        <Box
            className={classNames("lg-p-top", classes.wrapper)}
            display="flex"
            justifyContent="center"
        >
            <div className={classes.blogContentWrapper}>
                <div style={{ fontSize: 40, textAlign: "center" }}><u>Watch List</u></div>
                {
                    !message ? <div className="ParentFlex">
                        <CircularProgress color="secondary" className="preloader" />
                    </div>
                        :
                        <MaterialTable
                            title= ""
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
                                "There is no stock in your watch list"
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
