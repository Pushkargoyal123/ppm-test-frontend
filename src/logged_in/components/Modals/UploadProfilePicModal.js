// external dependecies
import { Dialog, Grid, Button, useMediaQuery } from "@material-ui/core";
import { useState } from "react";
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

export default function UploadProfilePicModal(props) {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [modalStyle] = useState(getModalStyle);

    return <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{ maxWidth: 700, margin: "auto" }}
    >
        <div style={modalStyle} >
            <div className="flexBox">
                <span></span>
                <h2 id="simple-modal-title">Upload Image</h2>
                <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => props.setOpen(false)} class="fas fa-times"></i>
            </div>
            <div style={{ margin: "0 10px" }}>
                <Grid container>
                    <Grid item sm={6}>
                        <img src="/images/logged_in/samplePic.jpg" alt="sample-profile-pic" height='250' />
                    </Grid>
                    <Grid item sm={6}>
                        <input accept="image/*" style={{ display: 'none' }} id="icon-button-file" type="file" />
                        <label htmlFor="icon-button-file">
                            <Button variant="contained" color="secondary" component="span">
                                Upload
                            </Button>
                        </label>
                    </Grid>
                </Grid>
            </div>
        </div>
    </Dialog>
}