// external Dependecies
import classNames from "classnames";
import { Divider, Box, makeStyles, Button, CircularProgress, Typography, CardActions, Card, CardContent, Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Line } from 'rc-progress';
import Parse from 'html-react-parser';
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

// internal Dependecies
import { postData } from "../../service/service";
import ViewPrizeDistribution from "./ViewPrizeDistribution";
import DreamNiftyInfo from "./DreamNiftyInfo";
import CalledModal from "../../service/CalledModal";

const useStyles = makeStyles((theme) => ({
    blogContentWrapper: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(4),
            marginRight: theme.spacing(4),
        },
        maxWidth: 1280,
        width: "100%",
    },
    wrapper: {
        minHeight: "60vh",
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
}))

const color = "#953163";

export default function DreamNifty(props) {
    const classes = useStyles();

    const [message, setMessage] = useState(false);
    const [eventList, setEventList] = useState([]);
    const [clickedEvent, setClickedEvent] = useState({});
    const [openPrizeDistribution, setOpenPrizeDistribution] = useState(false);
    const [openDreamNiftyInfoModal, setOpenDreamNiftyInfoModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [body, setBody] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [generatedOTP, setGeneratedOTP] = useState("");
    const [isMyEventsClicked, setIsMyEventsClicked] = useState(false);

    const user = useSelector(state => state.user)
    const userData = Object.values(user)[0];

    useEffect(function () {
        fetchAllEvents();
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, [])

    const options = {
        key: "rzp_test_GQ6XaPC6gMPNwH",
        amount: clickedEvent.entryFee * 100,
        name: "Praedico",
        description: "Stock Market",
        image: "/images/logged_out/pgr_logo.png",
        handler: async function (response) {

            // code for checking that the user participated in the event or not
            const body = {
                UserId: userData.id,
                ppmDreamNiftyId: clickedEvent.id,
                status: "active"
            }
            const data = await postData('dreamNifty/user/haveActiveEvent', body);
            if (data.success) {
                setOpenDreamNiftyInfoModal(false);
                Swal.fire({
                    icon: 'error',
                    title: 'OOPS!!',
                    text: `You are already present in this onGoing ${clickedEvent.title} that will ends on ${clickedEvent.endDate.split('-').reverse().join('-')}`,
                });
            } else {
                let body = {
                    UserId: userData.id,
                    ppmDreamNiftyId: clickedEvent.id,
                    virtualAmount: clickedEvent.virtualAmount,
                    netAmount: clickedEvent.virtualAmount
                }
                const data = await postData("dreamNifty/user/register", body);
                setOpenDreamNiftyInfoModal(false);
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: `Congratulations!! You are successfully registered to ${clickedEvent.title} that will ends on ${clickedEvent.endDate.split('-').reverse().join('-')}`,
                        text: "Now you can start buy or sell the stocks",
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'OOPS!!',
                        text: "Something went wrong",
                    }).then(function () {
                        setOpenDreamNiftyInfoModal(true);
                    })
                }
            }
        },
        prefill: {
            name: userData ? userData.userName : null,
            contact: userData ? userData.phone : null,
            email: userData ? userData.email : null,
        },
        notes: {
            address: "some address"
        },
        theme: {
            color: "blue",
            hide_topbar: false
        }
    }

    /**
     * function for fetching all events 
     */
    const fetchAllEvents = async () => {
        setIsMyEventsClicked(false);
        const data = await postData("dreamNifty/eventList", { status: "active" });
        if (data.success) {
            setMessage(2);
            const finalData = data.data.map(function (item) {
                item.readMore = false;
                return item;
            })
            setEventList(finalData);
        } else {
            setMessage(1);
        }
    }

    function getTodayDate() {
        let today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return yyyy + '-' + mm + '-' + dd;
    }

    /**
     * function to hide or show an event description
     * @param {to show or hide description} isReadMore 
     * @param { to get the index of event whose description need to hide or show } itemIndex 
     */
    const changeReadMore = (isReadMore, itemIndex) => {
        setEventList(
            eventList.map(function (item, index) {
                if (itemIndex === index) {
                    item.readMore = isReadMore;
                }
                return item;
            })
        )
    }

    /**
     * function to view prize distribution
     * @param {eventId to get prize distribution of  clicked event} eventId 
     */
    const showPrizeDistribution = async (row) => {
        setClickedEvent(row)
        setOpenPrizeDistribution(true);
    }

    const showMoneyToPay = async (row) => {
        if (userData) {
            setClickedEvent(row);
            // code for checking that the user participated in the event or not
            const body = {
                UserId: userData.id,
                ppmDreamNiftyId: row.id,
                status: "active"
            }
            const data = await postData('dreamNifty/user/haveActiveEvent', body);
            if (data.success) {
                setOpenDreamNiftyInfoModal(false);
                Swal.fire({
                    icon: 'error',
                    title: 'OOPS!!',
                    text: `You are already present in this onGoing ${row.title} that will ends on ${row.endDate.split('-').reverse().join('-')}`,
                });
            } else {
                setOpenDreamNiftyInfoModal(true);
            }
        } else {
            setClickedEvent(row);
            setOpenDreamNiftyInfoModal(true)
        }
    }

    const openPayModal = () => {
        var rzpl = new window.Razorpay(options);
        rzpl.open();
    }

    const handleMyEvents = async () => {
        setIsMyEventsClicked(true);
        const body = { status: "active", showMyEvents: true };
        const data = await postData("dreamNifty/eventList", body);
        if (data.success) {
            const finalData = data.data.map(function (item) {
                item.readMore = false;
                return item;
            })
            setEventList(finalData);
        }
    }

    const handleViewEvent = (row) => {
        window.open(window.location.href, '_blank');
        localStorage.setItem('clickedEvent', JSON.stringify(row));
        setClickedEvent(row);
    }

    return (<Box
        className={classNames("lg-p-top", classes.wrapper)}
        display="flex"
        justifyContent="center"
    >
        <div className={classes.blogContentWrapper + " animation-bottom-top"}>
            <div style={{ fontSize: 40, textAlign: "center" }}><u>DreamNifty</u></div>
            <Divider style={{ margin: 20 }} />
            {
                userData ?
                    <div style={{ textAlign: "center" }}>
                        <Button
                            color="secondary"
                            variant="contained"
                            style={{ margin: "0px 10px 15px 0px" }}
                            onClick={fetchAllEvents}
                        >All Events
                        </Button>
                        <Button
                            variant="contained"
                            style={{ margin: "0px 0px 15px 10px", background: color, color: "white" }}
                            onClick={handleMyEvents}
                        >My Events
                        </Button>
                    </div> :
                    <div></div>
            }

            {
                !message ? <div className="ParentFlex">
                    <CircularProgress color="secondary" className="preloader" />
                </div>
                    :
                    <Grid container>
                        {
                            eventList.length ?
                                eventList.map(function (item, index) {
                                    return <Grid key={index} item sm={4} style={{ margin: "auto", padding: 15, minWidth: 300 }}>
                                        <Card className="event-card">
                                            <CardContent>
                                                <Typography
                                                    style={{
                                                        textAlign: "center",
                                                        textTransform: "uppercase",
                                                        whiteSpace: "nowrap",
                                                        textDecoration: "underline",
                                                        height: 30,
                                                        width: 250,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis"
                                                    }}
                                                    variant="h5"
                                                    component="h2"
                                                >
                                                    {item.title}
                                                </Typography>
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <div>
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            Prize Pool
                                                        </Typography>
                                                        <div style={{ fontWeight: 600, fontSize: 16 }}>₹{item.totalRewardPrice}</div>
                                                    </div>
                                                    <div>
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            Entry Fee
                                                        </Typography>
                                                        <div style={{ fontWeight: 600, fontSize: 16 }}>₹{item.entryFee}</div>
                                                    </div>
                                                </div>
                                                <div style={{ marginTop: 15 }}>
                                                    <div style={{ textAlign: "center" }}>{(item.ppm_dream_nifty_users.length) / item.maxParticipant * 100}%</div>
                                                    <Line
                                                        percent={(item.ppm_dream_nifty_users.length) / item.maxParticipant * 100}
                                                        strokeWidth={4}
                                                        trailWidth={4}
                                                        strokeColor="green"
                                                    />
                                                </div>

                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <div style={{ color: "orange" }}> {item.maxParticipant - item.ppm_dream_nifty_users.length} spots left</div>
                                                    <div style={{ color: "green" }}> {item.maxParticipant} spots</div>
                                                </div>

                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <div>
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            Start Date
                                                        </Typography>
                                                        <div style={{ fontWeight: 600, fontSize: 16 }}>₹{item.startDate.split("-").reverse().join("-")}</div>
                                                    </div>
                                                    <div>
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            End Date
                                                        </Typography>
                                                        <div style={{ fontWeight: 600, fontSize: 16 }}>₹{item.endDate.split("-").reverse().join("-")}</div>
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <Button
                                                        style={{ marginTop: 10 }}
                                                        color="secondary"
                                                        variant="contained"
                                                        onClick={() => showPrizeDistribution(item)}
                                                    >
                                                        Prize Distribution
                                                    </Button>
                                                    {
                                                        isMyEventsClicked ?
                                                            <Button
                                                                style={{ marginTop: 10, background: "green", color: "white", marginLeft: "auto" }}
                                                                variant="contained"
                                                                onClick = {()=> handleViewEvent(item)}
                                                            >
                                                                View
                                                            </Button> :
                                                            getTodayDate() >= item.startDate && userData ? 
                                                                <div></div> :
                                                                <Button
                                                                    style={{ marginTop: 10, background: color, color: "white", marginLeft: "auto" }}
                                                                    variant="contained"
                                                                    onClick={() => showMoneyToPay(item)}
                                                                >
                                                                    Participate
                                                                </Button>
                                                    }
                                                </div>

                                            </CardContent>
                                            {
                                                !item.readMore ? <CardActions>
                                                    <Button size="small" onClick={() => changeReadMore(true, index)} style={{ color: "blue" }}> <u> Know More </u> </Button>
                                                </CardActions> :
                                                    <CardContent>
                                                        <div>
                                                            <span style={{ fontSize: 16 }}>
                                                                {Parse(item.description)}
                                                                <Button style={{ color: "blue", textDecoration: "underline" }} onClick={() => changeReadMore(false, index)}>...show less</Button>
                                                            </span>
                                                        </div>
                                                    </CardContent>
                                            }
                                        </Card>
                                    </Grid>
                                }) :
                                <div
                                    style={{
                                        minHeight: 200,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%",
                                        fontSize: 20
                                    }}>
                                    There is no event to show
                                </div>
                        }
                    </Grid>
            }
        </div>

        <ViewPrizeDistribution
            open={openPrizeDistribution}
            setOpen={setOpenPrizeDistribution}
            clickedEvent={clickedEvent}
        />

        <DreamNiftyInfo
            open={openDreamNiftyInfoModal}
            setOpen={setOpenDreamNiftyInfoModal}
            clickedEvent={clickedEvent}
            openPayModal={openPayModal}
            userData={userData}
            openLoginModal={openLoginModal}
            setOpenLoginModal={setOpenLoginModal}
            body={body}
            setBody={setBody}
            openDreamNiftyInfoModal={openDreamNiftyInfoModal}
            setOpenDreamNiftyInfoModal={setOpenDreamNiftyInfoModal}
        />

        {CalledModal(openLoginModal, setGeneratedOTP, setEmail, generatedOTP, setOpenLoginModal, body, setBody, loginEmail, setLoginEmail, email, password, setPassword, setLoginPassword, loginPassword)}
    </Box >)
}
