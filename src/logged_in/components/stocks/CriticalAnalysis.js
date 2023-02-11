import classNames from "classnames";
import {
    Box,
    makeStyles,
    CircularProgress,
} from "@material-ui/core";
import MaterialTable from 'material-table';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import { getData, postData } from "../../../service/service";
import MemberShip from "../../../shared/components/MemberShip";
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
    message: {
        color: "red",
        fontWeight: "600"
    }
}))

export default function CriticalAnalysis(props) {

    const classes = useStyles();

    const [data, setData] = useState([]);
    const [message, setMessage] = useState(false);

    const user = useSelector(state => state.user);
    let group = useSelector(state => state.group)
    let groupId = Object.values(group)[0] ? Object.values(group)[0] : {};
    useSelector(state => state);

    useEffect(function () {
        setMessage(false);
        const fetchAllHistory = async () => {
            let resultHistory;
            if (eventInfo) {
                const body = { ppmDreamNiftyId: eventInfo.id }
                resultHistory = await postData("dreamNifty/criticalanalysis/List", body);
            } else {
                resultHistory = await getData("criticalanalysis/Data/" + groupId.group);
            }
            if (resultHistory.success) {
                setMessage(1)
                const finalData = resultHistory.data.map(function (rowData, index) {
                    rowData.id = index + 1
                    rowData.companyName = rowData.companyName + "(" + rowData.companyCode + ")";
                    rowData.averageBuyPrice = rowData.totalBuyPrice / rowData.totalBuyStock
                    rowData.PL = rowData.currentPrice * rowData.totalBuyStock - rowData.totalBuyPrice
                    rowData.PLPercent = (rowData.currentPrice * rowData.totalBuyStock - rowData.totalBuyPrice) * 100 / rowData.totalBuyPrice
                    return rowData;
                })
                setData(finalData);
            }
            else {
                setMessage(2)
            }
        }
        fetchAllHistory()

        if (!eventInfo) {
            fetchActivePlan();
        }
        // eslint-disable-next-line
    }, [user, groupId.group])

    const eventInfo = JSON.parse(sessionStorage.getItem('clickedEvent'));

    const fetchActivePlan = async () => {
        if (groupId.group !== "" && groupId.group) {
            const data = await getData("subscription/user/hasActivePlan?ppmGroupId=" + groupId.group);
            if (data.success && data.data.length) {

            } else {
                Swal.fire({
                    title: "Plan Status",
                    text: "Currently You don't have any active subscription plan. Please buy a play to continue",
                    icon: "info"
                })
                props.setComponent(<MemberShip setUnderlinedButton={props.setUnderlinedButton} setComponent={props.setComponent} />)
                props.setUnderlinedButton("Membership");
            }
        } else {
            Swal.fire({
                title: "Group Status",
                text: "Currently you are not present in any group please contact to administrator",
                icon: "info"
            })
        }
    }

    return <Box
        className={classNames("lg-p-top", classes.wrapper)}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
    >
        <DreamNiftyHeading />
        <div className={classes.blogContentWrapper + " animation-bottom-top"}>
            <div style={{ fontSize: 40, textAlign: "center" }}><u>Critical Analysis</u></div>

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
                                field: 'id',
                                cellStyle: { textAlign: "center", backgroundColor: "#f1c40f", fontWeight: "600", width: "4%" },
                                render: rowData => rowData.id
                            },
                            {
                                title: 'Company',
                                field: "companyName",
                                cellStyle: { color: "blue" },
                                render: rowData => rowData.companyName,
                            },
                            {
                                title: 'Number of users Purchased',
                                field: "userCount",
                                cellStyle: { textAlign: "center", fontWeight: "900" },
                                render: rowData => rowData.userCount
                            },
                            {
                                title: 'Current Price (Rs)',
                                field: "currentPrice",
                                render: rowData => "₹" + rowData.currentPrice
                            },
                            {
                                title: 'Total Buy Stock',
                                field: "totalBuyStock",
                                render: rowData => rowData.totalBuyStock
                            },
                            {
                                title: 'Total Sell Stock',
                                field: "totalSellStock",
                                render: rowData => rowData.totalSellStock
                            },
                            {
                                title: 'Average Buying Price (Rs)',
                                field: "averageBuyPrice",
                                render: rowData => "₹" + rowData.averageBuyPrice.toFixed(2)
                            },
                            {
                                title: 'Total Profit/Loss (Rs)',
                                field: "PL",
                                cellStyle: { textAlign: "center", fontWeight: "900" },
                                render: rowData => <span style={{
                                    color: rowData.PL >= 0 ? "green" : "red"
                                }}>
                                    ₹{rowData.PL.toFixed(2)}
                                </span>
                            },
                            {
                                title: 'Percentage Profit/Loss',
                                field: "PLPercent",
                                cellStyle: { textAlign: "center", fontWeight: "900" },
                                render: rowData => rowData.PLPercent >= 0 ? <span style={{ color: "green" }}>
                                    <i class="fas fa-arrow-up"></i>{rowData.PLPercent.toFixed(2)}%
                                </span> :
                                    <span style={{ color: "red" }}>
                                        <i class="fas fa-arrow-down"></i>{rowData.PLPercent.toFixed(2)}%
                                    </span>
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
                            filtering: true,
                            pageSize: 10,
                            emptyRowsWhenPaging: false,
                            pageSizeOptions: [10, 20, 30, 50],
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
}