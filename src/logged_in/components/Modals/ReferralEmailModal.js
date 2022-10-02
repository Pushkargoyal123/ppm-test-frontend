import {
    Dialog,
    useMediaQuery,
    Button,
    TextField
} from "@material-ui/core";
import { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';

import {getData} from "../../../service/service"
import Swal from "sweetalert2";

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

export default function ReferralEmailModal(props) {

    const [modalStyle] = useState(getModalStyle);
    const [referralEmail, setReferralEmail] = useState("");
    const [referralEmailError, setReferralEmailError] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClose = () => {
        props.setOpen(false);
        props.setOpenReferralModal(true)
    }

    const handleSubmit = async() => {
        let err = false;
        if(referralEmail.trim() === ""){
            setReferralEmailError(true);
            err= true
        }
        if(!err){
            const result = await getData("referral/sendReferMail?email="+referralEmail);
            if(result.success){
                Swal.fire({
                    title: "email successfully send",
                    text : "The Referral process will complete when user registered through given url in the mail",
                    icon: "success"
                })
            }else{
                if(result.error.details){
                    Swal.fire({
                        title: "Invalid Email",
                        text : "email should be valid",
                        icon: "error"
                    }).then(function(){
                        props.setOpen(true);
                    })
                }else if(result.error.error){
                    Swal.fire({
                        title: "OOP's",
                        text : result.error.error,
                        icon: "error"
                    }).then(function(){
                        props.setOpen(true);
                    })
                }else{
                    Swal.fire({
                        title: "OOP's",
                        text : "Server Error",
                        icon: "error"
                    }).then(function(){
                        props.setOpen(true);
                    })
                }
            }
            props.setOpen(false);
        }
    }

    return <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={() => handleClose()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{ maxWidth: 700, margin: "auto" }}
    >
        <div style={modalStyle} >
            <div className="flexBox">
                <span></span>
                <h2 id="simple-modal-title">Referred Person Email</h2>
                <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => handleClose()} class="fas fa-times"></i>
            </div>

            <div style={{ margin: 20 }}>
                <TextField
                    value={referralEmail}
                    error={referralEmailError} 
                    helperText={ referralEmailError ? "*Email must be provided" : ""} 
                    onChange={(event) => { setReferralEmail(event.target.value) }}
                    id="outlined-ba"
                    label="Referral Email"
                    type="email"
                    variant="outlined"
                    style={{ width: 300 }}
                />
            </div>
            <div>
                <Button onClick={handleSubmit} color="secondary" style={{ margin: 20, width: 300 }} variant="contained">Refer Now</Button>
            </div>

        </div>
    </Dialog>
}