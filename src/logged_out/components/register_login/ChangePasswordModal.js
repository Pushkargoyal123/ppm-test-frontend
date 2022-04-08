import { useState } from "react";
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { postData } from "../../../service/service";
import Swal from "sweetalert2";
import { useHistory } from 'react-router-dom';

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

const error = {
    textAlign: "left",
    color: "red",
    opacity: "0.7",
    fontSize: "0.7rem"
}

export default function ChangePasswordModal(props) {

    const [modalStyle] = useState(getModalStyle);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const history = useHistory();

    const handleResetPassword = async () => {
        let err = false;
        if (newPassword.trim() === "") {
            setNewPasswordError("*Please Provide us the password");
            err = true
        }else if(newPassword.length < 8){
            err = true;
            setNewPasswordError("*Password length should be atleast 8 character long");
        }
        else{
            setNewPasswordError(false);
        }

        if (confirmPassword.trim() === "") {
            err = true;
            setConfirmPasswordError("*confirmPassowrd can not be blank");
        }
        else if (confirmPassword.trim() !== newPassword.trim()) {
            err = true;
            setConfirmPasswordError("Password and Confirm Password are not matching");
        }
        else {
            setConfirmPasswordError(false);
        }

        if (!err) {
            const isMail = history.location.pathname.split("/");
            const resetEmail = isMail[isMail.length - 1];
            const body = {email : resetEmail , password : newPassword};
            const result = await postData("user/changepassword", body);
            props.setOpen(false);
            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Changed',
                    text: 'Password Successfully Changed',
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
            <FormControl style={{ width: 300 }} variant="outlined">
                <InputLabel style={{ color: newPasswordError ? "red" : null }}>New Password</InputLabel>
                <Input
                    id="standard-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    error={newPasswordError}
                    value={newPassword}
                    onChange={(event) => { setNewPassword(event.target.value) }}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <div style={error}> {newPasswordError}</div>
            </FormControl>
            <FormControl style={{ width: 300, marginTop: 15 }}>
                <InputLabel style={{ color: confirmPasswordError ? "red" : null }}>Confirm Password</InputLabel>
                <Input
                    id="standard-adornment-password"
                    error={confirmPasswordError}
                    type={showConfirmPassword ? 'text' : 'password'}
                    onChange={(event) => { setConfirmPassword(event.target.value) }}
                    value={confirmPassword}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
                  <div style={error}> {confirmPasswordError} </div>
            </FormControl>
        </div>
        <div>
            <Button onClick={handleResetPassword} color="secondary" style={{ width: 300, marginBottom: 20 }} variant="contained">Reset Now</Button>
        </div>
    </div>

}
