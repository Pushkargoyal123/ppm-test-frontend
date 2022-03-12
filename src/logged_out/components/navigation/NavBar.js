import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Button,
  Hidden,
  IconButton,
  withStyles
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NavigationDrawer from "../../../shared/components/NavigationDrawer";
import Modal from '@material-ui/core/Modal';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useHistory } from 'react-router-dom';
import Swal from "sweetalert2";
import {postData} from "../../../service/service";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {loggedOut_menuItems} from "../../../config"
import { useDispatch } from "react-redux";

const styles = theme => ({
  appBar: {
    boxShadow: theme.shadows[6],
    backgroundColor: theme.palette.common.white
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between"
  },
  menuButtonText: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.h6.fontWeight
  },
  brandText: {
    fontFamily: "'Baloo Bhaijaan', cursive",
    fontWeight: 400
  },
  noDecoration: {
    textDecoration: "none !important"
  },
  error :{
    textAlign:"left", 
    color:"red", 
    opacity:"0.7", 
    fontSize:"0.7rem"
  }
});

function getModalStyle() {
  const top =50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
     position: 'absolute',
        minWidth: 500,
        maxWidth:600,
        textAlign:"center",
        backgroundColor: "white",
        border: '2px solid grey',
        boxShadow: "0 0 8px 2px black",
        borderRadius:20,
        maxHeight:"100vh",
        overflowX:"scroll",
  };
}

function NavBar(props) {

  const {
    classes,
    handleMobileDrawerOpen,
    handleMobileDrawerClose,
    mobileDrawerOpen,
    selectedTab
  } = props;

  const history = useHistory();

  const [name, setName] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loginEmail, setLoginEmail] = React.useState("");
  const [whatsappNumber, setWhatsappNumber] = React.useState("");
  const [password, setPassword]= React.useState("");
  const [confirmPassword, setConfirmPassword]= useState("");
  const [showPassword, setShowPassword]= React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword]= useState(false);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [loginPassword, setLoginPassword]= useState("");
  const [serialNumber, setSerialNumber]= useState("");
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal]= React.useState(false);
  const [body, setBody]= React.useState(false);
  const [nameError, setNameError]= React.useState(false);
  const [genderError, setGenderError]= useState(false);
  const [emailError, setEmailError]= React.useState(false);
  const [whatsappNumberError, setWhatsappNumberError]= React.useState(false);
  const [selectedDateError, setSelectedDateError]= useState(false);
  const [passwordError, setPasswordError]= useState(false);
  const [confirmPasswordError, setConfirmPasswordError]= useState(false);
  const [loginEmailError, setLoginEmailError]= useState(false);
  const [loginPasswordError, setLoginPasswordError]= useState(false);

  var dispatch=useDispatch()

      const handleSubmit=async()=>{
            let err=false;

            if(name.trim()===""){
              err=true;
              setNameError("*name should be provided")
            }
            else{
              setNameError(null)
            }

              if(gender===""){
              err=true;
              setGenderError("*gender should be provided")
            }
            else{
              setGenderError(null)
            }

            if(email.trim()===""){
              err=true;
              setEmailError("*email should be provided")
            }
            else{
              setEmailError(null)
            }

              if(whatsappNumber.trim()===""){
              err=true;
              setWhatsappNumberError("*Whatsapp number should be provided");
            }
            else{
              setWhatsappNumberError(null)
            }

            if(!selectedDate){
              err=true;
              setSelectedDateError("*date of birth should be provided")
            }
            else{
              setSelectedDateError(null)
            }

             if(confirmPassword.trim() === ""){
              err=true;
              setConfirmPasswordError("*confirmPassowrd can not be blank");
            }
            else if(confirmPassword.trim()!== password.trim()){
              err=true;
              setConfirmPasswordError("Password and Confirm Password are not matching");
            }
            else{
              setConfirmPasswordError(null);
            }

            if(password.trim()===""){
              err=true;
              setPasswordError("*Password can't be empty");
            }
            else if(password.length < 8){
              err=true;
              setPasswordError("*Password Length should be atleast 8 characters long");
            }
            else{
              setPasswordError(null);
            }

            const birthDate= new Date(selectedDate)
            const dob= birthDate.getDate()+"-"+birthDate.getMonth()+"-"+birthDate.getFullYear();

            if(!err){
              var form = { userName: name,dob:dob, gender: gender,email:email,phone:whatsappNumber, password:password };
              const response = await postData("user/registration", form);
    
              if (response.success) {
                setOpen(false);
                Swal.fire({
                  icon: 'success',
                  title: 'Registration Done',
                  text: 'Verify Your Account',
                }).then(
                  function(){
                    setOpen(true);
                    setBody(3)
                    setLoginEmail(email);
                    setLoginPassword(password);
                  })
              }
              else{
                if(response.error.errors){
                  setOpen(false);
                   Swal.fire({
                    icon: 'info',
                    title: 'Already Sign Up',
                    text: "User Already Registered Login Now",
                  }).then(
                    function(){
                      setOpen(true);
                      setBody(3)
                      setLoginEmail(email);
                      setLoginPassword(password);
                    })
                }
                else if(!response.error.details){
                  setOpen(false);
                   Swal.fire({
                    icon: 'error',
                    title: 'Server Error',
                    text: "Error from Server",
                  })
                }
                else{
                  toast.error('🦄 '+  response.error.details[0].message ,{

                     position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: true,
                      closeOnClick: false,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      color:"red"
                    });
                  }
              }
            }
  }

    const handleLogin=async()=>{

        let err=false;

            if(loginEmail.trim()===""){
              err=true;
              setLoginEmailError(true)
            }
            else{
              setLoginEmailError(false)
            }

            if(loginPassword.trim()===""){
              err=true;
              setLoginPasswordError(true)
            }
            else{
              setLoginPasswordError(false)
            }
      if(!err){

        let form= {email:loginEmail, password: loginPassword};
         const data= await postData("user/login", form);
       
        if(data.success){
           Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Login Successfully',
            })
          dispatch({type:"ADD_USER",payload:[loginEmail, data.data ] })
          localStorage.setItem("token", data.data.token);
          history.replace({pathname:"/c/dashboard"},{data});
        }
        else{
          setOpen(false);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.message,
          })
        }
      }
    }

    const registrationModal = (
    <div style={modalStyle} >
      <div className="flexBox">
        <span></span>
        <div style={{fontSize:"30px", fontWeight:500}}>Registration Page</div>
        <i style={{fontSize:25, cursor:"pointer"}} onClick={()=>setOpen(false)} class="fas fa-times"></i>
      </div>
       <div style={{ margin: 10 }}>
        <TextField value={name} error={nameError} helperText={nameError}  onChange={(event) => setName(event.target.value)} id="outlined-basic" placeholder="ex. Pushkar Goyal" label="Name" variant="outlined" style={{ width: 350 }} />
      </div>
        
          <FormControl style={{ width: 350 }} component="fieldset">
                <FormLabel style={{ textAlign: "left", color: genderError ? "red": "grey" }} component="legend">Gender</FormLabel>
                <RadioGroup row aria-label="gender"  name="row-radio-buttons-group">
                    <FormControlLabel onChange={(event) => { setGender(event.target.value) }} value="female" control={<Radio />} label="Female" checked={gender==="female"} />
                    <FormControlLabel onChange={(event) => { setGender(event.target.value) }} value="male" control={<Radio />} label="Male" checked={gender==="male"}/>
                </RadioGroup>
                <div className={classes.error}>{genderError}</div>
            </FormControl>

            <div style={{ margin: 10 }}>
              <TextField value={email} error={emailError} helperText={emailError} onChange={(event) => { setEmail(event.target.value) }} placeholder="ex. pushkargoyal36@gmail.com" id="outlined-ba" label="Email" type="email" variant="outlined" style={{ width: 350 }} />
            </div>
             <div style={{ margin: 10 }}>
              <TextField value={whatsappNumber} error={whatsappNumberError} helperText={whatsappNumberError} onChange={(event) => { setWhatsappNumber(event.target.value) }} placeholder="ex. 7024649556" id="outlined-basi" label="Whatsapp Number" variant="outlined" style={{ width: 350 }} />
            </div>

              <MuiPickersUtilsProvider style={{margin:10}} utils={DateFnsUtils}>
             <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          error={selectedDateError}
          helperText={selectedDateError}
          id="date-picker-inline"
          label="Date of birth"
          value={selectedDate}
          style={{width:350}}
          onChange={(date)=>setSelectedDate(date)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </MuiPickersUtilsProvider>
               <FormControl style={{width:350}}>
          <InputLabel style={{color: passwordError ? "red" : null}}>Password</InputLabel>
          <Input
            id="standard-adornment-password"
            error={passwordError}
            type={showPassword ? 'text' : 'password'}
            onChange={(event)=>{setPassword(event.target.value)}}
            value={password}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={()=>setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        <div className={classes.error}>{passwordError}</div>
        </FormControl>

         <FormControl style={{width:350}}>
          <InputLabel style={{color: confirmPasswordError ? "red" : null}}>Confirm Password</InputLabel>
          <Input
            id="standard-adornment-password"
            error={confirmPasswordError}
            type={showConfirmPassword ? 'text' : 'password'}
            onChange={(event)=>{setConfirmPassword(event.target.value)}}
            value={confirmPassword}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={()=>setShowConfirmPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <div className={classes.error}>{confirmPasswordError}</div>
        </FormControl>

        <div onClick={()=>setBody(1)} className="links" style={{marginTop:10}}> Login now if already Registered ?</div>
            <div><Button onClick={handleSubmit} color="secondary" style={{ margin: 10, width: 350 }} variant="contained">Submit</Button></div>
    </div>
  );

  const verifymodal =(
    <div style={modalStyle}>
      <div style={{textAlign: "right", padding: 20}}> <i style={{fontSize:25, cursor:"pointer"}} onClick={()=>setOpenModal(false)} class="fas fa-times"></i></div>
      <div className="flexBox">
        <span></span>
        <h2 id="simple-modal-title">We have sent a mail to { email } Enter the OTP in the mail</h2>
      </div>
      <div style={{ margin: 20 }}><TextField autoComplete="off" onChange={(event) => { setSerialNumber(event.target.value) }} placeholder="ex. 12345678" id="outlined-ba" label="Serial Number" variant="outlined" style={{ width: 350 }} /></div>
      <div style={{display:"flex", justifyContent:"space-around"}}>
        <Button onClick={()=>alert("You entered "+serialNumber)} color="primary" style={{ margin: 20 }} variant="contained">Submit</Button>
        <Button onClick={()=>setOpenModal(false)} color="primary" style={{ margin: 20 }} variant="contained">Cancil</Button>
      </div>
    </div>
    )

    const loginModal = (
    <div style={modalStyle} >
      <div className="flexBox">
        <span></span>
        <h2 id="simple-modal-title">Login Page</h2>
        <i style={{fontSize:25, cursor:"pointer"}} onClick={()=>setOpen(false)} class="fas fa-times"></i>
      </div>
        <div style={{ margin: 20 }}>
          <TextField value={loginEmail} error={loginEmailError} helperText={loginEmailError ? "*Email should be required" : ""} onChange={(event) => { setLoginEmail(event.target.value) }} placeholder="ex. pushkargoyal36@gmail.com" id="outlined-ba" label="Email" type="email" variant="outlined" style={{ width: 350 }} />
        </div>
        <FormControl style={{width:350}} variant="outlined">
          <InputLabel >Password</InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            error={loginPasswordError}
            value={loginPassword}
            onChange={(event)=>{setLoginPassword(event.target.value)}}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={()=>setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {loginPasswordError ? <div className={classes.error}> *Password should be provided </div> :<div></div>}
        </FormControl>
          <div onClick={()=>setBody(2)} className="links" style={{marginTop:10}}> Register now if not ?</div>
          <div className="links">Forgot Password ? </div>
         <div><Button onClick={handleLogin} color="secondary" style={{ margin: 20, width: 400 }} variant="contained">Login</Button></div>
    </div>
  );

    const body3 =(
      <div style={modalStyle}>
        <div className="flexBox">
          <span></span>
          <h2 id="simple-modal-title">Fetch Certificate</h2>
           <i style={{fontSize:25, cursor:"pointer"}} onClick={()=>setOpenModal(false)} class="fas fa-times"></i>
        </div>
        <div style={{ margin: 20 }}><TextField autoComplete="off" onChange={(event) => { setSerialNumber(event.target.value) }} placeholder="ex. 12345678" id="outlined-ba" label="Serial Number" variant="outlined" style={{ width: 350 }} /></div>
        <div style={{display:"flex", justifyContent:"space-around"}}>
          <Button onClick={()=>alert("You entered "+serialNumber)} color="primary" style={{ margin: 20 }} variant="contained">Submit</Button>
          <Button onClick={()=>setOpenModal(false)} color="primary" style={{ margin: 20 }} variant="contained">Cancil</Button>
        </div>
      </div>
      )

  const handleOpen = (name) => {
    if(name==="Login")
      setBody(1);
    else
      setBody(2)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div>
            <img style={{ width: "70px" }} src={`${process.env.PUBLIC_URL}/images/logged_out/pgr_logo.png`} alt="google map" />
          </div>
          <div>
            <Hidden mdUp>
              <IconButton
                className={classes.menuButton}
                onClick={handleMobileDrawerOpen}
                aria-label="Open Navigation"
              >
                <MenuIcon color="primary" />
              </IconButton>
            </Hidden>
            <Hidden smDown>
              {loggedOut_menuItems.map(element => {
                if (element.link) {
                  return (
                      <Button
                        key={element.link}
                        color="secondary"
                        size="large"
                        classes={{ text: classes.menuButtonText }}
                        onClick={()=>props.SetComponent(element.link, element)}
                        style={props.underlinedButton===element.name ? {textDecoration:"underline"} : {}}
                      >
                        {element.name}
                      </Button>
                  );
                }
                else if(element.modal){
                  return(<span key={element.name}>
                   <Modal
                    open={openModal}
                    onClose={()=>setOpenModal(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    {body3}
                  </Modal>
                  <Button
                        color="secondary"
                        size="large"
                        classes={{ text: classes.menuButtonText }}
                        onClick={()=>setOpenModal(true)}
                        style={props.underlinedButton===element.name ? {textDecoration:"underline"} : {}}
                      >
                        {element.name}
                    </Button>
                    </span>);
                }
                return (<span key={element.name}>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    {body === 1 ? loginModal : body === 2 ? registrationModal : verifymodal}
                  </Modal>
                  <Button
                    color="secondary"
                    size="large"
                    onClick={()=>handleOpen(element.name)}
                    classes={{ text: classes.menuButtonText }}
                    style={props.underlinedButton===element.name ? {textDecoration:"underline"} : {}}
                  >
                    {element.name}
                  </Button>
                  </span>
                );
              })}
            </Hidden>
          </div>
        </Toolbar>
      </AppBar>
      {props.component}
      <NavigationDrawer
        menuItems={loggedOut_menuItems}
        anchor="right"
        onOpen={handleMobileDrawerOpen}
        open={mobileDrawerOpen}
        selectedItem={selectedTab}
        onClose={handleMobileDrawerClose}
        setComponent={props.SetComponent}
        handleLogin={handleLogin}
      />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
    </div>
  );
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  handleMobileDrawerOpen: PropTypes.func,
  handleMobileDrawerClose: PropTypes.func,
  mobileDrawerOpen: PropTypes.bool,
  selectedTab: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(memo(NavBar));
