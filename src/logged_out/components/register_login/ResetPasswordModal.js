import {useState} from "react";
import { Button , TextField} from '@material-ui/core';
import { getData } from "../../../service/service";
import Swal from "sweetalert2";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        position: 'absolute',
        minWidth: 500,
        maxWidth: 600,
        textAlign: "center",
        backgroundColor: "white",
        border: '2px solid grey',
        boxShadow: "0 0 8px 2px black",
        borderRadius: 20,
        maxHeight: "100vh",
        overflowX: "scroll",
    };
}

export default function ResetPasswordModal(props) {

    const [modalStyle] = useState(getModalStyle);
    const [resetEmail, setResetEmail] = useState("");
    const [resetEmailError, setResetEmailError] = useState(false);

    const handleResetPassword = async()=>{
        let err = false;
        if(resetEmail.trim() === ""){
            setResetEmailError(true);
            err= true
        }
        if(!err){
            const result = await getData("user/resetpasswordmail/"+resetEmail);
            props.setOpen(false);
            if(result){
                Swal.fire({
                    icon: 'success',
                    // title: 'Verified',
                    text: 'Thank you for request, Forgot password link will be send on your registered Email-Id ' + resetEmail + ' within 24 hours.',
                })
            }
        }
    }

    return <div style={modalStyle} >
        <div className="flexBox">
            <span></span>
            <h2 id="simple-modal-title">RESET PASSWORD</h2>
            <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => props.setOpen(false)} class="fas fa-times"></i>
        </div>
        <div style={{ margin: 20 }}>
            <TextField 
                value={resetEmail} 
                error={resetEmailError} 
                helperText={ resetEmailError ? "*Email must be provided" : ""} 
                onChange={(event) => { setResetEmail(event.target.value) }} 
                placeholder="Enter Your registered email-Id" 
                id="outlined-ba" 
                label="Enter Your registered email-Id" 
                type="email" 
                variant="outlined" 
                style={{ width: 350 }} 
            />
        </div>
        <div><Button onClick={handleResetPassword} color="secondary" style={{ margin: 20, width: 400 }} variant="contained">Reset Now</Button></div>
    </div>

}
