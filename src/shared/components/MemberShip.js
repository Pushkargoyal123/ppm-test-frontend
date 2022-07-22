import classNames from "classnames";
import {Divider, Box, makeStyles, Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { getData } from "../../service/service";

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
    },
    wrapper: {
        minHeight: "60vh",
    },
}))

export default function MemberShip() {

    const [featurePlans, setFeaturePlans] = useState([]);
    const [plans, setPlans] = useState([]);
    const [planChargeList, setPLanChargeList] = useState([]);

    const classes = useStyles();
    useEffect(function () {
        fetchAllData();
    }, [])

    const fetchAllData = async () => {
        const plans = await getData("plans/planList");

        const featurePLans = await getData("plans/getFeaturePlans");

        const planCharges = await getData("plans/getMonthlyPlansList");

        if (plans.success && featurePLans.success) {
            setPlans(plans.data)
            setFeaturePlans(featurePLans.data);
        }
        if (planCharges.success) {
            setPLanChargeList(planCharges.data);
        }
    }

    return (<Box
        className={classNames("lg-p-top", classes.wrapper)}
        display="flex"
        justifyContent="center"
    >
        <div className={classes.blogContentWrapper}>
            <div style={{ fontSize: 40, textAlign: "center" }}><u>MemberShip Levels</u></div>
            <Table style={{marginTop: 20}}>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ fontSize: 18 }}>Feature Name</TableCell>
                        {
                            plans.map(function (plan) {
                                return <TableCell style={{ fontSize: 18, textAlign: "center" }}>{plan.planName}</TableCell>
                            })
                        }
                    </TableRow>
                </TableHead>
                {
                    featurePlans.map(function (feature) {
                        return <TableRow style={{backgroundColor: "#ecf0f1"}} >
                            <TableCell style={{ fontSize: 18 }}>{feature.featureName}</TableCell>
                            {
                                feature.ppm_subscription_plan_features.map(function (planFeature) {
                                    return <TableCell style={{ fontSize: 18, textAlign:"center" }}>
                                        {
                                            planFeature.featureValue === "YES" ?
                                                <CheckCircleOutlineRoundedIcon className="tick-icon" /> :
                                                planFeature.featureValue === "NO" ?
                                                    <CancelOutlinedIcon className="cross-icon" /> :
                                                    <span style={{ color: "blue" }}>{planFeature.featureValueDisplay}</span>
                                        }
                                    </TableCell>
                                })
                            }
                        </TableRow>
                    })
                }
                <Divider style={{width:"249%"}}/> <Divider style={{width:"249%"}}/>
                {
                    planChargeList.map(function (month) {
                        return <TableRow >
                            <TableCell style={{ fontSize: 18 }}>{month.monthValue} Months</TableCell>
                            {
                                month.ppm_subscription_monthly_plan_charges.map(function (planCharge) {
                                    return <TableCell style={{ fontSize: 18 }}>
                                        {
                                            <div style={{textAlign:"center"}}>
                                                <span> <s style={{color:"grey"}}> ₹{planCharge.strikePrice}/- </s></span>
                                                <span>₹{planCharge.displayPrice}/-</span>
                                                <span> (-{ Math.round((planCharge.strikePrice - planCharge.displayPrice) * 100 / planCharge.strikePrice) } %)</span>
                                                <br/>
                                                <Button variant="contained" color="secondary">Buy Now</Button>
                                            </div>
                                        }
                                    </TableCell>
                                })
                            }
                        </TableRow>
                    })
                }
            </Table>

        </div>
    </Box>)
}