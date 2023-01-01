// external dependecies
import { Dialog, Grid, Button, useMediaQuery } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useTheme } from '@material-ui/core/styles';
import Swal from "sweetalert2";

// internal dependecies
import { postData, postDataAndImage } from "../../../service/service";
import {ServerURL} from '../../../config';

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
    const [picture, setPicture] = useState({ fileName: "", bytes: "" });
    const [image, setImage] = useState('');

    useEffect(function () {
        fetchUserImage();
    }, [props.open])

    const fetchUserImage = async () => {
        const data = await postData('user/fetchUserImage', {});
        if (data.success) {
            setImage(data.data.profilePhoto);
        }
    }

    function handlePicture(event) {
        if (event.target.files[0]) {
            setPicture({
                fileName: URL.createObjectURL(event.target.files[0]),
                bytes: event.target.files[0]
            });
        }
    }

    const uploadPicture = async () => {
        var formData = new FormData();
        formData.append("fileName", picture.fileName);
        formData.append("profilePhoto", picture.bytes);
        const data = await postDataAndImage('user/uploadPicture', formData);
        props.setOpen(false);
        if (data.success) {
            Swal.fire({
                title: 'success',
                text: 'Profile Pic uploaded successfully',
                icon: 'success'
            })
        } else {
            Swal.fire({
                title: 'error',
                text: 'OOPS! something went wrong',
                icon: 'error'
            })
        }
    }

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
                        <img src={image && image !== '' ?
                            picture.fileName && picture.fileName !== '' ?
                                picture.fileName :
                                `${ServerURL}/images/${image}` :
                            "/images/logged_in/samplePic.jpg"
                        }
                            alt="sample-profile-pic"
                            height='250'
                        />
                    </Grid>
                    <Grid item sm={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="icon-button-file"
                            type="file"
                            onChange={handlePicture}
                        />
                        <label htmlFor="icon-button-file">
                            <Button color="primary" variant="contained" component="span">
                                Upload
                            </Button>
                        </label>
                        <div style={{ marginTop: 20 }}>
                            <Button
                                color="secondary"
                                disabled={picture.fileName !== '' ? false : true}
                                variant="contained"
                                onClick={uploadPicture}
                            >
                                Submit
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    </Dialog>
}