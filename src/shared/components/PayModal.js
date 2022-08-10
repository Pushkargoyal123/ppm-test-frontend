import { Button, Dialog, useMediaQuery } from "@material-ui/core";
import React, {useState} from "react";
import { useTheme } from '@material-ui/core/styles';

import CalledModal from "../../service/CalledModal";

export default function PayModal(props) {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [generatedOTP, setGeneratedOTP] = useState("");

    const dateFormat = () => {
        let date = new Date();
        date.setMonth(date.getMonth() + props.month);
        return date.toISOString().split('T')[0]
    }

    return <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{ maxWidth: 600, margin: "auto" }}
    >
        <div style={props.modalStyle} >
            <div className="flexBox">
                <span></span>
                <h2 id="simple-modal-title">Selected Plan</h2>
                <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => props.setOpen(false)} class="fas fa-times"></i>
            </div>
            <div className="planModal">
                <div style={{ margin: 20 }}>
                    <img src={"/images/shared/" + props.selectedPlan.planName + ".png"} alt="plan" />
                </div>
                <div style={{ textAlign: "left", margin: 20 }}>
                    You have selected
                    <span style={{ fontWeight: "bold" }}> {props.selectedPlan.planName} </span>
                    plan of
                    <span style={{ color: "green", fontWeight: "bold" }}> (₹{props.displayPrice}/-) </span>
                    for {props.month} Months and it is valid upto
                    <span style={{ color: "blue", fontWeight: "bold" }}> {" " + dateFormat()} </span>
                    <br />
                    In this plan we will offer you {props.featurePlans.length} major service access these are :
                    {
                        props.featurePlans.map(function (features) {
                            return features.ppm_subscription_plan_features[props.index].featureValue === "YES" ?
                                <li style={{ marginLeft: 10 }}>  {features.featureName} </li> :
                                <div></div>
                        })
                    }
                    <Button
                        onClick={() => props.openTheReferralModal()}
                        color="secondary"
                        variant="contained"
                        style={{ marginTop: 10 }}
                    >
                        Register
                    </Button>
                </div>
                <Dialog
                    fullScreen={fullScreen}
                    open={props.openLoginModal}
                    onClose={() => props.setOpenLoginModal(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {CalledModal(props.openLoginModal, setGeneratedOTP, setEmail, generatedOTP, props.setOpenLoginModal, props.body, props.setBody, loginEmail, setLoginEmail, email, password, setPassword, setLoginPassword, loginPassword)}
                </Dialog>
            </div>
        </div>
    </Dialog>
}