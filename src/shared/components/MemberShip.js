import classNames from "classnames";
import { useSelector } from "react-redux";
import { Divider, Box, makeStyles, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from "@material-ui/core/CircularProgress";
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Swal from "sweetalert2";

import { getData, postData } from "../../service/service";
import PayModal from "./PayModal";
import ReferralModal from "./ReferralModal";

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

export default function MemberShip(props) {

    const [message, setMessage] = useState(false);
    const [modalStyle] = useState(getModalStyle);
    const [featurePlans, setFeaturePlans] = useState([]);
    const [plans, setPlans] = useState([]);
    const [planChargeList, setPLanChargeList] = useState([]);
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState("");
    const [openReferralModal, setOpenReferralModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState({});
    const [displayPrice, setDisplayPrice] = useState("");
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [index, setIndex] = useState(0);
    const [body, setBody] = React.useState(1);
    const [planChargeId, setPlanChargeId] = useState("");
    const [referToDiscount, setReferToDiscount] = useState(0);
    const [referToFinalPrice, setReferToFinalPrice] = useState(0);
    const [referByDiscount, setReferByDiscount] = useState(0);
    const [referByFinalPrice, setReferByFinalPrice] = useState(0);

    const classes = useStyles();
    useEffect(function () {
        fetchAllData();
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, [message])

    const user = useSelector(state => state.user)
    const userData = Object.values(user)[0];
    let group = useSelector(state => state.group)
    let groupId = Object.values(group)[0];
    const userGroup = useSelector(state => state.userGroup)
    const userGroupId = Object.values(userGroup)[0];
    useSelector((state) => state)

    const fetchAllData = async () => {
        const plans = await getData("plans/planListForUser");

        const featurePLans = await getData("plans/getFeaturePlans");

        const planCharges = await getData("plans/getMonthlyPlansList");

        if (plans.success && featurePLans.success) {
            setPlans(plans.data)
            setFeaturePlans(featurePLans.data);
            setMessage(1)
        }
        if (planCharges.success) {
            setPLanChargeList(planCharges.data);
            setMessage(1)
        }
    }

    const options = {
        key: "rzp_test_GQ6XaPC6gMPNwH",
        amount: referToFinalPrice * 100,
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
                ppmUserGroupId: userGroupId.userGroup,
                MonthlyPlanDisplayPrice: displayPrice,
                referToDiscountPercent: referToDiscount,
                referToDiscountAmount: displayPrice - referToFinalPrice,
                referByDiscountPercent: referByDiscount,
                referByDiscountAmount: referByFinalPrice ? displayPrice - referByFinalPrice : 0
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
        var rzpl = new window.Razorpay(options);
        rzpl.open();
    }

    const handleOpenModal = async (planCharge, month, index) => {
        if (userData) {
            if (userGroupId) {
                const data = await getData("plans/hasPlan?ppmUserGroupId=" + userGroupId.userGroup);
                if (data.success && data.data) {
                    Swal.fire({
                        icon: 'info',
                        title: 'OOPS!!',
                        text: "You Already have an active " + data.data.ppm_subscription_plan.planName + " plan of " + data.data.ppm_subscription_month.monthValue + " months In " + data.data.ppm_userGroup.ppm_group.name + "-" + data.data.ppm_userGroup.ppm_group.value + " that is valid upto " + data.data.endDate.split(",")[0],
                    })
                } else if (groupId.group === "") {
                    Swal.fire({
                        icon: 'info',
                        title: 'OOPS!!',
                        text: "You can't buy any plan since you are not present in any group. Contact to administrator to put you in a group",
                    })
                }
                else {
                    setOpen(true)
                    setMonth(month.monthValue);
                    setDisplayPrice(planCharge.displayPrice)
                    setReferToFinalPrice(planCharge.displayPrice)
                    setPlanChargeId(planCharge.id);
                    setSelectedPlan(plans[index]);
                    setIndex(index);
                }
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'OOPS!!',
                    text: "You can't buy any plan since you are not present in any group. Contact to administrator to put you in a group",
                })
            }
        }
        else {
            setOpen(true)
            setMonth(month.monthValue);
            setDisplayPrice(planCharge.displayPrice)
            setReferToFinalPrice(planCharge.displayPrice)
            setPlanChargeId(planCharge.id);
            setSelectedPlan(plans[index]);
            setIndex(index);
        }
    }

    const openTheReferralModal = () => {
        if (!Object.values(user)[0]) {
            setOpenReferralModal(false);
            setOpen(true);
            setBody(1)
            setOpenLoginModal(true)
        } else {
            setOpen(false);
            setOpenReferralModal(true)
        }
    }

    return (<Box
        className={classNames("lg-p-top", classes.wrapper)}
        display="flex"
        justifyContent="center"
    >
        <div className={classes.blogContentWrapper + " animation-bottom-top"}>
            {
                userData ? <div>
                    <div style={{ fontSize: 40, textAlign: "center" }}><u>MemberShip</u></div>
                </div> :
                    <div style={{ fontSize: 40, textAlign: "center" }}>
                        <u>Membership</u>
                    </div>
            }
            {
                !message ? <div className="ParentFlex">
                    <CircularProgress color="secondary" className="preloader" />
                </div>
                    :
                    <Table style={{ marginTop: 20 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontSize: 18 }}>Feature Name</TableCell>
                                {
                                    plans.map(function (plan, index) {
                                        return <TableCell key={index} style={{ fontSize: 18, textAlign: "center" }}>{plan.planName}</TableCell>
                                    })
                                }
                            </TableRow>
                        </TableHead>
                        {
                            featurePlans.map(function (feature, index) {
                                return <TableRow key={index} style={{ backgroundColor: "#ecf0f1" }} >
                                    <TableCell style={{ fontSize: 18 }}>{feature.featureName}</TableCell>
                                    {
                                        feature.ppm_subscription_plan_features.map(function (planFeature, index) {
                                            return <TableCell key={index} style={{ fontSize: 18, textAlign: "center" }}>
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
                            planChargeList.map(function (month, index) {
                                return <TableRow key={index}>
                                    <TableCell style={{ fontSize: 18 }}>{month.monthValue} Months</TableCell>
                                    {
                                        month.ppm_subscription_monthly_plan_charges.map(function (planCharge, index) {
                                            return <TableCell key={index} style={{ fontSize: 18 }}>
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
            }

        </div>

        <PayModal
            open={open}
            setOpen={setOpen}
            featurePlans={featurePlans}
            displayPrice={displayPrice}
            selectedPlan={selectedPlan}
            modalStyle={modalStyle}
            month={month}
            openTheReferralModal={openTheReferralModal}
            openLoginModal={openLoginModal}
            setOpenLoginModal={setOpenLoginModal}
            index={index}
            body={body}
            setBody={setBody}
        />

        <ReferralModal
            openReferralModal={openReferralModal}
            setOpenReferralModal={setOpenReferralModal}
            openPayModal={openPayModal}
            planChargeId={planChargeId}
            displayPrice={displayPrice}
            modalStyle={modalStyle}
            referByDiscount={referByDiscount}
            setReferByDiscount={setReferByDiscount}
            referToDiscount={referToDiscount}
            setReferToDiscount={setReferToDiscount}
            referToFinalPrice={referToFinalPrice}
            setReferToFinalPrice={setReferToFinalPrice}
            referByFinalPrice={referByFinalPrice}
            setReferByFinalPrice={setReferByFinalPrice}
        />

    </Box>)
}