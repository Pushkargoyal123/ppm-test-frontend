import classNames from "classnames";
import { Grid, Box, makeStyles } from "@material-ui/core";

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
}))

export default function ContactUs() {
    const classes = useStyles();

    return (
        <Box
            className={classNames("lg-p-top", classes.wrapper)}
            display="flex"
            justifyContent="center"
        >
            <div className={classes.blogContentWrapper}>
                <div style={{ minHeight: 250, minWidth: "60%", boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px", marginBottom: 50 }}>
                    <Grid style={{ padding: "20px" }} container>
                        <Grid style={{ fontSize: 22,marginBottom:20 }} item sm={6}>
                            <span style={{ fontSize: 30, color: "green", marginBottom: 15 }}>PGR-Delhi Office Address</span>
                            <div>Praedico Global Research.Pvt.Ltd Udyog Vihar, Phase 4,</div>
                            <div>Gurgaon-122015</div>
                            <div> <i class="fas fa-phone"></i>  +91-9009054508, +91-9999703728</div>
                            <div> <i class="fas fa-envelope"></i> admin@priyankgupta.co.in</div>
                            <div> <i class="fas fa-envelope"></i> services@praedicoglobalresearch.com</div>
                        </Grid>
                        <Grid item sm={6}>
                            <img style={{ width: "100%", height:250 }} src={`${process.env.PUBLIC_URL}/images/logged_out/googlemap.jpg`} alt="google map" />
                        </Grid>
                    </Grid>
                </div>
                <div style={{ minHeight: 250, minWidth: "65%", boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px", marginTop: 50 }}>
                    <Grid style={{ padding: "20px" }} container>
                        <Grid style={{ fontSize: 22,marginBottom:20 }} item sm={6}>
                            <div style={{ fontSize: 30, color: "green", marginBottom: 15 }}>PGR-Delhi Office Address</div>
                            <div>First Floor, Garima Arcade,</div>
                            <div>Gwalior-474001</div>
                            <div> <i class="fas fa-phone"></i> +91-9009054508, +91-9999703728</div>
                            <div> <i class="fas fa-envelope"></i> admin@priyankgupta.co.in</div>
                            <div> <i class="fas fa-envelope"></i> services@praedicoglobalresearch.com</div>
                        </Grid>
                        <Grid item sm={6}>
                            <img style={{ width: "100%", height:250 }} src={`${process.env.PUBLIC_URL}/images/logged_out/googlemap.jpg`} alt="google map" />
                        </Grid>
                    </Grid>
                </div>
            </div>
        </Box>)
}
