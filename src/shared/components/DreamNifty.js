// external Dependecies
import classNames from "classnames";
import { Divider, Box, makeStyles, Button, CircularProgress, Typography, CardActions, Card, CardContent, Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Line } from 'rc-progress';
import Parse from 'html-react-parser';

// internal Dependecies
import { postData } from "../../service/service";

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

export default function AboutUs() {
    const classes = useStyles();

    const [message, setMessage] = useState(false);
    const [eventList, setEventList] = useState([]);

    useEffect(function () {
        fetchAllEvents()
    }, [])

    /**
     * function for fetching all events 
     */
    const fetchAllEvents = async () => {
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

    return (<Box
        className={classNames("lg-p-top", classes.wrapper)}
        display="flex"
        justifyContent="center"
    >
        <div className={classes.blogContentWrapper}>
            <div style={{ fontSize: 40, textAlign: "center" }}><u>Dream Nifty</u></div>
            <Divider style={{ margin: 20 }} />
            {
                !message ? <div className="ParentFlex">
                    <CircularProgress color="secondary" className="preloader" />
                </div>
                    :
                    <Grid container spacing={5}>
                        {
                            eventList.map(function (item, index) {
                                return <Grid key={index} item sm={4} style={{ margin: "auto", minWidth: 300 }}>
                                    <Card className="event-card">
                                        <CardContent>
                                            <Typography style={{ textAlign: "center", textTransform: "uppercase", textDecoration: "underline" }} variant="h5" component="h2">
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
                                                <div style={{textAlign:"center"}}>{(item.ppm_dream_nifty_users.length) / item.maxParticipant * 100}%</div>
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
                                            <Button style={{ marginTop: 10 }} color="secondary" variant="contained">Prize Distribution</Button>
                                        </CardContent>
                                        {
                                            !item.readMore ? <CardActions>
                                                <Button size="small" onClick={() => changeReadMore(true, index)} style={{ color: "blue" }}> <u> Know More </u> </Button>
                                            </CardActions> :
                                                <CardContent>
                                                    <div>
                                                        <span style={{fontSize:16}}>
                                                            { Parse(item.description) } 
                                                            <Button style={{ color: "blue", textDecoration: "underline" }} onClick={() => changeReadMore(false, index)}>...show less</Button>
                                                        </span>
                                                    </div>
                                                </CardContent>
                                        }
                                    </Card>
                                </Grid>
                            })
                        }
                    </Grid>
            }
        </div>
    </Box >)
}
