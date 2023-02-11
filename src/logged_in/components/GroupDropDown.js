import { FormControl, InputLabel, Select, Grid, MenuItem } from "@material-ui/core"
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getData } from "../../service/service";

export default function GroupDropDown(props) {

    const [listGroup, setListGroup] = useState([]);

    var dispatch = useDispatch();
    const user = useSelector(state => state.user)
    const userData = Object.values(user)[0];
    const group = useSelector(state => state.group)
    const groupId = Object.values(group)[0];
    const userGroup = useSelector(state => state.userGroup)
    const userGroupId = Object.values(userGroup)[0];
    useSelector(state => state);

    useEffect(function () {
        const groupList = async () => {
            const data = await getData("group/userGroup/list");
            if (data) {
                if (data.data && data.data.length && data.data[0].ppm_group.value) {
                    setListGroup(data.data);
                    if (!sessionStorage.getItem("groupId") || sessionStorage.getItem("groupId") === "".trim()) {
                        dispatch({ type: "SET_GROUP", payload: [data.data[0].ppm_group.id, { group: data.data[0].ppm_group.id }] })
                    } else {
                        dispatch({ type: "SET_GROUP", payload: [sessionStorage.getItem("groupId"), { group: sessionStorage.getItem("groupId") }] })
                    }
                    dispatch({ type: "SET_USER_GROUP", payload: [data.data[0].id, { userGroup: data.data[0].id }] })
                }
            }
        }
        if (userData) {
            groupList();
        }
        // eslint-disable-next-line
    }, [userData])

    const handleSelectChange = (value) => {
        dispatch({ type: "DEL_GROUP", payload: [groupId.group] })
        dispatch({ type: "SET_GROUP", payload: [value, { group: value }] })
        if (userGroupId) {
            const userGrouplistId = listGroup.filter(function (item) {
                return item.ppm_group.id === value
            })[0].id
            dispatch({ type: "DEL_USER_GROUP", payload: [userGroupId.userGroup] })
            dispatch({ type: "SET_USER_GROUP", payload: [userGrouplistId, { userGroup: userGrouplistId }] })
        }
    }

    const eventInfo = JSON.parse(sessionStorage.getItem('clickedEvent'));

    return <Grid container>
        <Grid style={{ marginLeft: 20, display: "flex", alignItems: "center" }}>
            {
                listGroup.length && !eventInfo ?
                    listGroup[0] && listGroup.length === 1 ?
                        <div style={{ fontSize: 20, fontWeight: "bold", textTransform: "uppercase", color: "black" }}>{listGroup[0].ppm_group.name + "-" + listGroup[0].ppm_group.value}</div>
                        :
                        <FormControl style={{ width: 200 }}>
                            <InputLabel htmlFor="outlined-age-native-simple">Group</InputLabel>
                            <Select
                                value={groupId ? groupId.group : ""}
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
                    :
                    <div></div>
            }
        </Grid>
    </Grid>

}