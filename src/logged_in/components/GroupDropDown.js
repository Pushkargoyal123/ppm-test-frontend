import { FormControl, InputLabel, Select, Grid, MenuItem } from "@material-ui/core"
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { getData } from "../../service/service";

export default function GroupDropDown(props) {

    const [listGroup, setListGroup] = useState([]);

    const user = useSelector(state => state.user)
    const userData = Object.values(user)[0];

    useEffect(function () {
        const groupList = async () => {
            const data = await getData("group/fetchALLGroupsByUserId");
            if (data) {
                setListGroup(data.data);
                if (data.data.length) {
                    if(!sessionStorage.getItem("groupId")){
                        props.setGroupId(data.data[0].ppm_group.id)
                    }else{
                        props.setGroupId(sessionStorage.getItem("groupId"));
                    }
                    if (props.userGroupId) props.setUserGroupId(data.data[0].id)
                }
            }
        }
        if(userData){
            groupList();
        }
        // eslint-disable-next-line
    }, [])

    const handleSelectChange = (value) => {
        props.setMessage(false);
        props.setGroupId(value)
        sessionStorage.setItem("groupId", value);
        if (props.userGroupId) {
            const userGroupId = listGroup.filter(function (item) {
                return item.ppm_group.id === value
            })[0].id
            props.setUserGroupId(userGroupId)
        }
    }

    return <Grid container spacing={4}>
        <Grid item sm={4} style={{ marginLeft: 20 }}>
            {
                listGroup[0] && listGroup.length === 1 ?
                    <div style={{ fontSize: 20, fontWeight: "bold", textTransform: "uppercase" }}>{listGroup[0].ppm_group.name + "-" + listGroup[0].ppm_group.value}</div>
                    :
                    <FormControl style={{ width: 200 }}>
                        <InputLabel htmlFor="outlined-age-native-simple">Group</InputLabel>
                        <Select
                            value={props.groupId}
                            onChange={(event) => handleSelectChange(event.target.value)}
                            label="Group"
                            style={{ textTransform: "uppercase" }}
                            placeholder="Group"
                            inputProps={{
                                name: 'Group',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                            {
                                listGroup.map(function (item) {
                                    return <MenuItem
                                        style={{ textTransform: "uppercase" }}
                                        key={item.ppm_group.id}
                                        value={item.ppm_group.id}>
                                        {item.ppm_group.name + "-" + item.ppm_group.value}
                                    </MenuItem>;
                                })
                            }
                        </Select>
                    </FormControl>
            }
        </Grid>
        <Grid item sm={4} style={{ fontSize: 40, textAlign: "center" }}>
            {
                props.heading ? <u>{props.heading}</u> :
                    <span style={{fontSize: 20}}>{props.current}</span>
            }
        </Grid>

    </Grid>

}