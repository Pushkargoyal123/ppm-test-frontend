import React, { memo, useState, useCallback } from "react";
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
import { useHistory } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import Stock from "../stocks/Stock";
import CriticalAnalysis from "../stocks/CriticalAnalysis";
import {loggedIn_menuItems} from "../../../config"
import { useDispatch, useSelector } from "react-redux";

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
  scroll:{
    overflow:"scroll"
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

  const history = useHistory();
  var dispatch=useDispatch();
  const user=useSelector(state=>state.user);

  console.log(Object.values(user));

  if(!Object.values(user).length){
    history.replace({pathname:"/"});
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (page) => {
    setAnchorEl(null);
    if(page==="stocks")
      props.setComponent(<Stock setComponent={props.setComponent}/>)
    else if(page==="critical analysis")
       props.setComponent(<CriticalAnalysis setComponent={props.setComponent}/>)
    props.setUnderlinedButton("Stocks");
  };

  const handleMobileDrawerOpen = useCallback(() => {
    setIsMobileDrawerOpen(true);
  }, [setIsMobileDrawerOpen]);

  const handleMobileDrawerClose = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, [setIsMobileDrawerOpen]);

  const handleLogOut=()=>{
    const userEmail=Object.keys(user)[0]
    dispatch({type:"DEL_USER",payload:[userEmail ] })
    localStorage.removeItem("token");
    history.replace({pathname:"/"});
  }

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
              {loggedIn_menuItems.map(element => {
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
                else if(element.menus){
                   return (<>
                      <Button
                        color="secondary"
                        size="large"
                        onClick={handleClick}
                        key={element.link}
                        classes={{ text: classes.menuButtonText }}
                        style={props.underlinedButton===element.name ? {textDecoration:"underline"} : {}}
                      >
                        {element.name} &nbsp;
                        <i className="fas fa-caret-down"></i>
                      </Button>
                      <StyledMenu
                        id="customized-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={()=>setAnchorEl(null)}
                      >
                        <StyledMenuItem onClick={()=>handleSelect("stocks")}>
                          <ListItemIcon>
                            <SendIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Nifty Stocks" />
                        </StyledMenuItem>

                        <StyledMenuItem onClick={()=>handleSelect("critical analysis")}>
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
                      </StyledMenu></>
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
      <div>{props.component}</div>
      <NavigationDrawer
        menuItems={loggedIn_menuItems}
        anchor="right"
        open={isMobileDrawerOpen}
        selectedItem={selectedTab}
        onClose={handleMobileDrawerClose}
        setComponent={props.SetComponent}
        handleLogOut= {handleLogOut}
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
