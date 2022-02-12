import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  withStyles,
  Button,
  IconButton,
  Typography,
  withWidth,
  isWidthUp,
  Toolbar
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
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
import Menu from '@material-ui/core/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import MenuItem from '@material-ui/core/MenuItem';
import Swal from "sweetalert2";
import { useHistory } from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {postData} from "../../service/service";
import { useDispatch } from "react-redux";

const styles = theme => ({
  closeIcon: {
    marginRight: theme.spacing(0.5)
  },
  headSection: {
    width: 200
  },
  blackList: {
    backgroundColor: theme.palette.common.black,
    height: "100%"
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
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
     position: 'absolute',
        minWidth: 400,
        textAlign:"center",
        backgroundColor: "white",
        border: '2px solid grey',
        boxShadow: "0 0 8px 2px black",
        borderRadius:20,
        maxHeight:"100vh",
        overflow:"scroll",
        padding:20
  };
}

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);


function NavigationDrawer(props) {
  const {
    width,
    open,
    onClose,
    anchor,
    classes,
    menuItems,
    selectedItem,
    theme
  } = props;

     const [modalStyle] = React.useState(getModalStyle);
  const [open1, setOpen] = React.useState(false);
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
    const [loginPassword, setLoginPassword]= React.useState("");
     const [anchorEl, setAnchorEl] = React.useState(null);
     const [openModal, setOpenModal]= React.useState(false);
     const [serialNumber, setSerialNumber]= React.useState("");
      const [nameError, setNameError]= React.useState(false);
    const [genderError, setGenderError]= useState(false);
    const [emailError, setEmailError]= React.useState(false);
    const [whatsappNumberError, setWhatsappNumberError]= React.useState(false);
    const [selectedDateError, setSelectedDateError]= useState(false);
    const [passwordError, setPasswordError]= useState(false);
    const [confirmPasswordError, setConfirmPasswordError]= useState(false);
    const [loginEmailError, setLoginEmailError]= useState(false);
  const [loginPasswordError, setLoginPasswordError]= useState(false);
    const [body, setBody]= React.useState( false)

  const history = useHistory();

  useEffect(() => {
    window.onresize = () => {
      if (isWidthUp("sm", width) && open) {
        onClose();
      }
    };
  }, [width, open, onClose]);

  var dispatch=useDispatch()

   const handleSubmit=async()=>{
            let err=false;

            if(name.trim()===""){
              err=true;
              setNameError(true)
            }
            else{
              setNameError(false)
            }

            if(email.trim()===""){
              err=true;
              setEmailError(true)
            }
            else{
              setEmailError(false)
            }

              if(whatsappNumber.trim()===""){
              err=true;
              setWhatsappNumberError(true)
            }
            else{
              setWhatsappNumberError(false)
            }

            if(!selectedDate){
              err=true;
              setSelectedDateError(true)
            }
            else{
              setSelectedDateError(false)
            }
            if(password.trim()===""){
              err=true;
              setPasswordError(true)
            }
            else{
              setPasswordError(false)
            }

            if(password.trim()!== confirmPassword.trim() || confirmPassword.trim()===""){
              err=true;
              setConfirmPasswordError(true)
            }
            else{
              setConfirmPasswordError(false)
            }

            if(gender===""){
              err=true;
              setGenderError(true)
            }
            else{
              setGenderError(false)
            }

            if(!err){
              var form = { userName: name,dob:selectedDate, gender: gender,email:email,phone:whatsappNumber, password:password };
              const response = await postData("user/registration", form);
            if (response.success) {
                setOpen(false);
                props.onClose();
                Swal.fire({
                  icon: 'success',
                  title: 'Registration Done',
                  text: 'Login now',
                }).then(function(){
                  setOpen(true);
                  setBody(true);
                  setLoginEmail(email);
                  setLoginPassword(password);
                })
              }
              else{
                if(response.error.errors){
                  setOpen(false);
                  props.onClose();
                   Swal.fire({
                    icon: 'info',
                    title: 'Already Sign Up',
                    text: "User Already Registered Login Now",
                  }).then(function(){
                    props.onOpen();
                    setOpen(true);
                    setBody(true);
                    setLoginEmail(email);
                    setLoginPassword(password);
                  })
                }
                else if(!response.error.details){
                  setOpen(false);
                  props.onClose();
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
       
        props.onClose();
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

     const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (name,element) => {
    setAnchorEl(null);
    if(name==="stocks")
      props.setComponent("stock", element);
    else if(name==="critical analysis")
      props.setComponent("critical analysis", element);
    props.onClose();
  };

  const body1 = (
    <div style={modalStyle}>
      <div className="flexBox">
        <span></span>
        <div style={{fontSize:"30px", fontWeight:500}}>Registration Page</div>
        <i style={{fontSize:25, cursor:"pointer"}} onClick={()=>setOpen(false)} class="fas fa-times"></i>
      </div>
       <div style={{ margin: 10 }}>
        <TextField value={name} error={nameError} helperText={nameError ? "*Name Should be Provided": ""}  onChange={(event) => setName(event.target.value)} id="outlined-basic" placeholder="ex. Pushkar Goyal" label="Name" variant="outlined" style={{ width: "100%" }} />
      </div>
        
          <FormControl style={{ width: "100%" }} component="fieldset">
                <FormLabel style={{ textAlign: "left", color: genderError ? "red": "grey" }} component="legend">Gender</FormLabel>
                <RadioGroup row aria-label="gender"  name="row-radio-buttons-group">
                    <FormControlLabel onChange={(event) => { setGender(event.target.value) }} value="female" control={<Radio />} label="Female" checked={gender==="female"}/>
                    <FormControlLabel onChange={(event) => { setGender(event.target.value) }} value="male" control={<Radio />} label="Male" checked={gender==="male"}/>
                </RadioGroup>
                {genderError ? <div className={classes.error}> *Gender Should be Provided</div> : <div></div>}
            </FormControl>

            <div style={{ margin: 10 }}>
              <TextField value={email} error={emailError} helperText={emailError ? "*Email should be provided" : ""} onChange={(event) => { setEmail(event.target.value) }} placeholder="ex. pushkargoyal36@gmail.com" id="outlined-ba" label="Email" type="email" variant="outlined" style={{ width: "100%" }} />
            </div>
             <div style={{ margin: 10 }}>
              <TextField value={whatsappNumber} error={whatsappNumberError} helperText={whatsappNumberError ? "*Whatsapp Number should be provided" : ""} onChange={(event) => { setWhatsappNumber(event.target.value) }} placeholder="ex. 7024649556" id="outlined-basi" label="Whatsapp Number" variant="outlined" style={{ width: "100%" }} />
            </div>

              <MuiPickersUtilsProvider style={{margin:10}} utils={DateFnsUtils}>
             <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          error={selectedDateError}
          helperText={selectedDateError ? "*Date Of Birth Should be Provided" :"date format MM/DD/YYYY"}
          id="date-picker-inline"
          label="Date of birth"
          value={selectedDate}
          style={{width:"100%"}}
          onChange={(date)=>setSelectedDate(date)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </MuiPickersUtilsProvider>
               <FormControl style={{width: "100%"}}>
          <InputLabel >Password</InputLabel>
          <Input
            id="standard-adornment-password"
            value={password}
            error={passwordError}
            type={showPassword ? 'text' : 'password'}
            onChange={(event)=>{setPassword(event.target.value)}}
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
          {passwordError ? <div className={classes.error}> *Password should be provided </div> :<div></div>}
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
          {confirmPasswordError ? <div className={classes.error}> *Password and confirm Password are not matching </div> :<div></div>}
        </FormControl>
        
          <div onClick={()=>setBody(true)} className="links" style={{marginTop:10}}> Login now if already Registered ?</div>
    
            <div><Button onClick={handleSubmit} color="secondary" style={{ margin: "10px 0", width: "100%" }} variant="contained">Submit</Button></div>
    </div>
  );

 const body2 = (
    <div style={modalStyle} >
      <div className="flexBox">
        <span></span>
        <h2 id="simple-modal-title">Login Page</h2>
        <i style={{fontSize:25, cursor:"pointer"}} onClick={()=>setOpen(false)} class="fas fa-times"></i>
      </div>
        <div>
          <TextField value={loginEmail} error={loginEmailError} helperText={loginEmailError ? "*Email should be required" : ""} onChange={(event) => { setLoginEmail(event.target.value) }} placeholder="ex. pushkargoyal36@gmail.com" id="outlined-ba" label="Email" type="email" variant="outlined" style={{ width: "100%" }} />
        </div>
        <FormControl style={{width:"100%", margin:"20px 0"}} variant="outlined">
          <InputLabel >Password</InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={loginPassword}
            error={loginPasswordError}
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
           <div onClick={()=>setBody(false)} className="links" style={{marginTop:10}}> Register now if not ?</div>
          <div className="links">Forgot Password ? </div>
         <div><Button onClick={handleLogin} color="secondary" style={{width: "100%", margin: "20px 0" }} variant="contained">Login</Button></div>
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
          <Button onClick={()=>setOpenModal(false)} color="primary" style={{ margin: 20 }} variant="contained">Cancel</Button>
        </div>
      </div>
      )

  const handleOpen = (name) => {
    if(name==="Login")
      setBody(true);
    else
      setBody(false)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (<>
    <Drawer variant="temporary" open={open} onClose={onClose} anchor={anchor}>
      <Toolbar className={classes.headSection}>
        <ListItem
          style={{
            paddingTop: theme.spacing(0),
            paddingBottom: theme.spacing(0),
            height: "100%",
            justifyContent: anchor === "left" ? "flex-start" : "flex-end"
          }}
          disableGutters
        >
          <ListItemIcon className={classes.closeIcon}>
            <IconButton onClick={onClose} aria-label="Close Navigation">
              <CloseIcon color="primary" />
            </IconButton>
          </ListItemIcon>
        </ListItem>
      </Toolbar>
      <List className={classes.blackList}>
        {menuItems.map( (element, index) => {
          if (element.link) {
            return (
                <ListItem
                  key={index}
                  button
                  selected={selectedItem === element.name}
                  onClick={()=>{props.setComponent(element.link, element); props.onClose();}}
                  disableRipple
                  disableTouchRipple
                >
                  <ListItemIcon>{element.icon}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" className="text-white">
                        {element.name}
                      </Typography>
                    }
                  />
                </ListItem>
            );
          }
           else if(element.menus){
                   return (<div key={index}>
                      <ListItem
                        button
                        selected={selectedItem === element.name}
                        onClick={(event)=>{handleClick(event)}}
                        disableRipple
                        disableTouchRipple
                      >
                        <ListItemIcon>{element.icon}</ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" className="text-white">
                              {element.name}
                            </Typography>
                          }
                        />
                </ListItem>
                      <StyledMenu
                        id="customized-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={()=>setAnchorEl(null)}
                      >
                        <StyledMenuItem onClick={()=>handleSelect("stocks",element)}>
                          <ListItemIcon>
                            <SendIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Nifty Stocks" />
                        </StyledMenuItem>

                        <StyledMenuItem onClick={()=>handleSelect("critical analysis",element)}>
                          <ListItemIcon>
                            <DraftsIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Critical Analysis" />
                        </StyledMenuItem>
                        
                        <StyledMenuItem>
                          <ListItemIcon>
                            <InboxIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Inbox" />
                        </StyledMenuItem>
                      </StyledMenu></div>
                  );
                }
                  else if (element.button) {
                  return (
                      <ListItem
                      key={index}
                        button
                        selected={selectedItem === element.name}
                        onClick={()=>props.handleLogOut()}
                        disableRipple
                        disableTouchRipple
                      >
                        <ListItemIcon>{element.icon}</ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" className="text-white">
                              {element.name}
                            </Typography>
                          }
                        />
                      </ListItem> 
                  );
                }
                  else if(element.modal){
                  return(

                  <span key={element.name}>
                   <Modal
                    open={openModal}
                    onClose={()=>setOpenModal(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    {body3}
                  </Modal>
                  <ListItem
                        button
                        selected={selectedItem === element.name}
                        onClick={()=>setOpenModal(true)}
                        disableRipple
                        disableTouchRipple
                      >
                        <ListItemIcon>{element.icon}</ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" className="text-white">
                              {element.name}
                            </Typography>
                          }
                        />
                      </ListItem> 
                    </span>);
                }
          return (<span key={element.name}>
            <Modal
                    open={open1}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    {body? body2 : body1}
                  </Modal>
            <ListItem button onClick={()=>handleOpen(element.name)}>
              <ListItemIcon>{element.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" className="text-white">
                    {element.name}
                  </Typography>
                }
              />
            </ListItem>
          </span>);
        })}
      </List>
    </Drawer>
    </>
  );
}

NavigationDrawer.propTypes = {
  anchor: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  selectedItem: PropTypes.string
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(NavigationDrawer)
);
