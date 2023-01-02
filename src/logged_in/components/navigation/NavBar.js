// external dependecies
import React, { memo, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Button,
  Hidden,
  IconButton,
  withStyles,
  Avatar
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NavigationDrawer from "../../../shared/components/NavigationDrawer";
import { useHistory } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

// internal dependecies
import Stock from "../stocks/Stock";
import CriticalAnalysis from "../stocks/CriticalAnalysis";
import ProfileModal from "../Modals/ProfileModal";
import ReferralModal from "../Modals/ReferralModal";
import UploadProfilePicModal from "../Modals/UploadProfilePicModal";
import ChangePasswordModal from "../Modals/ChangePasswordModal";
import { loggedIn_menuItems, ServerURL } from "../../../config"
import { postData } from "../../../service/service";
import WatchList from "../stocks/WatchList";
import GroupDropDown from "../GroupDropDown";

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
  scroll: {
    overflow: "scroll"
  }
});

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

function NavBar(props) {

  const {
    classes,
    selectedTab
  } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorProfile, setAnchorProfile] = useState(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [openProfilePicModal, setOpenProfilePicModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [image, setImage] = useState("");

  const history = useHistory();
  var dispatch = useDispatch();

  useEffect(function () {
    const userData = JSON.parse(localStorage.getItem("data"));
    if (userData) {
      fetchUserImage();
      setUser(userData);
      dispatch({ type: "ADD_USER", payload: [userData.email, userData] })
      const clickedEvent = JSON.parse(localStorage.getItem('clickedEvent'));
      if (clickedEvent) {
        sessionStorage.setItem("clickedEvent", JSON.stringify(clickedEvent));
        localStorage.removeItem('clickedEvent');
        Swal.fire(
          "Congratulations",
          `You have participated in ${clickedEvent.title} and now you can purchase these stocks to get the maximum prizes`,
          "success"
        )
        props.setComponent(<Stock
          setUnderlinedButton={props.setUnderlinedButton}
          setComponent={props.setComponent}
        />)
        props.setUnderlinedButton("Stock");
      }
    }else{
      history.replace('/')
    }
    // eslint-disable-next-line
  }, [dispatch])

  const fetchUserImage = async () => {
    const data = await postData('user/fetchUserImage', {});
    if (data.success) {
        setImage(data.data.profilePhoto);
    }
}

  const handleLogOut = async () => {
    const form = { email: user.email, UserId: user.id };
    await postData("user/userlogout", form);
    history.replace({ pathname: "/" });
    dispatch({ type: "DEL_USER", payload: [user.email] })
    localStorage.removeItem("token");
    localStorage.removeItem('data');
  } 

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClick = (event) => {
    setAnchorProfile(event.currentTarget);
  }

  const handleSelect = (page) => {
    setAnchorEl(null);
    if (page === "stocks")
      props.setComponent(<Stock setComponent={props.setComponent} setUnderlinedButton={props.setUnderlinedButton} />)
    else if (page === "critical analysis")
      props.setComponent(<CriticalAnalysis setComponent={props.setComponent} setUnderlinedButton={props.setUnderlinedButton} />)
    else if (page === "watch list")
      props.setComponent(<WatchList setComponent={props.setComponent} setUnderlinedButton={props.setUnderlinedButton} />)
    props.setUnderlinedButton("Stocks");
  };

  const handleMobileDrawerOpen = useCallback(() => {
    setIsMobileDrawerOpen(true);
  }, [setIsMobileDrawerOpen]);

  const handleMobileDrawerClose = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, [setIsMobileDrawerOpen]);

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div style={{ display: "flex" }}>
            <img style={{ width: "70px" }} src={`${process.env.PUBLIC_URL}/images/logged_out/pgr_logo.png`} alt="google map" />
            <GroupDropDown />
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
              {loggedIn_menuItems.map(element => {
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
                else if (element.menus) {
                  return (<>
                    <Button
                      color="secondary"
                      size="large"
                      onClick={handleClick}
                      key={element.link}
                      classes={{ text: classes.menuButtonText }}
                      style={props.underlinedButton === element.name ? { textDecoration: "underline" } : {}}
                    >
                      {element.name} &nbsp;
                      <i className="fas fa-caret-down"></i>
                    </Button>
                    <StyledMenu
                      id="customized-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                    >
                      <StyledMenuItem onClick={() => handleSelect("stocks")}>
                        <ListItemIcon>
                          <ShowChartIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Nifty Stocks" />
                      </StyledMenuItem>

                      <StyledMenuItem onClick={() => handleSelect("critical analysis")}>
                        <ListItemIcon>
                          <AssessmentIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Critical Analysis" />
                      </StyledMenuItem>

                      <StyledMenuItem onClick={() => handleSelect("watch list")}>
                        <ListItemIcon>
                          <PlaylistAddCheckIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Watch List" />
                      </StyledMenuItem>
                    </StyledMenu></>
                  );
                }
                else if (element.profile) {
                  return (<>
                    <button style={{ border: "none", verticalAlign:'middle' }}>
                      <Avatar
                        color="secondary"
                        size="large"
                        onClick={handleProfileClick}
                        // classes={{ text: classes.menuButtonText }}
                        style={{
                          textDecoration: props.underlinedButton === element.name ? "underline" : "",
                          textTransform: "uppercase",
                          cursor: "pointer"
                        }}
                        src={user ?  `${ServerURL}/images/${image}` : "/images/logged_in/samplePic.jpg"}
                      >
                      </Avatar>
                    </button>
                    <StyledMenu
                      id="customized-menu"
                      anchorEl={anchorProfile}
                      keepMounted
                      open={Boolean(anchorProfile)}
                      onClose={() => setAnchorProfile(null)}
                    >
                      <ProfileModal />

                      <StyledMenuItem onClick={() => setOpenProfilePicModal(true)}>
                        <ListItemIcon>
                          <PhotoLibraryIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Upload/Change Pic" />
                      </StyledMenuItem>

                      <ReferralModal />

                      <StyledMenuItem onClick={() => setOpenChangePasswordModal(true)}>
                        <ListItemIcon>
                          <LockOpenIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Change Password" />
                      </StyledMenuItem>

                      <hr />
                      <StyledMenuItem onClick={handleLogOut}>
                        <ListItemIcon>
                          <PlaylistAddCheckIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Log Out" />
                      </StyledMenuItem>
                    </StyledMenu>
                  </>
                  );
                }
                return (
                  <Button
                    key={element.link}
                    color="secondary"
                    size="large"
                    classes={{ text: classes.menuButtonText }}
                    onClick={handleLogOut}
                  >
                    {element.name}
                  </Button>
                );
              })}
            </Hidden>
          </div>
        </Toolbar>
      </AppBar>
      <div>
        {props.component}
      </div>
      <NavigationDrawer
        menuItems={loggedIn_menuItems}
        anchor="right"
        open={isMobileDrawerOpen}
        selectedItem={selectedTab}
        onClose={handleMobileDrawerClose}
        setComponent={props.SetComponent}
        handleLogOut={handleLogOut}
      />

      <UploadProfilePicModal
        open={openProfilePicModal}
        setOpen={setOpenProfilePicModal}
        fetchUserImage={fetchUserImage}
        image={image}
        setImage={setImage}
      />

      <ChangePasswordModal
        open={openChangePasswordModal}
        setOpen={setOpenChangePasswordModal}
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
  openRegisterDialog: PropTypes.func,
  openLoginDialog: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(memo(NavBar));
