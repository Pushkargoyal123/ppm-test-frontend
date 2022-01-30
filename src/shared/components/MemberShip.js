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
    },
    wrapper: {
        minHeight: "60vh",
    },
}))

export default function MemberShip(){

	const classes = useStyles();

	return(  <Box
            className={classNames("lg-p-top", classes.wrapper)}
            display="flex"
            justifyContent="center"
        >
            <div className={classes.blogContentWrapper}>
                <div style={{ fontSize: 40, textAlign: "center" }}><u>MemberShip Levels</u></div>
                <Divider style={{ margin: 20 }} />
                MemberShip
            </div>
        </Box>)
}