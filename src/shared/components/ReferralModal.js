import { Dialog, useMediaQuery, Button, TextField } from "@material-ui/core"
import { useTheme } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { useState } from "react";
import Snackbar from '@material-ui/core/Snackbar';

import { postData } from "../../service/service";

const error = {
    textAlign: "left",
    color: "red",
    opacity: "0.7",
    fontSize: "0.7rem",
    marginTop: 3,
}

export default function ReferralModal(props) {

    const [isShow, setIsShow] = useState(false);
    const [referralId, setReferralId] = useState("");
    const [open, setOpen] = useState(false);
    const [isCongratulate, setIsCongratulate] = useState(false);
    const [referralError, setReferralError] = useState("");

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleReferral = async () => {
        const body = {
            email: referralId,
            planChargeId: props.planChargeId
        }
        const data = await postData("referral/getReferral", body);
        console.log(data);
        if (data.success) {
            setOpen(true)
            setIsShow(false)
            props.setReferToDiscount(data.referToDiscount);
            props.setReferToFinalPrice(data.referToFinalPrice)
            props.setReferByDiscount(data.referByDiscount);
            props.setReferByFinalPrice(data.referByFinalPrice);
            setIsCongratulate(true);
        }
        else if (data.error.details) {
            setReferralError(data.error.details[0].message);
        }
        else {
            setReferralError(data.error)
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return <>
        <Dialog
            fullScreen={fullScreen}
            open={props.openReferralModal}
            onClose={() => props.setOpenReferralModal(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            style={{ maxWidth: 600, margin: "auto" }}
        >
            <div style={props.modalStyle}>
                <div className="flexBox">
                    <span></span>
                    <h2 id="simple-modal-title">Referral Modal</h2>
                    <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => props.setOpenReferralModal(false)} class="fas fa-times"></i>
                </div>
                {
                    !isCongratulate ?
                        <Alert style={{ cursor: "pointer" }} onClick={() => setIsShow(true)} severity="info">
                            <AlertTitle>  Enter Referral Id for getting extra discount </AlertTitle>
                        </Alert>
                        :
                        <Alert style={{ cursor: "pointer" }} onClick={() => setIsShow(true)} severity="success">
                            <AlertTitle> Congratulations You got a discount of {props.referToDiscount}% and you need to pay only ₹{props.referToFinalPrice} </AlertTitle>
                        </Alert>
                }
                {
                    isShow ?
                        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <div>
                                <TextField
                                    id="standard-basic"
                                    label="Referral Id"
                                    placeholder="e.g. pushkaroyal36@gmail.com"
                                    value={referralId}
                                    onChange={(event) => setReferralId(event.target.value)}
                                />
                                <div style={error}>{referralError}</div>
                            </div>
                            <Button
                                color="secondary"
                                variant="contained"
                                style={{ marginTop: 10 }}
                                onClick={handleReferral}
                            >
                                Apply
                            </Button>
                        </div> :
                        <div></div>
                }
                <br />
                <Button
                    onClick={() => props.openPayModal()}
                    color="secondary"
                    variant="contained"
                    style={{ marginTop: 10 }}
                >
                    Pay ₹{props.referToFinalPrice}
                </Button>
            </div>
        </Dialog>

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
                Congratulations You got an extra discount
            </Alert>
        </Snackbar>
    </>
}