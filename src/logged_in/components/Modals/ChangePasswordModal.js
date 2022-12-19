// external dependecies
import { useState } from "react";
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel, Grid, useMediaQuery, Dialog } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Swal from "sweetalert2";

// internal dependecies
import { postData } from "../../../service/service";

function getModalStyle() {
    return {
        textAlign: "center",
        backgroundColor: "white",
        border: '2px solid grey',
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
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [oldPasswordError, setOldPasswordError] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleResetPassword = async () => {
        let err = false;

        if (oldPassword.trim() === "") {
            setOldPasswordError("*Please Provide us the old password");
            err = true
        }else if (oldPassword.length < 8) {
            err = true;
            setOldPasswordError("*Password length should be atleast 8 character long");
        }
        else {
            setOldPasswordError(false);
        }        

        if (newPassword.trim() === "") {
            setNewPasswordError("*Please Provide us the password");
            err = true
        } else if (newPassword.length < 8) {
            err = true;
            setNewPasswordError("*Password length should be atleast 8 character long");
        }
        else {
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
            const body = { oldPassword: oldPassword, newPassword: newPassword };
            const result = await postData("user/changeCurrentpassword", body);
            if (result.success) {
                props.setOpen(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Password Changed',
                    text: 'Password Successfully Changed',
                })
            }else{
                if(result.message === "Invalid password"){
                    setOldPasswordError('Invalid Old Password');
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'OOPS!!',
                        text: 'Something wrong happened!!',
                    })
                    props.setOpen(false);
                }
            }
        }
    }

    return <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{ maxWidth: 700, margin: "auto" }}
    >
        <div style={modalStyle} >
            <div className="flexBox">
                <span></span>
                <h2 id="simple-modal-title">CHANGE PASSWORD</h2>
                <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => props.setOpen(false)} class="fas fa-times"></i>
            </div>
            <Grid container>
                <Grid sm={12} style={{margin:10}}>
                    <FormControl style={{ width: 300 }} variant="outlined">
                        <InputLabel style={{ color: oldPasswordError ? "red" : null }}>Old Password</InputLabel>
                        <Input
                            id="standard-adornment-password"
                            type={showOldPassword ? 'text' : 'password'}
                            error={oldPasswordError}
                            value={oldPassword}
                            onChange={(event) => { setOldPassword(event.target.value) }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <div style={error}> {oldPasswordError}</div>
                    </FormControl>
                </Grid>
                <Grid sm={12} style={{margin:10}}>
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
                </Grid>
                <Grid sm={12} style={{margin:10}}>
                    <FormControl style={{ width: 300 }} variant="outlined">
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
                </Grid>
            </Grid>
            <div>
                <Button onClick={handleResetPassword} color="secondary" style={{ width: 300, marginBottom: 20 }} variant="contained">Change Now</Button>
            </div>
        </div>
    </Dialog>
}
