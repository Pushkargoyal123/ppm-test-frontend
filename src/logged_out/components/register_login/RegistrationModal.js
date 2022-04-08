import React, {useState} from "react";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import DateFnsUtils from '@date-io/date-fns';
import { IconButton, Button, TextField } from '@material-ui/core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import { postData } from "../../../service/service";
import ToolTip from "../../../shared/components/ToolTip";

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

export default function RegistrationModal(props) {

    const [name, setName] = React.useState("");
    const [gender, setGender] = React.useState("");
    const [whatsappNumber, setWhatsappNumber] = React.useState("");
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [nameError, setNameError] = React.useState(false);
    const [genderError, setGenderError] = useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [whatsappNumberError, setWhatsappNumberError] = React.useState(false);
    const [selectedDateError, setSelectedDateError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [modalStyle] = React.useState(getModalStyle);

    const handleSubmit = async () => {
        let err = false;

        if (name.trim() === "") {
            err = true;
            setNameError("*name should be provided")
        }
        else {
            setNameError(null)
        }

        if (gender === "") {
            err = true;
            setGenderError("*gender should be provided")
        }
        else {
            setGenderError(null)
        }

        if (props.email.trim() === "") {
            err = true;
            setEmailError("*email should be provided")
        }
        else {
            setEmailError(null)
        }

        if (whatsappNumber.trim() === "") {
            err = true;
            setWhatsappNumberError("*Whatsapp number should be provided");
        }
        else {
            setWhatsappNumberError(null)
        }

        if (!selectedDate) {
            err = true;
            setSelectedDateError("*date of birth should be provided")
        }
        else {
            setSelectedDateError(null)
        }

        if (confirmPassword.trim() === "") {
            err = true;
            setConfirmPasswordError("*confirmPassowrd can not be blank");
        }
        else if (confirmPassword.trim() !== props.password.trim()) {
            err = true;
            setConfirmPasswordError("Password and Confirm Password are not matching");
        }
        else {
            setConfirmPasswordError(null);
        }

        if (props.password.trim() === "") {
            err = true;
            setPasswordError("*Password can't be empty");
        }
        else if (props.password.length < 8) {
            err = true;
            setPasswordError("*Password Length should be atleast 8 characters long");
        }
        else {
            setPasswordError(null);
        }

        const birthDate = new Date(selectedDate)
        const dob = birthDate.getDate() + "-" + (birthDate.getMonth() + 1) + "-" + birthDate.getFullYear();

        if (!err) {
            var form = { userName: name, dob: dob, gender: gender, email: props.email, phone: whatsappNumber, password: props.password };
            const response = await postData("user/registration", form);

            if (response.success) {
                props.setGeneratedOTP(response.OTP);
                props.setOpen(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Done',
                    text: 'Verify Your Account',
                }).then(
                    function () {
                        props.setOpen(true);
                        props.setBody(3)
                        props.setLoginEmail(props.email);
                        props.setLoginPassword(props.password);
                    })
            }
            else {
                if (response.error.errors) {
                    props.setOpen(false);
                    Swal.fire({
                        icon: 'info',
                        title: 'Already Sign Up',
                        text: "User Already Registered Login Now",
                    }).then(
                        function () {
                            props.setOpen(true);
                            props.setBody(1)
                            props.setLoginEmail(props.email);
                            props.setLoginPassword(props.password);
                        })
                }
                else if (!response.error.details) {
                    props.setOpen(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Server Error',
                        text: "Error from Server",
                    })
                }
                else {
                    toast.error('🦄 ' + response.error.details[0].message, {

                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        color: "red"
                    });
                }
            }
        }
    }
    return(
        <div style={modalStyle} >
        <div className="flexBox">
          <span></span>
          <div style={{ fontSize: "30px", fontWeight: 500 }}>Registration Page</div>
          <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => props.setOpen(false)} class="fas fa-times"></i>
        </div>
        <div style={{ margin: 10 }}>
          <TextField 
            value={name} 
            error={nameError} 
            helperText={nameError} 
            onChange={(event) => setName(event.target.value)} 
            id="outlined-basic" 
            placeholder="ex. Pushkar Goyal" 
            label="Name" 
            variant="outlined" 
            style={{ width: 300 }} 
          />
        </div>
  
        <FormControl style={{ width: 300 }} component="fieldset">
          <FormLabel style={{ textAlign: "left", color: genderError ? "red" : "grey" }} component="legend">Gender</FormLabel>
          <RadioGroup row aria-label="gender" name="row-radio-buttons-group">
            <FormControlLabel 
              onChange={(event) => { setGender(event.target.value) }} 
              value="female" 
              control={<Radio />} 
              label="Female" 
              checked={gender === "female"} 
            />
            <FormControlLabel 
              onChange={(event) => { setGender(event.target.value) }} 
              value="male" 
              control={<Radio />} 
              label="Male" 
              checked={gender === "male"} 
            />
          </RadioGroup>
          <div style={error}>{genderError}</div>
        </FormControl>
  
        <div style={{ margin: 10 }}>
          <TextField 
            value={props.email} 
            error={emailError} 
            helperText={emailError} 
            onChange={(event) => { props.setEmail(event.target.value) }} 
            placeholder="ex. pushkargoyal36@gmail.com" 
            id="outlined-ba" 
            label="Email" 
            type="email" 
            variant="outlined" 
            style={{ width: 300 }} 
          />
        </div>
        <div style={{ margin: 10 }}>
          <TextField 
            value={whatsappNumber} 
            error={whatsappNumberError} 
            helperText={whatsappNumberError} 
            onChange={(event) => { setWhatsappNumber(event.target.value) }} 
            placeholder="ex. 7024649556" 
            id="outlined-basi" 
            label="Whatsapp Number" 
            variant="outlined" 
            style={{ width: 300 }} 
          />
        </div>
  
        <MuiPickersUtilsProvider style={{ margin: 10 }} utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            error={selectedDateError}
            helperText={selectedDateError}
            id="date-picker-inline"
            label="Date of birth"
            value={selectedDate}
            style={{ width: 300 }}
            onChange={(date) => setSelectedDate(date)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        <FormControl style={{ width: 300 }}>
          <InputLabel style={{ color: passwordError ? "red" : null }}>Password</InputLabel>
          <Input
            id="standard-adornment-password"
            error={passwordError}
            type={showPassword ? 'text' : 'password'}
            onChange={(event) => { props.setPassword(event.target.value) }}
            value={props.password}
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
          <div style={error}>{passwordError}</div>
        </FormControl>
  
        <FormControl style={{ width: 300 }}>
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
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <div style={error}>{confirmPasswordError}</div>
        </FormControl>
  
        <ToolTip 
          title = "Open Login Page" 
          component = {()=><div onClick={() => props.setBody(1)} className="links" style={{ marginTop: 10 }}> Login now if already Registered ?</div>}
        />
        <div>
          <Button onClick={handleSubmit} color="secondary" style={{ margin: 10, width: 300 }} variant="contained">Submit</Button>
        </div>
      </div>
    )
} 