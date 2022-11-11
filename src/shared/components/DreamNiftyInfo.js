// external dependecies
import { Button, Dialog, Typography } from "@material-ui/core";
import { useState } from "react";
import Parse from 'html-react-parser';
import { Line } from 'rc-progress';

function getModalStyle() {
    return {
        textAlign: "center",
        backgroundColor: "white",
        border: '2px solid grey',
        height: "100%",
    };
}

export default function DreamNiftyInfo(props) {

    const [modalStyle] = useState(getModalStyle);

    const handlePay = () => {
        props.openPayModal();
    }

    const callingRegisterModal = () => {
        props.setOpenLoginModal(true);
        props.setOpenDreamNiftyInfoModal(false)
    }

    return <Dialog
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{ maxWidth: 600, margin: "auto" }}
    >
        <div style={modalStyle} >
            <div className="flexBox">
                <span></span>
                <h2 id="simple-modal-title">{props.clickedEvent.title}</h2>
                <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => props.setOpen(false)} class="fas fa-times"></i>
            </div>

            {
                props.clickedEvent.startDate ?
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-around", margin: "0px 20px" }}>
                            <div>
                                <Typography style={{ fontSize: 14 }} gutterBottom>
                                    Prize Pool
                                </Typography>
                                <div style={{ fontWeight: 600, fontSize: 16 }}>₹{props.clickedEvent.totalRewardPrice}</div>
                            </div>
                            <div>
                                <Typography style={{ fontSize: 14 }} gutterBottom>
                                    Entry Fee
                                </Typography>
                                <div style={{ fontWeight: 600, fontSize: 16 }}>₹{props.clickedEvent.entryFee}</div>
                            </div>
                        </div>

                        <div style={{ color: "#4A4E4D", margin: "0px 10px", fontSize: 16 }}>
                            {props.clickedEvent.description ? Parse(props.clickedEvent.description) : ""}
                        </div>

                        <div style={{ marginTop: 15 }}>
                            <div style={{ textAlign: "center" }}>{(props.clickedEvent.ppm_dream_nifty_users.length) / props.clickedEvent.maxParticipant * 100}%</div>
                            <Line
                                percent={(props.clickedEvent.ppm_dream_nifty_users.length) / props.clickedEvent.maxParticipant * 100}
                                strokeWidth={4}
                                trailWidth={4}
                                strokeColor="green"
                            />
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-around" }}>
                            <div style={{ color: "orange" }}> {props.clickedEvent.maxParticipant - props.clickedEvent.ppm_dream_nifty_users.length} spots left</div>
                            <div style={{ color: "green" }}> {props.clickedEvent.maxParticipant} spots</div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-around" }}>
                            <div>
                                <Typography color="textSecondary" gutterBottom>
                                    Start Date
                                </Typography>
                                <div style={{ fontWeight: 600, fontSize: 16 }}>₹{props.clickedEvent.startDate.split("-").reverse().join("-")}</div>
                            </div>
                            <div>
                                <Typography color="textSecondary" gutterBottom>
                                    End Date
                                </Typography>
                                <div style={{ fontWeight: 600, fontSize: 16 }}>₹{props.clickedEvent.endDate.split("-").reverse().join("-")}</div>
                            </div>
                        </div>
                        {
                            props.userData ?
                                <Button color="secondary" variant="contained" onClick={handlePay}>Pay ₹{props.clickedEvent.entryFee}</Button>
                                :
                                <Button color="secondary" variant="contained" onClick={callingRegisterModal}>Register</Button>
                        }
                    </div> :
                    <div></div>
            }
        </div>
    </Dialog>
}