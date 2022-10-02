import React, { useState, useEffect } from "react";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import { InputLabel, useMediaQuery, Dialog } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Swal from "sweetalert2";
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import { postData, getData } from "../../../service/service";
import { useHistory } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useTheme } from '@material-ui/core/styles';

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

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const error = {
    textAlign: "left",
    color: "red",
    opacity: "0.7",
    fontSize: "0.7rem",
    marginTop: 3,
}

export default function LoginModal(props) {

    useEffect(function () {
        fetchAllColleges()
    }, [])

    const [loginEmailError, setLoginEmailError] = useState(false);
    const [loginPasswordError, setLoginPasswordError] = useState(false);
    const [modalStyle] = React.useState(getModalStyle);
    const [showPassword, setShowPassword] = React.useState(false);
    const [loginWith, setLoginWith] = useState("");
    const [loginWithError, setLoginWithError] = useState(false);
    const [collegeList, setCollegeList] = useState([]);

    var dispatch = useDispatch();
    const history = useHistory();

    const classes = useStyles();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchAllColleges = async () => {
        const result = await getData("college/getAllCollegeNames");
        if (result.success) {
            setCollegeList(result.data);
        }
    }

    const handleLogin = async () => {

        let err = false;

        if (loginWith === "") {
            err = true;
            setLoginWithError("*Login with should be provided");
        }
        else {
            setLoginWithError(null)
        }

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

            let form = { registerType: loginWith, email: props.loginEmail, password: props.loginPassword };
            const data = await postData("user/login", form);

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Login Successfully',
                })
                dispatch({ type: "ADD_USER", payload: [props.loginEmail, data.data] })
                sessionStorage.removeItem("groupId")
                localStorage.setItem("token", data.data.token);
                sessionStorage.setItem("data", JSON.stringify(data.data));
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

    const handleSelectChange = (event) => {
        setLoginWith(event.target.value);
    }

    return (
        <Dialog
            fullScreen={fullScreen}
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
                <div style={{ margin: "0 10px" }}>
                    <FormControl style={{ width: 300, margin: 0 }} variant="outlined" className={classes.formControl}>
                        <InputLabel style={{ color: loginWithError ? "red" : null }} htmlFor="outlined-age-native-simple">Login With</InputLabel>
                        <Select
                            native
                            value={loginWith}
                            onChange={handleSelectChange}
                            label="Register With"
                            helperText={loginWithError}
                            error={loginWithError}
                            placeholder="Register With"
                            inputProps={{
                                name: 'Register With',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                            <option aria-label="None" value=""></option>
                            <option value="pgr">Praedico Global Research</option>
                            {
                                collegeList.map(function (item) {
                                    return <option key={item.shortName} value={item.shortName}>{item.name}</option>
                                })
                            }
                        </Select>
                        <div style={error}>{loginWithError}</div>
                    </FormControl>
                </div>

                <div style={{ margin: 20 }}>
                    <TextField
                        value={props.loginEmail}
                        error={loginEmailError}
                        helperText={loginEmailError ? "*Email should be required" : ""}
                        onChange={(event) => { props.setLoginEmail(event.target.value) }}
                        placeholder="ex. pushkargoyal36@gmail.com"
                        id="outlined-ba"
                        label="Email"
                        type="email"
                        variant="outlined"
                        style={{ width: 300 }}
                    />
                </div>
                <FormControl style={{ width: 300 }} variant="outlined">
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
                    {loginPasswordError ? <div style={error}> *Password should be provided </div> : <div></div>}
                </FormControl>
                {
                    props.setBody ?
                        <div onClick={() => props.setBody(2)} className="links" style={{ marginTop: 10 }}> Register now if not ?</div> :
                        <div></div>
                }
                <div onClick={() => props.setBody(4)} className="links">Forgot Password ? </div>
                <div>
                    <Button onClick={handleLogin} color="secondary" style={{ margin: 20, width: 300 }} variant="contained">Login</Button>
                </div>
            </div>
        </Dialog>
    );
}