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
  Toolbar,
  Avatar
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Menu from '@material-ui/core/Menu';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import AssessmentIcon from '@material-ui/icons/Assessment';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import MenuItem from '@material-ui/core/MenuItem';
import { useHistory } from 'react-router-dom';
import { getData } from "../../service/service";
import CalledModal from "../../service/CalledModal";
import ProfileModal from "../../logged_in/components/Modals/ProfileModal";

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
  error: {
    textAlign: "left",
    color: "red",
    opacity: "0.7",
    fontSize: "0.7rem"
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
    textAlign: "center",
    backgroundColor: "white",
    border: '2px solid grey',
    boxShadow: "0 0 8px 2px black",
    borderRadius: 20,
    maxHeight: "100vh",
    overflow: "scroll",
    padding: 20
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
    theme,
    onOpen,
  } = props;

  const [modalStyle] = React.useState(getModalStyle);
  const [open1, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [loginEmail, setLoginEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorProfile, setAnchorProfile] = useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [serialNumber, setSerialNumber] = React.useState("");
  const [body, setBody] = React.useState(false)
  const [generatedOTP, setGeneratedOTP] = useState("");

  const history = useHistory();


  useEffect(() => {
    const isVerify = async () => {
      const isMail = history.location.pathname.split("/")
      const verify = isMail[isMail.length - 2];
      if (verify === "true") {
        const userEmail = isMail[isMail.length - 1]
        const result = await getData("/user/fetchuserverificationdetails?email=" + userEmail);
        if (result.success && result.data) {
          setGeneratedOTP(result.data.verificationOtp)
          setOpen(true)
          setBody(3);
          setEmail(userEmail);
          // onOpen();
        }
      }
      else if (verify === "false") {
        setOpen(true);
        setBody(5);
        // onOpen()
      }
    }
    isVerify();
  }, [history, onOpen])

  useEffect(() => {
    window.onresize = () => {
      if (isWidthUp("sm", width) && open) {
        onClose();
      }
    };
  }, [width, open, onClose]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (name, element) => {
    setAnchorEl(null);
    if (name === "stocks")
      props.setComponent("stock", element);
    else if (name === "critical analysis")
      props.setComponent("critical analysis", element);
    else if (name === "watch list")
      props.setComponent("watch list", element);
    props.onClose();
  };

  const body3 = (
    <div style={modalStyle}>
      <div className="flexBox">
        <span></span>
        <h2 id="simple-modal-title">Fetch Certificate</h2>
        <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => setOpenModal(false)} class="fas fa-times"></i>
      </div>
      <div style={{ margin: 20 }}><TextField autoComplete="off" onChange={(event) => { setSerialNumber(event.target.value) }} placeholder="ex. 12345678" id="outlined-ba" label="Serial Number" variant="outlined" style={{ width: 350 }} /></div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Button onClick={() => alert("You entered " + serialNumber)} color="primary" style={{ margin: 20 }} variant="contained">Submit</Button>
        <Button onClick={() => setOpenModal(false)} color="primary" style={{ margin: 20 }} variant="contained">Cancel</Button>
      </div>
    </div>
  )

  const handleOpen = (name) => {
    if (name === "Login")
      setBody(1);
    else if (name === "Register")
      setBody(2)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleProfileClick = (event) => {
    setAnchorProfile(event.currentTarget);
  }

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
        {menuItems.map((element, index) => {
          if (element.link) {
            return (
              <ListItem
                key={index}
                button
                selected={selectedItem === element.name}
                onClick={() => { props.setComponent(element.link, element); props.onClose(); }}
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
          else if (element.menus) {
            return (<div key={index}>
              <ListItem
                button
                selected={selectedItem === element.name}
                onClick={(event) => { handleClick(event) }}
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
                onClose={() => setAnchorEl(null)}
              >
                <StyledMenuItem onClick={() => handleSelect("stocks", element)}>
                  <ListItemIcon>
                    <SendIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Nifty Stocks" />
                </StyledMenuItem>

                <StyledMenuItem onClick={() => handleSelect("critical analysis", element)}>
                  <ListItemIcon>
                    <DraftsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Critical Analysis" />
                </StyledMenuItem>

                <StyledMenuItem onClick={() => handleSelect("watch list", element)}>
                  <ListItemIcon>
                    <PlaylistAddCheckIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Watch List" />
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
                onClick={() => props.handleLogOut()}
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
          else if (element.modal) {
            return (

              <span key={element.name}>
                <Modal
                  open={openModal}
                  onClose={() => setOpenModal(false)}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  {body3}
                </Modal>
                <ListItem
                  button
                  selected={selectedItem === element.name}
                  onClick={() => setOpenModal(true)}
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
          else if (element.profile) {
            return (<>
            <button style={{border:"none"}}>
              <Avatar
                color="secondary"
                size="large"
                onClick={handleProfileClick}
                key={element.link}
                classes={{ text: classes.menuButtonText }}
                style={{
                  textDecoration: props.underlinedButton === element.name ? "underline" : "", 
                }}
              >
                H
              </Avatar>
              </button>
              <StyledMenu
                id="customized-menu"
                anchorEl={anchorProfile}
                keepMounted
                open={Boolean(anchorProfile)}
                onClose={() => setAnchorProfile(null)}
              >
                <ProfileModal/>

                <StyledMenuItem >
                  <ListItemIcon>
                    <AssessmentIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="My Referrals" />
                </StyledMenuItem>

                <StyledMenuItem onClick={props.handleLogOut}>
                  <ListItemIcon>
                    <PlaylistAddCheckIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Log Out" />
                </StyledMenuItem>
              </StyledMenu>
              </>
            );
          }
          return (<span key={element.name}>
            <Modal
              open={open1}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              {CalledModal(open, setGeneratedOTP, setEmail, generatedOTP, setOpen, body, setBody, loginEmail, setLoginEmail, email, password, setPassword, setLoginPassword, loginPassword)}
            </Modal>
            <ListItem button onClick={() => handleOpen(element.name)}>
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
