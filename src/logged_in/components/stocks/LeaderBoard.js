import classNames from "classnames";
import { 
    Divider, 
    Box, 
    makeStyles,
    CircularProgress,
} from "@material-ui/core";
import MaterialTable from 'material-table';
import {useEffect, useState} from "react";
import { getData} from "../../../service/service";


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
        textAlign: "justify-all",
        boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px"
    },
    wrapper: {
        minHeight: "60vh",
    },
}))

export default function LeaderBoard() {
    const classes = useStyles();

    const [data, setData]= useState([]);

    useEffect(function(){
        fetchUsers();
    }, [])

    async function fetchUsers(){
         const usersList = await getData("user/fetchusersvirtualamount");
         console.log(usersList);
         if(usersList.success){
            setData(usersList.data);
        }
    }

    return (
        <Box
            className={classNames("lg-p-top", classes.wrapper)}
            display="flex"
            justifyContent="center"
        >
            <div className={classes.blogContentWrapper}>
                <div style={{ fontSize: 40, textAlign: "center" }}><u>Leader Board</u></div>
                <Divider style={{ margin: 20 }} />


                   {
            data.length===0 ? <div className="ParentFlex">
                <CircularProgress color="secondary" className="preloader"/>
              </div>
          :      
                 <MaterialTable
                  title= " "
                  style={{fontWeight:500, marginTop:20}}
                  columns={[
                    { 
                        title: 'SNo.',
                        field:'tableData.id', 
                        cellStyle: { textAlign:"center", backgroundColor:"#f1c40f", fontWeight:"600"}, 
                        render: rowData=>rowData.tableData.id+1 
                    },
                    { 
                        title: 'Name',
                        field:'userName', 
                        cellStyle: { color:"blue", fontWeight:"600"}, 
                        render: rowData=>rowData.User.userName 
                    },
                    { 
                        title: "Praedico's Virtual Amount(Rs)", 
                        field: 'totalBuyPrice' ,
                        render: rowData=> "₹ "+rowData.virtualAmount
                    },
                    // { 
                    //     title: 'Total Buying Price', 
                    //     field: 'totalBuyPrice' ,
                    //     render: rowData=>"₹"+(rowData.totalBuyPrice / rowData.buyStock * (rowData.buyStock- rowData.sellStock)).toFixed(2) 
                    // },
                    // { 
                    //     title: 'Stock Left', 
                    //     field: 'buyStock', 
                    //     cellStyle: { fontWeight:"600"} ,
                    //     render: rowData=>rowData.buyStock-rowData.sellStock 
                    // },
                    // { 
                    //     title: 'Current Price', 
                    //     field: 'currentPrice' ,
                    //     render: rowData=>"₹"+rowData.current.toFixed(2) 
                    // },
                    // { 
                    //     title: 'Total Current Price', 
                    //     field: 'currentPrice' ,
                    //     render: rowData=>"₹"+ (rowData.current * (rowData.buyStock - rowData.sellStock)).toFixed(2) 
                    // },
                    { 
                        title: 'Starting Date', 
                        field: 'dateOfRegistration' ,
                        render: rowData=>rowData.User.dateOfRegistration
                    },
                  ]
}
                  data={data}  
                 
                  options={{
                    paging:false,
                      headerStyle: {
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      backgroundColor: "#D1D1D8",
                      textAlign:"center",
                    },
                     searchFieldStyle: {
                        backgroundColor:"#D1D1D8",
                      },
                      //   rowStyle: (rowData, index) => {
                      //     if(index%2 === 0 ) {
                      //       return {backgroundColor: '#c7ecee'};
                      //     }
                      //   return {backgroundColor: '#ecf0f1'};
                      // },
                  }}    
                />
            }

            </div>
        </Box>
    )
}