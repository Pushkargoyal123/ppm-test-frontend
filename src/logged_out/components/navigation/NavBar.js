import React, { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Button,
  Hidden,
  IconButton,
  withStyles,
  useMediaQuery,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NavigationDrawer from "../../../shared/components/NavigationDrawer";
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router-dom';
import { getData } from "../../../service/service";
import { useTheme } from '@material-ui/core/styles';
import 'react-toastify/dist/ReactToastify.css';
import { loggedOut_menuItems } from "../../../config"
import LoginModal from "../register_login/LoginModal";
import RegistrationModal from "../register_login/RegistrationModal";
import ResetPasswordModal from "../register_login/ResetPasswordModal";
import ChangePasswordModal from "../register_login/ChangePasswordModal";
import VerifyModal from "../register_login/VerifyModal";

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
  error: {
    textAlign: "left",
    color: "red",
    opacity: "0.7",
    fontSize: "0.7rem"
  }
});

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

function NavBar(props) {

  const {
    classes,
    handleMobileDrawerOpen,
    handleMobileDrawerClose,
    mobileDrawerOpen,
    selectedTab
  } = props;

  const history = useHistory();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [body, setBody] = React.useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(function () {
    const isVerify = async () => {
      const isMail = history.location.pathname.split("/")
      const verify = isMail[isMail.length - 2];
      if (verify === "true") {
        const userEmail = isMail[isMail.length - 1]
        const result = await getData("/user/fetchuserverificationdetails?email=" + userEmail);
        if (result.success && result.data) {
          setGeneratedOTP(result.data.verificationOtp)
          setBody(3);
          setOpen(true)
          setEmail(userEmail);
        }
      }
      else if (verify === "false") {
        setBody(5);
        setOpen(true);
      }
    }
    isVerify();
  }, [history])

  const fetchCertificate = (
    <div style={modalStyle}>
      <div className="flexBox">
        <span></span>
        <h2 id="simple-modal-title">Fetch Certificate</h2>
        <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => setOpenModal(false)} class="fas fa-times"></i>
      </div>
      <div style={{ margin: 20 }}><TextField autoComplete="off" onChange={(event) => { setSerialNumber(event.target.value) }} placeholder="ex. 12345678" id="outlined-ba" label="Serial Number" variant="outlined" style={{ width: 350 }} /></div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Button onClick={() => alert("You entered " + serialNumber)} color="primary" style={{ margin: 20 }} variant="contained">Submit</Button>
        <Button onClick={() => setOpenModal(false)} color="primary" style={{ margin: 20 }} variant="contained">Cancil</Button>
      </div>
    </div>
  )

  const calledModal = () => {

    if (body === 1)
      return <LoginModal
        open={open}
        setOpen={setOpen}
        setBody={setBody}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        email={email}
        password={password}
        setPassword={setPassword}
        setLoginPassword={setLoginPassword}
        loginPassword={loginPassword}
      />
    else if (body === 2)
      return <RegistrationModal
        setGeneratedOTP={setGeneratedOTP}
        open={open}
        setOpen={setOpen}
        setBody={setBody}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        setEmail={setEmail}
        email={email}
        password={password}
        setPassword={setPassword}
        setLoginPassword={setLoginPassword}
        loginPassword={loginPassword}
      />
    else if (body === 3)
      return <VerifyModal
      open={open}
      setOpen={setOpen}
      setBody={setBody}
      loginEmail={loginEmail}
      setLoginEmail={setLoginEmail}
      email={email}
      password={password}
      setPassword={setPassword}
      setLoginPassword={setLoginPassword}
      loginPassword={loginPassword}
      setGeneratedOTP = {setGeneratedOTP}
      generatedOTP = {generatedOTP}
      />
    else if (body === 4)
      return <ResetPasswordModal
        open={open}
        setOpen={setOpen}
        setBody={setBody}
      />
    else if (body === 5)
      return <ChangePasswordModal
        open={open}
        setOpen={setOpen}
        setBody={setBody}
      />
  }

  const handleOpen = (name) => {
    if (name === "Login")
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
                      onClick={() => props.SetComponent(element.link, element)}
                      style={props.underlinedButton === element.name ? { textDecoration: "underline" } : {}}
                    >
                      {element.name}
                    </Button>
                  );
                }
                else if (element.modal) {
                  return (<span key={element.name}>
                    <Dialog
                      fullScreen= {fullScreen}
                      open={openModal}
                      onClose={() => setOpenModal(false)}
                      aria-labelledby="simple-modal-title"
                      aria-describedby="simple-modal-description"
                    >
                      {fetchCertificate}
                    </Dialog>
                    <Button
                      color="secondary"
                      size="large"
                      classes={{ text: classes.menuButtonText }}
                      onClick={() => setOpenModal(true)}
                      style={props.underlinedButton === element.name ? { textDecoration: "underline" } : {}}
                    >
                      {element.name}
                    </Button>
                  </span>);
                }
                return (<span key={element.name}>
                  <Dialog
                    fullScreen = {fullScreen}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    {calledModal()}
                  </Dialog>
                  <Button
                    color="secondary"
                    size="large"
                    onClick={() => handleOpen(element.name)}
                    classes={{ text: classes.menuButtonText }}
                    style={props.underlinedButton === element.name ? { textDecoration: "underline" } : {}}
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
      // handleLogin={handleLogin}
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
