import {Dialog, ListItemIcon, ListItemText, MenuItem, useMediaQuery, withStyles} from "@material-ui/core";
import {Assessment} from "@material-ui/icons";
import { useState, useEffect } from 'react';
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


export default function ReferralModal() {

    const [open, setOpen] = useState(false);
    const [modalStyle] = useState(getModalStyle);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return <>
        <StyledMenuItem>
            <ListItemIcon>
                <Assessment fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="My Referrals" />
        </StyledMenuItem>
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            style={{ maxWidth: 700, margin: "auto" }}
        >
            <div style={modalStyle} >
                <div className="flexBox">
                    <span></span>
                    <h2 id="simple-modal-title">Profile</h2>
                    <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => setOpen(false)} class="fas fa-times"></i>
                </div>
                <div style={{ margin: "0 10px" }}>
                    
                </div>
            </div>
        </Dialog>
    </>
}