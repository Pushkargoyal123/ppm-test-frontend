import { useState } from "react";
import { Button, TextField } from '@material-ui/core';
import { toast } from 'react-toastify';
import { postData } from "../../../service/service";
import Swal from "sweetalert2";

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

export default function VerifyModal(props) {

    const [modalStyle] = useState(getModalStyle);
    const [inputOTP, setInputOTP] = useState("");

    const changeVerify = async (body) => {
        const result = await postData("user/changeVerify", body);
        if (result.success) {
            props.setOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'Verified',
                text: 'Account Successfully Verified',
            }).then(
                function () {
                    props.setOpen(true);
                    props.setBody(1)
                    props.setLoginEmail(props.email);
                    props.setLoginPassword(props.password);
                })
        }
        else {
            toast.error('🦄 ' + result.error, {
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

    const handleVerifyOTP = () => {
        if (props.generatedOTP !== inputOTP) {
            toast.error("🦄 Verification OTP are not matching", {
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
        else {
            const body = { email: props.email }
            changeVerify(body);
        }
    }

    return <div style={modalStyle}>
        <div className="flexBox">
            <span></span>
            <h2 id="simple-modal-title">We have sent a mail to <span style={{ color: "blue" }}>{props.email}</span> Enter the OTP in the mail</h2>
        </div>
        <div style={{ margin: 20 }}>
            <TextField
                onChange={(event) => { setInputOTP(event.target.value) }}
                value={inputOTP}
                placeholder="ex. 123456"
                label="OTP"
                variant="outlined"
                style={{ width: 300 }}
            />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
                onClick={() => handleVerifyOTP()}
                color="secondary"
                style={{ margin: 20 }}
                variant="contained">
                Submit
            </Button>
        </div>
    </div>
}
