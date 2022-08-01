import classNames from "classnames";
import { useSelector } from "react-redux";
import { Divider, Box, makeStyles, Button, Dialog, useMediaQuery } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useTheme } from '@material-ui/core/styles';
import Swal from "sweetalert2";

import { getData, postData } from "../../service/service";
import CalledModal from "../../service/CalledModal";

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
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openReferralModal, setOpenReferralModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState({});
    const [displayPrice, setDisplayPrice] = useState("");
    const [month, setMonth] = useState("");
    const [index, setIndex] = useState(0);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [body, setBody] = React.useState(false);
    const [generatedOTP, setGeneratedOTP] = useState("");

    const classes = useStyles();
    useEffect(function () {
        fetchAllData();
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, [])

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const user = useSelector(state => state.user)

    const fetchAllData = async () => {
        const plans = await getData("plans/planListForUser");

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

    const dateFormat = () => {
        let date = new Date();
        date.setMonth(date.getMonth() + month);
        return date.toISOString().split('T')[0]
    }

    const options = {
        key: "rzp_test_GQ6XaPC6gMPNwH",
        amount: displayPrice * 100,
        name: "Praedico",
        description: "Stock Market",
        image: "/images/logged_out/pgr_logo.png",
        handler: async function (response) {
            let endDate = new Date();
            endDate.setMonth(endDate.getMonth() + month)

            const selectedMonth = planChargeList.filter(function (item) {
                return item.monthValue === month
            })

            let ppmSubscriptionMonthlyPlanChargeId;
            if (selectedMonth.length) {
                ppmSubscriptionMonthlyPlanChargeId = selectedMonth[0].ppm_subscription_monthly_plan_charges.filter(function (item) {
                    return item.displayPrice === Number(displayPrice)
                })[0].id
            }

            setOpen(false);
            setOpenReferralModal(false)

            let body = {
                startDate: new Date().toLocaleString(),
                endDate: endDate.toLocaleString(),
                UserId: Object.values(user)[0].id,
                ppmSubscriptionPlanId: selectedPlan.id,
                ppmSubscriptionMonthId: selectedMonth[0].id,
                ppmSubscriptionMonthlyPlanChargeId: ppmSubscriptionMonthlyPlanChargeId,
                ppmUserGroupId: Object.values(user)[0].userGroupId
            }
            const data = await postData("plans/addUserSubscription", body);
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Congratulations!! You have successfully buyed our plans',
                    text: "Now you can start buy or sell our stocks",
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'OOPS!!',
                    text: "Something went wrong",
                })
            }
        },
        prefill: {
            name: Object.values(user)[0] ? Object.values(user)[0].userName : null,
            contact: Object.values(user)[0] ? Object.values(user)[0].phone : null,
            email: Object.values(user)[0] ? Object.values(user)[0].email : null,
        },
        notes: {
            address: "some address"
        },
        theme: {
            color: "blue",
            hide_topbar: false
        }
    }

    const openPayModal = () => {
        if (!Object.values(user)[0]) {
            setOpenReferralModal(false);
            setOpen(true);
            setBody(1)
            setOpenLoginModal(true)
        } else {
            var rzpl = new window.Razorpay(options);
            rzpl.open();
        }
    }

    const openTheReferralModal = () => {
        setOpen(false);
        setOpenReferralModal(true)
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
                <Divider style={{ width: "258%" }} /> <Divider style={{ width: "258%" }} />
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
                                                <Button variant="contained" color="secondary" onClick={() => handleOpenModal(planCharge, month, index)}>Buy Now</Button>
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
            style={{ maxWidth: 600, margin: "auto" }}
        >
            <div style={modalStyle} >
                <div className="flexBox">
                    <span></span>
                    <h2 id="simple-modal-title">Selected Plan</h2>
                    <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => setOpen(false)} class="fas fa-times"></i>
                </div>
                <div className="planModal">
                    <div style={{ margin: 20 }}>
                        <img src={"/images/shared/" + selectedPlan.planName + ".png"} alt="plan" />
                    </div>
                    <div style={{ textAlign: "left", margin: 20 }}>
                        You have selected
                        <span style={{ fontWeight: "bold" }}> {selectedPlan.planName} </span>
                        plan of
                        <span style={{ color: "green", fontWeight: "bold" }}> (₹{displayPrice}/-) </span>
                        for {month} Months and it is valid upto
                        <span style={{ color: "blue", fontWeight: "bold" }}> {" " + dateFormat()} </span>
                        <br />
                        In this plan we will offer you {featurePlans.length} major service access these are :
                        {
                            featurePlans.map(function (features) {
                                return features.ppm_subscription_plan_features[index].featureValue === "YES" ?
                                    <li style={{ marginLeft: 10 }}>  {features.featureName} </li> :
                                    <div></div>
                            })
                        }
                        <Button
                            onClick={() => openTheReferralModal()}
                            color="secondary"
                            variant="contained"
                            style={{ marginTop: 10 }}
                        >
                            Register
                        </Button>
                    </div>
                    <Dialog
                        fullScreen={fullScreen}
                        open={openLoginModal}
                        onClose={() => setOpenLoginModal(false)}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                    >
                        {CalledModal(openLoginModal, setGeneratedOTP, setEmail, generatedOTP, setOpenLoginModal, body, setBody, loginEmail, setLoginEmail, email, password, setPassword, setLoginPassword, loginPassword)}
                    </Dialog>
                </div>
            </div>
        </Dialog>

        <Dialog
            fullScreen={fullScreen}
            open={openReferralModal}
            onClose={() => setOpenReferralModal(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            style={{ maxWidth: 600, margin: "auto" }}
        >
            <div style={modalStyle}>
                <div className="flexBox">
                    <span></span>
                    <h2 id="simple-modal-title">Are You sure</h2>
                    <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => setOpenReferralModal(false)} class="fas fa-times"></i>
                </div>
                <Button
                    onClick={() => openPayModal()}
                    color="secondary"
                    variant="contained"
                    style={{ marginTop: 10 }}
                >
                    Pay Now
                </Button>
            </div>
        </Dialog>

    </Box>)
}