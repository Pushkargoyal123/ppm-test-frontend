import {useState} from "react";
import { Button , TextField} from '@material-ui/core';
import { getData, postData } from "../../../service/service";
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
                const form = {email : resetEmail};
                await postData("user/updateresestpasswordrequest", form);
                Swal.fire({
                    icon: 'success',
                    // title: 'Verified',
                    text: 'Thank you for request, Forgot password link will be send on your registered Email-Id ' + resetEmail + ' within 24 hours.',
                })
            }else{
                Swal.fire({
                    icon: 'error',
                    title: "Record doesn't exist",
                    text: "Sorry we dont't have any record with this mail Id  '"+ resetEmail+ "'",
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
                style={{ width: 300 }} 
            />
        </div>
        <div>   
            <Button onClick={handleResetPassword} color="secondary" style={{ margin: 20, width: 300 }} variant="contained">Reset Now</Button>
        </div>
    </div>

}
