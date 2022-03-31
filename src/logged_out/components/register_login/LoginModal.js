import React, { useState } from "react";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Modal from '@material-ui/core/Modal';
import Swal from "sweetalert2";
import { postData } from "../../../service/service";
import { useHistory } from 'react-router-dom';
import { useDispatch } from "react-redux";

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
        // overflowY: "scroll",
    };
}
export default function LoginModal(props) {

    const [loginEmailError, setLoginEmailError] = useState(false);
    const [loginPasswordError, setLoginPasswordError] = useState(false);
    const [modalStyle] = React.useState(getModalStyle);
    const [showPassword, setShowPassword] = React.useState(false);

    var dispatch = useDispatch();
    const history = useHistory();

    const handleLogin = async () => {

        let err = false;

        if (props.loginEmail.trim() === "") {
            err = true;
            setLoginEmailError(true)
        }
        else {
            setLoginEmailError(false)
        }

        if (props.loginPassword.trim() === "") {
            err = true;
            setLoginPasswordError(true)
        }
        else {
            setLoginPasswordError(false)
        }
        if (!err) {

            let form = { email: props.loginEmail, password: props.loginPassword };
            const data = await postData("user/login", form);

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Login Successfully',
                })
                dispatch({ type: "ADD_USER", payload: [props.loginEmail, data.data] })
                localStorage.setItem("token", data.data.token);
                history.replace({ pathname: "/c/dashboard" }, { data });
            }
            else {
                props.setOpen(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.message,
                })
            }
        }
    }

    return (
        <Modal
            open={props.open}
            onClose={() => props.setOpen(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div style={modalStyle} >
                <div className="flexBox">
                    <span></span>
                    <h2 id="simple-modal-title">Login Page</h2>
                    <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => props.setOpen(false)} class="fas fa-times"></i>
                </div>
                <div style={{ margin: 20 }}>
                    <TextField value={props.loginEmail} error={loginEmailError} helperText={loginEmailError ? "*Email should be required" : ""} onChange={(event) => { props.setLoginEmail(event.target.value) }} placeholder="ex. pushkargoyal36@gmail.com" id="outlined-ba" label="Email" type="email" variant="outlined" style={{ width: 350 }} />
                </div>
                <FormControl style={{ width: 350 }} variant="outlined">
                    <InputLabel >Password</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        error={loginPasswordError}
                        value={props.loginPassword}
                        onChange={(event) => { props.setLoginPassword(event.target.value) }}
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
                    {loginPasswordError ? <div style={{ color: "red", fontWeight: "600" }}> *Password should be provided </div> : <div></div>}
                </FormControl>
                {
                    props.setBody ?
                    <div onClick={() => props.setBody(2)} className="links" style={{ marginTop: 10 }}> Register now if not ?</div> :
                    <div></div>
                }
                <div onClick = {()=> props.setBody(4)} className="links">Forgot Password ? </div>
                <div><Button onClick={handleLogin} color="secondary" style={{ margin: 20, width: 400 }} variant="contained">Login</Button></div>
            </div>
        </Modal>
    );
}