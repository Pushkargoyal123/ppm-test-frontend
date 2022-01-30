import classNames from "classnames";
import { Divider, Box, makeStyles } from "@material-ui/core";

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
        textAlign: "justify-all"
    },
    wrapper: {
        minHeight: "60vh",
    },
}))

export default function AboutUs() {
    const classes = useStyles();

    return (
        <Box
            className={classNames("lg-p-top", classes.wrapper)}
            display="flex"
            justifyContent="center"
        >
            <div className={classes.blogContentWrapper}>
                <div style={{ fontSize: 40, textAlign: "center" }}><u>About Us</u></div>
                <Divider style={{ margin: 20 }} />
                <div style={{ fontSize: 27, textAlign: "justify" }}>Praedico's Portfolio Manager is designed for those who wants to learn the portfolio management and funds management. It allows you to do the dummy trading without investing a single penny. Praedico's Portfolio Manager will also gives the advices on each stock along with dummy trading option. By practicing Praedico's Portfolio Manager user will get knowledge about good stocks so that they can make more and more profit while doing the live trading. Praedico’s portfolio manager allows you to learn the management of portfolio and funds. As portfolio management and funds management are the most upcoming hot job fields. One can learn the management of portfolio and funds without investing and losing a single money. Also our portfolio manager provides a leader board where others can know how to manage the effective portfolio with the help of the best one. In all aspects our portfolio manager gives you an extra skill in your hands segregating you from the herd.</div>
            </div>
        </Box>)
}
