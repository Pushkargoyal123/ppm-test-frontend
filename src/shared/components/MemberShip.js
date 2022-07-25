import classNames from "classnames";
import { Divider, Box, makeStyles, Button, Dialog, useMediaQuery } from "@material-ui/core";
import { useEffect, useState } from "react";
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useTheme } from '@material-ui/core/styles';

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

function getModalStyle() {
    return {
        textAlign: "center",
        backgroundColor: "white",
        border: '2px solid grey',
        height: "100%",
    };
}

export default function MemberShip() {

    const [modalStyle] = useState(getModalStyle);
    const [featurePlans, setFeaturePlans] = useState([]);
    const [plans, setPlans] = useState([]);
    const [planChargeList, setPLanChargeList] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState({});
    const [displayPrice, setDisplayPrice] = useState("");
    const [month, setMonth] = useState("");
    const [index, setIndex] = useState(0);

    const classes = useStyles();
    useEffect(function () {
        fetchAllData();
    }, [])

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

    const handleOpenModal = (planCharge, month, index) => {
        setOpen(true)
        setMonth(month.monthValue);
        setDisplayPrice(planCharge.displayPrice)
        setSelectedPlan(plans[index]);
        setIndex(index);
    }

    const dateFormat = () =>{
        let date = new Date();
        date.setMonth(date.getMonth() + month);
        return date.toISOString().split('T')[0]
    }

    return (<Box
        className={classNames("lg-p-top", classes.wrapper)}
        display="flex"
        justifyContent="center"
    >
        <div className={classes.blogContentWrapper}>
            <div style={{ fontSize: 40, textAlign: "center" }}><u>MemberShip Levels</u></div>
            <Table style={{ marginTop: 20 }}>
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
                        return <TableRow style={{ backgroundColor: "#ecf0f1" }} >
                            <TableCell style={{ fontSize: 18 }}>{feature.featureName}</TableCell>
                            {
                                feature.ppm_subscription_plan_features.map(function (planFeature) {
                                    return <TableCell style={{ fontSize: 18, textAlign: "center" }}>
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
                <Divider style={{ width: "249%" }} /> <Divider style={{ width: "249%" }} />
                {
                    planChargeList.map(function (month) {
                        return <TableRow >
                            <TableCell style={{ fontSize: 18 }}>{month.monthValue} Months</TableCell>
                            {
                                month.ppm_subscription_monthly_plan_charges.map(function (planCharge, index) {
                                    return <TableCell style={{ fontSize: 18 }}>
                                        {
                                            <div style={{ textAlign: "center" }}>
                                                <span> <s style={{ color: "grey" }}> ₹{planCharge.strikePrice}/- </s></span>
                                                <span>₹{planCharge.displayPrice}/-</span>
                                                <span> (-{Math.round((planCharge.strikePrice - planCharge.displayPrice) * 100 / planCharge.strikePrice)} %)</span>
                                                <br />
                                                <Button variant="contained" color="secondary" onClick= {()=> handleOpenModal(planCharge, month, index)}>Buy Now</Button>
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

        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            style={{maxWidth: 600, margin:"auto"}}
        >
            <div style={modalStyle} >
                <div className="flexBox">
                    <span></span>
                    <h2 id="simple-modal-title">Selected Plan</h2>
                    <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => setOpen(false)} class="fas fa-times"></i>
                </div>
                <div className="planModal">
                    <div style={{margin:20}}>
                        <img src={"images/shared/" + selectedPlan.planName  + ".png"} alt="plan"/>
                    </div>
                    <div style={{textAlign: "left", margin: 20}}> 
                        You have selected 
                        <span style={{ fontWeight: "bold" }}> {selectedPlan.planName} </span> 
                        plan of 
                        <span style={{color: "green", fontWeight: "bold"}}> (₹{displayPrice}/-) </span> 
                        for {month} Months and it is valid upto 
                        <span style={{ color: "blue", fontWeight: "bold"}}> {" " + dateFormat()} </span>
                        <br/>
                        In this plan we will offer you { featurePlans.length } major service access these are :
                        {
                            featurePlans.map(function(features){
                                return features.ppm_subscription_plan_features[index].featureValue === "YES" ? 
                                    <li style={{marginLeft: 10}}>  {features.featureName} </li> :
                                    <div></div>
                            })
                        }
                        <Button color="secondary" variant="contained" style={{marginTop: 10}}>Register</Button>
                    </div>
                </div>
            </div>
        </Dialog>
    </Box>)
}