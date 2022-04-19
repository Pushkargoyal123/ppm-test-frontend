import classNames from "classnames";
import CircularProgress from '@material-ui/core/CircularProgress';
import { useEffect, useState } from "react"
import MaterialTable from 'material-table';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Box, Button, makeStyles } from "@material-ui/core";
import AddIcon from '@material-ui/icons/AddCircle';
import { withStyles } from '@material-ui/core/styles';
import { toast } from "react-toastify";

import StockData from "./StockData";
import { getData, postData } from "../../../service/service";

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
    message: {
        color: "red",
        fontWeight: "600"
    }
}))

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

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

export default function WatchList(props) {
    const classes = useStyles();

    useEffect(function () {
        const fetchUsersWatchList = async () => {
            const result = await getData("watchlist/fetchuserwatchlist")
            if (result.success) {
                setMessage(1)
                setData(result.data);
            }
            else {
                setMessage(2);
            }
        }
        fetchUsersWatchList()
    }, [])

    const [data, setData] = useState([]);
    const [message, setMessage] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [stockOfCompany, setStockOfCompany] = useState({});

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event, rowData) => {
        setAnchorEl(event.currentTarget);
        setStockOfCompany(rowData);
    };

    const handleRemove = async () => {
        const body = { companyCode: stockOfCompany.companyCode }
        const result = await postData("watchlist/removefromwatchlist", body);
        if (result.success) {
            const result = await getData("watchlist/fetchuserwatchlist");
            handleClose();
            toast.success('🦄  Stock removed from your Watch List', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
            });
            setData(result.data);
        }
    }

    return (
        <Box
            className={classNames("lg-p-top", classes.wrapper)}
            display="flex"
            justifyContent="center"
        >
            <div className={classes.blogContentWrapper + " animation-bottom-top"}>
                <div style={{ fontSize: 40, textAlign: "center" }}><u>Watch List</u></div>
                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <StyledMenuItem
                        style={{ backgroundColor: "#3f50b5", color: "white" }}
                        onClick={handleRemove}
                    >
                        <ListItemIcon>
                            <BusinessCenterIcon style={{ color: "white" }} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Remove from Watch List" />
                    </StyledMenuItem>
                </StyledMenu>
                {
                    !message ? <div className="ParentFlex">
                        <CircularProgress color="secondary" className="preloader" />
                    </div>
                        :
                        <MaterialTable
                            title=""
                            style={{ fontWeight: 500 }}
                            columns={[
                                {
                                    title: 'SNo.',
                                    field: 'tableData.id',
                                    cellStyle: { textAlign: "center", backgroundColor: "#f1c40f", color: "white", fontWeight: "600", fontSize: "1.1rem", width: "4%" },
                                    render: rowData => rowData.tableData.id + 1
                                },
                                {
                                    title: 'Company Code',
                                    field: 'companyCode',
                                    render: rowData => rowData.companyCode
                                },
                                {
                                    title: 'Company Name',
                                    field: 'companyname',
                                    render: rowData => rowData.companyname,
                                },
                                {
                                    title: 'Current Price',
                                    field: 'currentprice',
                                    render: rowData => rowData.currentprice
                                },
                                {
                                    title: 'BUY/SELL',
                                    render: rowData => <Button 
                                        style={{ backgroundColor: "#44bd32", color: "white", fontWeight: "bold", fontSize: "0.9rem" }}
                                        onClick = {()=>props.setComponent( <StockData 
                                            data = { {CompanyCode : rowData.companyCode, CompanyName : rowData.companyname} }
                                            setComponent = {props.setComponent}
                                            setUnderlinedButton = {props.setUnderlinedButton}
                                        /> ) }
                                    > 
                                        BUY/SELL 
                                    </Button>
                                },
                            ]}
                            data={data}
                            localization={{
                                body: message === 1 ?
                                    data.length ? null : {
                                        emptyDataSourceMessage: (
                                            "There is no stock in your watch list add some by clicking on plus icon in nifty stock page"
                                        ),
                                    } :
                                    {
                                        emptyDataSourceMessage: (
                                            <span className={classes.message}>!!OOPS Server Error</span>
                                        ),
                                    },
                            }}
                            actions={[
                                rowData => ({
                                    icon: () => <AddIcon style={{ color: "blue", fontWeight: "800", fontSize: "1.7rem" }} />,
                                    tooltip: 'Remove from watch list',
                                    onClick: (event, rowData) => handleClick(event, rowData)
                                })
                            ]}
                            options={{
                                maxBodyHeight: '80vh',
                                emptyRowsWhenPaging: false,
                                paging: false,
                                headerStyle: {
                                    fontSize: "1.1rem",
                                    fontWeight: "500",
                                    backgroundColor: "#D1D1D8",
                                },
                                searchFieldStyle: {
                                    backgroundColor: "#D1D1D8",
                                },
                            }}
                        />
                }
            </div>
        </Box>)
}
