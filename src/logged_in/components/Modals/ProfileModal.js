import ShowChartIcon from '@material-ui/icons/ShowChart';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {
    withStyles,
    MenuItem,
    Dialog,
    useMediaQuery,
    TextField,
    Grid,
    FormControlLabel,
    Radio,
    Button,
    FormLabel
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";

import {postData} from "../../../service/service";

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

const error = {
    textAlign: "left",
    color: "red",
    opacity: "0.7",
    fontSize: "0.7rem",
    marginTop: 3
}

export default function ProfileModal() {

    const [open, setOpen] = useState(false);
    const [modalStyle] = useState(getModalStyle);

    // userDetails state variables
    const [userName, setUserName] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [whatsappNumber, setWhatsappNumber] = useState("");

    // modalErrors state variables
    const [userNameError, setUserNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [whatsappNumberError, setWhatsappNumberError] = useState(false);
    const [genderError, setGenderError] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    var dispatch = useDispatch();

    const user = useSelector(state => state.user)
    const userData = Object.values(user)[0];

    const handleOpenProfileModal = () => {
        setOpen(true);
        setUserName(userData.userName)
        setSelectedDate(userData.dob)
        setEmail(userData.email);
        setWhatsappNumber(userData.phone);
        setGender(userData.gender);
    }

    const handleUpdate = async () => {
        let err = false;
        if (userName.trim() === "") {
            err = true;
            setUserNameError("*name should be provided")
        }
        else {
            setUserNameError(null)
        }

        if (gender === "") {
            err = true;
            setGenderError("*gender should be provided")
        }
        else {
            setGenderError(null)
        }

        if (email.trim() === "") {
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
        const birthDate = new Date(selectedDate)
        const dob = birthDate.getDate() + "-" + (birthDate.getMonth() + 1) + "-" + birthDate.getFullYear();
        console.log(err);
        if (!err) {
            var form = { userName: userName, dob: dob, gender: gender, email: email, phone: whatsappNumber, id: userData.id };
            const response = await postData("user/updateUserProfile", form);

            if (response.success) {
                setOpen(false);
                let temporaryUserData = userData;
                temporaryUserData.email = email;
                temporaryUserData.userName = userName;
                temporaryUserData.dob = dob;
                temporaryUserData.gender = gender;
                temporaryUserData.phone = whatsappNumber;
                dispatch({ type: "DEL_USER", payload: [userData.email] })
                dispatch({ type: "ADD_USER", payload: [email, temporaryUserData] })
                Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: 'Your Profile updated successfully',
                })
            }
            else {
                if (!response.error.details) {
                    setOpen(false);
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

    return <>
        <StyledMenuItem onClick={handleOpenProfileModal}>
            <ListItemIcon>
                <ShowChartIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Profile" />
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
                    <Grid container >
                        <Grid item sm={6}>
                            <TextField
                                value={userName}
                                error={userNameError}
                                helperText={userNameError ? "*Your name is required" : ""}
                                onChange={(event) => setUserName(event.target.value)}
                                id="outlined-ba"
                                label="Name"
                                variant="outlined"
                                style={{ width: 300 }}
                            />
                        </Grid>
                        <Grid item sm={6}>
                            <MuiPickersUtilsProvider style={{ margin: 10 }} utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="dd/MM/yyyy"
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
                        </Grid>
                        <Grid item sm={12}>
                            <div style={{ width: "100%", display: "flex", justifyContent: "space-around", alignItems: "center", margin: "10px 0px" }}>
                                <FormLabel style={{ textAlign: "left", color: "black" }}>Gender</FormLabel>
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
                                <div style={error}>{genderError}</div>
                            </div>
                        </Grid>
                        <Grid item sm={6}>
                            <TextField
                                value={email}
                                error={emailError}
                                helperText={emailError}
                                onChange={(event) => { setEmail(event.target.value) }}
                                id="outlined-ba"
                                label="Email"
                                type="email"
                                variant="outlined"
                                style={{ width: 300 }}
                            />
                        </Grid>
                        <Grid item sm={6}>
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
                        </Grid>
                    </Grid>
                    <div>
                        <Button
                            color="secondary"
                            style={{ margin: 20, width: 300 }}
                            variant="contained"
                            onClick={handleUpdate}
                        >
                            Update
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    </>
}