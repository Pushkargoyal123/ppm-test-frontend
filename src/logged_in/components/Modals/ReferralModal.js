import {
    Dialog,
    ListItemIcon,
    ListItemText,
    MenuItem,
    useMediaQuery,
    withStyles,
    Typography,
    Card,
    CardContent,
    Grid,
    Button
} from "@material-ui/core";
import { Assessment } from "@material-ui/icons";
import { useState, useEffect } from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { useSelector } from "react-redux";

import { getData } from "../../../service/service";
import ReferralEmailModal from "./ReferralEmailModal";

function getModalStyle() {
    return {
        // top: `${top}%`,
        // left: `${left}%`,
        // transform: `translate(-${top}%, -${left}%)`,
        // position: 'absolute',
        // minWidth: 500,
        // maxWidth: 600,
        textAlign: "center",
        backgroundColor: "white",
        border: '2px solid grey',
        // boxShadow: "0 0 8px 2px black",
        // borderRadius: 20,
        height: "100%",
        // overflowY: "scroll",
    };
}

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        marginBottom: 20
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);


export default function ReferralModal() {

    const [open, setOpen] = useState(false);
    const [modalStyle] = useState(getModalStyle);
    const [myReferrals, setMyReferrals] = useState([]);
    const [openReferralEmailModal, setOpenReferralEmailModal] = useState(false);

    const classes = useStyles();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const user = useSelector(state => state.user)
    const userData = Object.values(user)[0];

    useEffect(function () {
        fetchAllReferrals();
    }, [])

    const fetchAllReferrals = async () => {
        const data = await getData("referral/fetchAllReferrals");
        if (data.success) {
            setMyReferrals(data.data);
        }
    }

    const handleReferral = () => {
        setOpen(false);
        setOpenReferralEmailModal(true);
    }

    const handleOpenReferralModal = () => {
        setOpen(true)
    }

    return <>
        <StyledMenuItem>
            <ListItemIcon>
                <Assessment fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="My Referrals" onClick={() => handleOpenReferralModal()} />
        </StyledMenuItem>

        <ReferralEmailModal
            open = {openReferralEmailModal}
            setOpen = {setOpenReferralEmailModal}
            openReferralModal = {open}
            setOpenReferralModal = {setOpen}
        />

        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            style={{ maxWidth: 700, margin: "auto" }}
        >
            <div style={modalStyle} >
                <div className="flexBox">
                    <span></span>
                    <h2 id="simple-modal-title">My Referrals</h2>
                    <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => setOpen(false)} class="fas fa-times"></i>
                </div>
                <div style={{ margin: "0 10px" }}>
                    {
                        myReferrals.length ? <>
                            <div style={{ fontSize: 20, color: "blue" }}>You have referred {myReferrals.length} Person and for that you earned ₹{userData.referralWalletBalance}  </div>
                            <Button style={{color:"blue", textDecoration:"underline"}} className="anchor" onClick={handleReferral}>Refer a new Person</Button>
                            <Grid container>
                                {myReferrals.map(function (item) {

                                    let bonusMoney = 0;
                                    if(item.ppm_subscription_users.length){
                                        item.ppm_subscription_users.forEach(function(plans){
                                            bonusMoney += plans.referToDiscountAmount;
                                        })
                                    }

                                    return <Grid style={{margin:"auto"}}>
                                        <Card className={classes.root} variant="outlined" style={{border:"1px grey solid"}}>
                                            <CardContent>
                                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                    Bonus Money Earned : ₹{bonusMoney}
                                                </Typography>
                                                <Typography variant="h5" component="h2">
                                                    {item.userName}
                                                </Typography>
                                                <Typography className={classes.pos} color="textSecondary">
                                                    Date of Registration : {item.dateOfRegistration} 
                                                    <br/>
                                                    Date of Plan buyed : {item.ppm_subscription_users.length ? item.ppm_subscription_users[0].startDate.split(",")[0] : "No Plan Buyed"}
                                                </Typography>
                                                <Typography variant="body2" component="p">
                                                    Plan Name : {item.ppm_subscription_users.length ? item.ppm_subscription_users[0].ppm_subscription_plan.planName : "No Plan Buyed"}
                                                    <br />
                                                    Plan Price : ₹{item.ppm_subscription_users.length ? item.ppm_subscription_users[0].ppm_subscription_monthly_plan_charge.strikePrice : "No Plan Buyed"}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                })}
                            </Grid>
                        </> :   
                            <div style={{ fontSize: 20, color: "red", marginBottom: 20 }} onClick={handleReferral}>Sorry you haven't refer anyone. <br /> <Button style={{color:"blue", textDecoration:"underline"}} className="anchor"> Refer anyone </Button> to earn money </div>
                    }
                </div>
            </div>
        </Dialog>
    </>
}