import classNames from "classnames";
import {
    Box,
    makeStyles,
    CircularProgress,
    Button,
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

export default function LeaderBoard(props) {

    const classes = useStyles();

    const [data, setData] = useState([]);
    const [message, setMessage] = useState(false);

    const user = useSelector(state => state.user)
    const userId = Object.values(user)[0];
    let group = useSelector(state => state.group)
    let groupId = Object.values(group)[0] ? Object.values(group)[0] : {};
    useSelector(state=>state)

    useEffect(function () {
        setMessage(false);
        const registerType = Object.values(user)[0].registerType

        async function fetchUsers() {
            let usersList;
            if(eventInfo){
                const body = {registerType: registerType, ppmDreamNiftyId: eventInfo.id}
                usersList = await postData("dreamNifty/user/fetchleaderboarddata", body);
            }else{
                usersList = await getData("leaderboard/fetchleaderboarddata/" + registerType + "?groupId=" + groupId.group);
            } 

            const stockData = await getData("stock/fetchallstockdata");

            if (usersList.success && stockData.success) {
                setMessage(1)
                usersList.data.forEach(async function (item) {
                    item.virtualAmount = item.ppm_userGroups ? item.ppm_userGroups[0].virtualAmount : item.ppm_dream_nifty_users[0].virtualAmount;
                    item.netAmount = (item.ppm_userGroups ? item.ppm_userGroups[0].virtualAmount : item.ppm_dream_nifty_users[0].virtualAmount + item.current_investment + item.totalCurrentPrice - item.current_investment)
                    item.profitLoss = item.totalCurrentPrice - item.current_investment
                    var count = 1;
                    stockData.data.forEach(function (stockItem) {
                        const dateArray = item.dateOfRegistration.split("-");
                        dateArray[1] = dateArray[1] < 10 ? "0" + dateArray[1] : dateArray[1];
                        const newDate = dateArray.reverse().join("-");
                        if (stockItem.date >= newDate) {
                            count++;
                        }
                    })
                    item.count = count
                    if(eventInfo){
                        await postData("dreamNifty/user/setnetamount", { netAmount: item.netAmount, id: item.ppm_dream_nifty_users[0].id })
                    }else{
                        await postData("user/setnetamount", { netAmount: item.netAmount, id: item.ppm_userGroups[0].id })
                    }
                })
                usersList.data.sort(function (a, b) {
                    return a.profitLoss - b.profitLoss;
                })
                setData(usersList.data);
            } else {
                setMessage(2);
            }
        }
        if (groupId.group !== "")
            fetchUsers();

        if(!eventInfo){
            fetchActivePlan();
        }
        // eslint-disable-next-line
    }, [user, groupId.group]);

    const eventInfo = JSON.parse(sessionStorage.getItem('clickedEvent'));

    const fetchActivePlan = async () => {
        if (groupId.group !== "" && groupId.group) {
            const data = await getData("plans/hasActivePlan?ppmGroupId=" + groupId.group);
            if (data.success && data.data.length) {

            } else {
                Swal.fire({
                    title: "Plan Status",
                    text: "Currently You don't have any active subscription plan. Please buy a play to continue",
                    icon: "info"
                })
                props.setComponent(<MemberShip groupId={groupId.group} setGroupId={props.setGroupId} setUnderlinedButton={props.setUnderlinedButton} setComponent={props.setComponent} />)
                props.setUnderlinedButton("Membership");
            }
        }else{
            Swal.fire({
                title: "Group Status",
                text: "Currently you are not present in any group please contact to administrator",
                icon: "info"
            })
        }
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
                                    cellStyle: { textAlign: "center", backgroundColor: "#f1c40f", fontWeight: "600", width: "4%" },
                                    render: rowData => <Button> {rowData.tableData.id + 1}</Button>
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
                                    render: rowData => "₹" + rowData.current_investment.toFixed(2)
                                },
                                {
                                    title: 'Profit/Loss (Rs)',
                                    field: 'profitLoss',
                                    cellStyle: { fontWeight: 700 },
                                    render: rowData => (rowData.profitLoss) >= 0 ?
                                        <span style={{ color: "green" }}> {"₹" + (rowData.profitLoss).toFixed(2)}</span> :
                                        <span style={{ color: "red" }}>{"₹" + (rowData.profitLoss).toFixed(2)}</span>
                                },
                                {
                                    title: 'Profit/Loss per Day(Rs)',
                                    cellStyle: { color: "orange", fontWeight: 700 },
                                    render: rowData => (rowData.profitLoss / rowData.count) >= 0 ?
                                        <span style={{ color: "green" }}> {"₹" + (rowData.profitLoss / rowData.count).toFixed(2)} </span> :
                                        <span style={{ color: "red" }}> {"₹" + (rowData.profitLoss / rowData.count).toFixed(2)} </span>
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
                                    render: rowData => "₹ " + rowData.virtualAmount.toFixed(2)
                                },
                                {
                                    title: 'Net Amount(Rs)',
                                    field: 'netAmount',
                                    render: rowData => "₹" + (rowData.netAmount).toFixed(2)
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
                                    if (rowData.id === userId.id)
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