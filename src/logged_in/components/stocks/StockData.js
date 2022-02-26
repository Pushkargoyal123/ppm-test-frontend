import classNames from "classnames";
import { Divider, Box, makeStyles, Button } from "@material-ui/core";
import Stock from "./Stock";
import {useState, useEffect} from "react";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  YAxis,
} from "recharts";
import MaterialTable from 'material-table';
import Modal from '@material-ui/core/Modal';
import Portfolio from "./Portfolio";
import {postData, getData} from "../../../service/service"
import {timeDuration} from "../../../config";
import { useSelector } from "react-redux";
import CircularProgress from '@material-ui/core/CircularProgress';

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

function getModalStyle() {
  const top =50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
     position: 'absolute',
     minHeight:350,
     borderRadius:10,
        minWidth: 400,
        textAlign:"center",
        backgroundColor: "white",
        border: '8px solid grey',
        borderTop:"",
        boxShadow: "0 0 8px 2px black",
  };
}


export default function StockData(props) {
    const classes = useStyles();
    const [data, setData]= useState([]);
    const [filteredData, setFilteredData]= useState([]);
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [body, setBody]= React.useState(false);
    const [virtualAmount, setVirtualAmount]= useState('');
    const [netAmount, setNetAmount]= useState("");
    const [buyPrice, setBuyPrice]= useState("");
    const [sellPrice, setSellPrice]= useState(""); 
    const [stockBuy, setStockBuy]= useState("");
    const [stockSell, setStockSell]= useState("");
    const [comment, setComment]= useState("");
    const [displayBuyButton, setDisplayBuyButton]= useState(false);
    const [displaySellButton, setDisplaySellButton]= useState(false);
    const [stockAvailable, setStockAvailable]= useState("");
    const [buttonColor, setButtonColor]= useState("ALL");
    const [minMax, setMinMax]= useState([]);

    const user= useSelector(state=>state.user)
    const userId= Object.values(user)[0].id
    const ppmGroupId= Object.values(user)[0].groupId

    useEffect(function(){
        const fetchCompanyData=async()=>{

        const body={CompanyCode: props.data.CompanyCode}

        const result= await postData("stock/getallcompanystockdetails", body);

        if(!result.success){
          result.reverse();
          setData(result)
          setFilteredData(result);
          setMinMax(result.map(function(item){
            return item.currentPrice;
          }))
        }
      }
        fetchCompanyData(); 
    }, [props.data])

    const dataFormater=(number)=>{
      return(number);
    }

    const fetchVirtualAmountAndNetAmount=async()=>{
      const result = await getData("group/findbyuserid?UserId="+userId);
      if(result.success){
        setVirtualAmount(result.data.virtualAmount.toFixed(2));
        setNetAmount(result.data.netAmount.toFixed(2));
      }
    }

    const fetchPortfolioStock=async()=>{
      let body={
        userId : userId,
        companyName:props.data.CompanyName,
      }

      const result = await postData("stock/fetchportfolio", body);
      if(result.status){
        setStockAvailable(result.stockAvailable );
      }
    }

    const handleOpen = (name) => {
      fetchVirtualAmountAndNetAmount();
      fetchPortfolioStock();
      setBody(false);
      setOpen(true);
  };

  const handleClose = () => {
    setDisplaySellButton(false)
    setDisplayBuyButton(false);
    setBuyPrice("");
    setSellPrice("")
    setStockBuy("")
    setStockSell("")
    setOpen(false);
  };

  const setBuyingPrice=(value)=>{
     if(value===""){
      setStockBuy("");
      setBuyPrice(value*data[0].currentPrice.toFixed(2));
      setDisplayBuyButton(false);
    }else{
      setStockBuy(parseInt(value));
      setBuyPrice((parseInt(value)*data[0].currentPrice).toFixed(2));
      setDisplayBuyButton(true);
    }
  }

  const setSellingPrice=(value)=>{
    if(value===""){
      setStockSell("")
      setSellPrice((value*data[0].currentPrice).toFixed(2));
      setDisplaySellButton(false);
    }else{
      setStockSell(parseInt(value))
      setSellPrice((parseInt(value)*data[0].currentPrice).toFixed(2));
      setDisplaySellButton(true);
    }
  }

  const handleBuySell=async()=>{
    var body={ 
      companyCode:props.data.CompanyCode, 
      companyName:props.data.CompanyName, 
      currentPrice:data[0] ? data[0].currentPrice : 0, 
      buyStock:stockBuy,
      totalBuyPrice:buyPrice, 
      sellStock:stockSell, 
      totalSellPrice:sellPrice, 
      comment:comment, 
      virtualAmount:virtualAmount, 
      netAmount : netAmount,
      UserId: userId, 
      ppmGroupId:ppmGroupId 
    }
    const result = await postData("stock/insertportfolio", body);
    if(result.success){
      props.setComponent(<Portfolio setComponent={props.setComponent} companyCode={props.data.companyCode} setUnderlinedButton = {props.setUnderlinedButton}/>)
      props.setUnderlinedButton("Portfolio");
    } 
  }

  const handleGraphData=(item)=>{
  
    if(item.uniq==="D"){
      setFilteredData(data.slice(0,item.number));
      setMinMax(data.slice(0,item.number).map(function(item){
        return item.currentPrice;
      }))
    }

    else if(item.uniq==="M"){
       setFilteredData(data.slice(0,item.number * 30));
      setMinMax(data.slice(0,item.number * 30).map(function(item){
        return item.currentPrice;
      }))
    }

    else{
       setFilteredData(data);
      setMinMax(data.map(function(item){
        return item.currentPrice;
      }))
    }
    setButtonColor(item.time)
  }

  const handleSetBody=(value)=>{
    setDisplaySellButton(false)
    setDisplayBuyButton(false);
    setBuyPrice("");
    setSellPrice("");
    setStockBuy("")
    setStockSell("")
    setBody(value);
  }

  const body1=(<div style={modalStyle}>
      <div>
      <div style={{display:"flex"}}>
          <div style={{width:"90%", margin:"auto", border:"4px grey solid", borderBottom:"" , fontSize:40, backgroundColor:"#9EFD38", color:"white"}}>BUY</div>
          <div onClick={()=>handleSetBody(true)} style={{width:"90%", margin:"auto", cursor:"pointer", fontSize:40, borderBottom:"4px solid grey", backgroundColor:"red", color:"white"}}>Sell</div>
        </div>
          <div style={{margin:"20px", fontSize:22, fontWeight:"700"}}>Your Praedico virtual amount left is : <span style={{color:"green"}}>₹{virtualAmount}</span></div>
          <div style={{display:"flex", justifyContent:"space-evenly"}}>
            <input value={stockBuy} onChange={(event)=>setBuyingPrice(event.target.value)} placeholder= "Enter Stock!" style={{padding:"5px", margin:"0 10px", borderRadius:"30px", outline:"none", border:"2px grey solid", paddingLeft:10, width:170, fontSize:20}} />
            <div style={{ fontSize:22, fontWeight:"700"}}>Total Buying Price : <span style={{color:"blue"}}>₹{buyPrice}</span></div>
          </div>
          { displayBuyButton ? <> { virtualAmount > (parseInt(stockBuy)*data[0].currentPrice) ?<>
          <textarea onChange={(event)=>setComment(event.target.value)} style={{margin:20, width:"90%", height:100}} placeholder={"Please tell us why are you buying "+props.data.CompanyName+" stocks"}/>
          <Button onClick={handleBuySell} variant="contained" style={{backgroundColor:"green", color:"white", marginBottom:"30px"}}>BUY</Button>
          </> :
          <div style={{color:"red", fontSize:"1.1rem", marginTop:20, fontWeight:500}}>You have an insufficient balance...</div>}
           </> :<></> }
        </div>
    </div>)

    const body2=(<div style={modalStyle}>
        <div>
          <div style={{display:"flex"}}>
            <div onClick={()=>handleSetBody(false)} style={{width:"90%", margin:"auto", cursor:"pointer", borderBottom:"4px solid grey", fontSize:40, backgroundColor:"green", color:"white"}}>BUY</div>
            <div  style={{width:"90%", margin:"auto", fontSize:40, border:"4px grey solid", borderBottom:"", backgroundColor:"#ff7675", color:"white"}}>Sell</div>
          </div>
          <div style={{marginTop:"20px", fontSize:22, fontWeight:"700"}}>Total Stock Available : <span style={{color:"green"}}>{stockAvailable}</span></div>
          <div style={{marginBottom:"20px", fontSize:22, fontWeight:"700"}}>Total Price: <span style={{color:"green"}}>₹{data[0] ? (stockAvailable *  data[0].currentPrice).toFixed(2) : 0}</span></div>
          <div style={{display:"flex", padding:"0 20px", justifyContent:"space-evenly"}}>
              <input value={stockSell} onChange={(event)=>setSellingPrice(event.target.value)} placeholder= "Enter Stock!" style={{padding:"5px", margin:"0 10px", borderRadius:"30px", outline:"none", border:"2px grey solid", paddingLeft:10, width:170, fontSize:20}}/>
              <div style={{ fontSize:22, fontWeight:"700"}}>Total Selling Price : <span style={{color:"blue"}}>₹{sellPrice}</span></div>
          </div>
          { displaySellButton ? <> { stockAvailable >= stockSell ? <>
          <textarea onChange={(event)=>setComment(event.target.value)} style={{margin:20, width:"90%", height:100}} placeholder={"Please tell us why are you seling "+props.data.CompanyName+" stock..."}/>
          <Button onClick={handleBuySell} variant="contained" style={{backgroundColor:"red", color:"white", marginBottom:"30px"}}>SELL</Button>
          </> : 
          <div style={{color:"red", fontSize:"1.1rem", marginTop:20, fontWeight:500}}>You have insufficient stocks</div> }
          </> :<></> }
        </div>
      </div>)

    return (
        <Box
            className={classNames("lg-p-top", classes.wrapper)}
            display="flex"
            justifyContent="center"
        >
            <div className={classes.blogContentWrapper}>
                <div style={{display:"flex", justifyContent:"space-evenly", alignItems:"center", flexWrap:"wrap" }}>
                    <div style={{ textAlign: "left", fontWeight:"bold", fontSize:22 }}>Current Price : ₹{data[0] ? data[0].currentPrice : " "}</div>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="simple-modal-title"
                      aria-describedby="simple-modal-description"
                    >
                      {body? body2 : body1}
                  </Modal>
                    <Button color="primary" variant="contained" onClick={handleOpen}> Buy/Sell</Button>
                    <Button color="secondary" variant="contained"  onClick={()=>props.setComponent(<Stock setComponent={props.setComponent}/>)}> Go Back</Button>
                </div>
                <Divider style={{ margin: 20 }} />
                 <div style={{display:"flex", justifyContent:"space-evenly", flexWrap:"wrap" ,borderBottom:"2px black solid", borderLeft:"2px black solid", borderRight:"2px black solid"}}>
                   {timeDuration.map(function(item, index){
                      return( <Button key={index} style={ item.time===buttonColor ? {border: "2px black solid"} : { } } onClick={()=>handleGraphData(item)}>{item.time}</Button> )
                   })}
                 </div>
              <div style={{height:400, width:"100%"}} className="tableShadow">
               <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={400}
              data={filteredData}
              label="date"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date"/>
          <YAxis tickFormatter={dataFormater} domain={[ Math.floor( Math.min.apply(null, minMax) / 10 ) *10 , Math.ceil( Math.max.apply(null, minMax) / 10 ) *10]} yAxisId="left"/>
          <Tooltip />
          <Line yAxisId="left" type="monotone" dataKey="currentPrice" stroke="blue" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      </div>

         {
        data.length===0 ? <div className="ParentFlex">
            <CircularProgress color="secondary" className="preloader"/>
          </div>
      :      
      <MaterialTable
        style={{marginTop:"80px", boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px"}}
        title=<div style={{color:"green", fontWeight:500, fontSize:22}}>Total Records : {data.length}  Right prediction : 56.32%</div>
        columns={[
          { 
            title: 'Previous Date',
            field: 'date',
            width: 150,
            cellStyle: { textAlign:"center", fontWeight:"600"},
            render:(rowData)=>{if(rowData.tableData.id===0)return data[rowData.tableData.id].date; else return data[rowData.tableData.id-1].date;  }
          },
          { 
            title: 'Previous Price',
            field: 'currentPrice', 
            width: 150, 
            cellStyle: { textAlign:"center", fontWeight:"600"}, 
            // customFilterAndSearch: (term,rowData) => console.log("hello",term,  rowData), 
            render:rowData=>{ if(rowData.tableData.id===0)return "₹"+data[rowData.tableData.id].currentPrice; else return "₹"+data[rowData.tableData.id-1].currentPrice;} 
          },
          { 
            title: 'Previous Signal', 
            field: 'stockSignal', 
            width: 150, 
            cellStyle: { textAlign:"center", fontWeight:"600"},
            lookup: { "buy": 'BUY', "sell": 'SELL', "neutral":"NEUTRAL" }, 
            render: (rowData)=>{if(rowData.stockSignal==="buy") return <span style={{color:"green"}}>BUY</span>; else if(rowData.stockSignal==="sell") return <span style={{color:"RED"}}>Sell</span>; else return <span style={{color:"orange"}}>NEUTRAL</span>; } 
          },
          { 
            title: 'Next Date', 
            field: 'date', 
            width: 150, 
            cellStyle: { textAlign:"center", fontWeight:"600"} 
          },
          { 
            title: 'Next Price', 
            field: 'currentPrice', 
            width: 150, 
            cellStyle: { textAlign:"center", fontWeight:"600"}, 
            customFilterAndSearch: (term, rowData) => term >= parseInt(rowData.currentPrice), 
            render:rowData=> ("₹"+rowData.currentPrice) 
          },
          { 
            title: 'Prediction', 
            field: 'stockSignal', 
            width: 150, 
            cellStyle: { textAlign:"center", fontWeight:"600"}, 
            render: (rowData)=>{if(rowData.stockSignal==="buy") return <span style={{color:"green"}}>BUY</span>; else if(rowData.stockSignal==="sell") return <span style={{color:"RED"}}>Sell</span>; else return <span style={{color:"orange"}}>NEUTRAL</span>; } 
          },
        ]}
        data={data}        
        options={{
          pageSize:50, 
          maxBodyHeight: '80vh',
          emptyRowsWhenPaging: false, 
          pageSizeOptions:[50,100,150,200],
          headerStyle: {
          fontSize: "1.1rem",
          fontWeight: "500",
          backgroundColor: "#D1D1D8",
          textAlign:"center",
        },
         searchFieldStyle: {
            backgroundColor:"#D1D1D8",
          },
          filtering:true,
         // rowStyle: (rowData, index) => {
         //      if(index%2 === 0 ) {
         //        return {backgroundColor: '#c7ecee'};
         //      }
         //    return {backgroundColor: '#ecf0f1'};
         //  }
        }}
      />
    }
            </div>
        </Box>)
}
