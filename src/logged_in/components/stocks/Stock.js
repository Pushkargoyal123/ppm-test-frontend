import classNames from "classnames";
import { Box, makeStyles } from "@material-ui/core";
import MaterialTable from 'material-table';
import {useEffect, useState} from "react";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import StockData from "./StockData"
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/AddCircle';
import { getData, postData} from "../../../service/service";
import { toast } from "react-toastify";

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
        boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px"
    },
    wrapper: {
        minHeight: "60vh",
    },
    message: {
      color: "red",
      fontWeight: "600"
    }
}))

export default function Stock(props){
	const classes = useStyles();
  useEffect(function(){
    fetchAllStocks();
  }, []);

  const [stockEvaluation, setStockEvaluation]= useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [companyData, setCompanyData]= useState([]);
  const [message, setMessage] = useState(false);

  const handleClick = (event, rowData) => {
    setAnchorEl(event.currentTarget);
    setCompanyData(rowData)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchAllStocks=async()=>{
    const result = await getData("stock/getallstockdetails");
    if(result.length){
      setMessage(1)
      setStockEvaluation(result);
    }
    setMessage(2)
  }

  const handleAddToWatchList = async(companyData) => {
    const body = {companyCode : companyData.CompanyCode}
    const result = await postData("watchlist/addstocktowatchlist", body )
    console.log(result);
    if(result.success){
      toast.success('🦄  Stock added to your watch list', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
      });
    }
    setAnchorEl(null);
  }

	return (
        <Box
            className={classNames("lg-p-top", classes.wrapper)}
            display="flex"
            justifyContent="center"
        >
        <div className={classes.blogContentWrapper  + " animation-bottom-top"}>
          <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick= {()=>props.setComponent(<StockData data={companyData} setComponent={props.setComponent} setUnderlinedButton = {props.setUnderlinedButton}/>)}>
          <ListItemIcon>
            <BusinessCenterIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add To Portfolio" />
        </StyledMenuItem>
        <StyledMenuItem onClick={()=> handleAddToWatchList(companyData)}>
          <ListItemIcon>
            <WatchLaterIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add To Watch List" />
        </StyledMenuItem>
      </StyledMenu>

        {
        !message ? <div className="ParentFlex">
            <CircularProgress color="secondary" className="preloader"/>
          </div>
      :      

    <MaterialTable
    style={{minWidth:"80%", textAlign:"center", fontWeight:500}}
      title="Stock Details"
      columns={ [
        { 
          title: 'Company Code', 
          field: 'CompanyCode',  
          cellStyle: { textAlign:"center", color:"blue", fontWeight:"600"}
        },
        { 
          title: 'Company Name', 
          field: 'CompanyName', 
          cellStyle: { textAlign:"center"}, 
          render: rowData=> parseInt(rowData.Variance.substring(1)) > 0 ? <span style={{color:"green"}}>{rowData.CompanyName}</span> : <span style={{color:"red"}}>{rowData.CompanyName}</span> 
        },
        { 
          title: 'Current Price', 
          field: 'CurrentPrice', 
          cellStyle: { textAlign:"center"}, 
          customFilterAndSearch: (term, rowData) => term >= parseInt(rowData.CurrentPrice.substring(1)) 
        },
        { 
          title: 'High Price', 
          field: 'HighPrice',  
          cellStyle: { textAlign:"center"},  
          customFilterAndSearch: (term, rowData) => term >= parseInt(rowData.CurrentPrice.substring(1)) 
        },
        { 
          title: 'Low Price', 
          field: 'LowPrice',  
          cellStyle: { textAlign:"center"} ,  
          customFilterAndSearch: (term, rowData) => term >= parseInt(rowData.CurrentPrice.substring(1))
        },
        { 
          title: 'Variance', 
          field: 'Variance',  
          cellStyle: { textAlign:"center"} 
        },
        { 
          title: 'Signal', 
          field: 'Signal',  
          cellStyle: { textAlign:"center"}, 
          lookup: { "buy": 'BUY', "sell": 'SELL', "strong buy":"STRONG BUY", "strong sell": "STRONG SELL" }, 
          render: rowData=>{if(rowData.Signal==="buy") return <span style={{color:"green", fontWeight:700}}>BUY</span>; else if(rowData.Signal==="sell") return <span style={{color:"red", fontWeight:700}}>SELL</span>; else if(rowData.Signal==="strong buy") return <span style={{color:"green", fontWeight:700}}>STRONG BUY</span>; else if(rowData.Signal==="strong sell") return <span style={{color:"red", fontWeight:700}}>STRONG SELL</span> }  
        },
      ]
 }
      data={
          stockEvaluation.map(function(item,index){
            return { CompanyCode:item.companyCode, CompanyName: item.companyName, CurrentPrice: "₹"+item.currentPrice, HighPrice: "₹"+item.highPrice, LowPrice:"₹"+item.lowPrice, Variance:"₹"+item.variance, Signal:item.stockSignal }
          })
        }    
        localization={{
          body: message === 1 ?
            stockEvaluation.length ? null : {
              emptyDataSourceMessage: (
                "You haven't Buy or Sell Any Stock"
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
          icon: ()=><AddIcon style={{color:"green", fontWeight:"800", fontSize:"1.7rem"}}/>,
          tooltip: 'Add Stock',
          onClick: (event, rowData) => handleClick(event, rowData)
        })
      ]}   
      options={{
        filtering: true,
        maxBodyHeight: '80vh',
         pageSize:50, 
        emptyRowsWhenPaging: false, 
        pageSizeOptions:[50,100,150,200],
        headerStyle: {
          fontSize: "1.1rem",
          fontWeight: "500",
          backgroundColor: "#D1D1D8",
          textAlign:"center"
        },
         searchFieldStyle: {
            backgroundColor:"#D1D1D8",
          },
      }}
    />

  }
    </div>
        </Box>)
}