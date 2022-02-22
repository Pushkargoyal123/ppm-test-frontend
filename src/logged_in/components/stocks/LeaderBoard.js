import classNames from "classnames";
import {
    Box,
    makeStyles,
    CircularProgress,
} from "@material-ui/core";
import MaterialTable from 'material-table';
import { useEffect, useState } from "react";
import { getData } from "../../../service/service";
import { useSelector } from "react-redux";

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
    message: {
        color: "red",
        fontWeight: "600"
    }
}))

export default function LeaderBoard() {
    const classes = useStyles();

    const [data, setData] = useState([]);
    const [message, setMessage] = useState(false);

    useEffect(function () {
        fetchUsers();
    }, [])

    const user = useSelector(state => state.user)
    const userId = Object.values(user)[0].id

    async function fetchUsers() {
        const usersList = await getData("user/fetchleaderboarddata");
        if (usersList.success) {
            setMessage(1)
            setData(usersList.data);
        }
        setMessage(2);
    }

    return (
        <Box
            className={classNames("lg-p-top", classes.wrapper)}
            display="flex"
            justifyContent="center"
        >
            <div className={classes.blogContentWrapper}>
                <div style={{ fontSize: 40, textAlign: "center" }}><u>Leader Board</u></div>

                {
                    !message ? <div className="ParentFlex">
                        <CircularProgress color="secondary" className="preloader" />
                    </div>
                        :
                        <MaterialTable
                            title=" "
                            style={{ fontWeight: 500, marginTop: 20 }}
                            columns={[
                                {
                                    title: 'SNo.',
                                    field: 'tableData.id',
                                    cellStyle: { textAlign: "center", backgroundColor: "#f1c40f", fontWeight: "600" },
                                    render: rowData => rowData.tableData.id + 1
                                },
                                {
                                    title: 'Name',
                                    field: 'userName',
                                    cellStyle: { color: "blue", fontWeight: "600" },
                                    render: rowData => rowData.userName
                                },
                                {
                                    title: 'Current Investment(Rs)',
                                    field: 'current_investment',
                                    render: rowData => "₹" + rowData.current_investment
                                },
                                {
                                    title: 'Profit/Loss (Rs)',
                                    field: 'totalCurrentPrice',
                                    cellStyle: { fontWeight: 700 },
                                    render: rowData => (rowData.current_investment - rowData.totalCurrentPrice) >= 0 ?
                                        <span style={{ color: "green" }}> {"₹" + (rowData.current_investment - rowData.totalCurrentPrice).toFixed(2)}</span> :
                                        <span style={{ color: "red" }}>{"₹" + (rowData.current_investment - rowData.totalCurrentPrice).toFixed(2)}</span>
                                },
                                {
                                    title: 'Profit/Loss per Day(Rs)',
                                    cellStyle: { color: "orange", fontWeight: 700 },
                                    render: rowData => "₹" + ((rowData.current_investment - rowData.totalCurrentPrice) / Math.round((new Date() - new Date(rowData.dateOfRegistration)) / (24 * 60 * 60 * 1000))).toFixed(2)
                                },
                                {
                                    title: 'Brokrage Amount(Rs)',
                                    field: "number",
                                    cellStyle: { fontWeight: "600" },
                                    render: rowData => rowData.number * 10
                                },
                                {
                                    title: "Praedico's Virtual Amount(Rs)",
                                    field: 'virtualAmount',
                                    render: rowData => "₹ " + rowData.ppm_userGroups[0].virtualAmount.toFixed(2)
                                },
                                {
                                    title: 'Net Amount(Rs)',
                                    field: 'netAmount',
                                    render: rowData => "₹" + rowData.ppm_userGroups[0].netAmount.toFixed(2)
                                },
                                {
                                    title: 'Starting Date',
                                    field: 'dateOfRegistration',
                                    render: rowData => rowData.dateOfRegistration
                                },
                            ]
                            }
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
                                rowStyle: (rowData) => {
                                    if (rowData.id === userId)
                                        return {
                                            fontWeight: 900,
                                            backgroundColor: "#c8d6e5"
                                        };
                                },
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
        </Box>
    )
}