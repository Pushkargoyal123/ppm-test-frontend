import classNames from "classnames";
import { Divider, Box, makeStyles } from "@material-ui/core";
import MaterialTable from 'material-table';
import {useEffect, useState} from "react"
import { getData} from "../../../service/service";
import {portfolioHistoryColumns} from "../../../config"
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
        boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px"
    },
    wrapper: {
        minHeight: "60vh",
    },
}))

export default function TransactionHistory(props) {
    const classes = useStyles();

    const [data, setData] = useState([]);

    const user= useSelector(state=>state.user)
    const userId= Object.values(user)[0].id

    useEffect(function(){
        const fetchTransactionHistory=async()=>{
            const resultportfolio = await getData("stock/fetchportfoliohistory?UserId="+userId)
            if(resultportfolio.success)
              setData(resultportfolio.data);
        }
        fetchTransactionHistory()
    }, [userId])

    return (
        <Box
            className={classNames("lg-p-top", classes.wrapper)}
            display="flex"
            justifyContent="center"
        >
            <div className={classes.blogContentWrapper}>
                <div style={{ fontSize: 40, textAlign: "center" }}><u>Transaction History</u></div>
                <Divider style={{ margin: 20 }} />

                   {
        data.length===0 ? <div className="ParentFlex">
            <CircularProgress color="secondary" className="preloader"/>
          </div>
      :      
                 <MaterialTable
                  title="Transaction History"
                  style={{fontWeight:500}}
                  columns={portfolioHistoryColumns}
                  data={data}        
                  options={{
                     pageSize:50, 
                      maxBodyHeight: '80vh',
                      emptyRowsWhenPaging: false, 
                      pageSizeOptions:[50,100,150,200],
                    filtering: true,
                      headerStyle: {
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      backgroundColor: "#D1D1D8",
                      textAlign:"center",
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
