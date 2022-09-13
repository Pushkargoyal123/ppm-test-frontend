import { FormControl, InputLabel, Select, Grid, MenuItem } from "@material-ui/core"
import { useState } from "react";
import { useEffect } from "react";


import { getData } from "../../service/service";

export default function GroupDropDown(props) {

    const [listGroup, setListGroup] = useState([]);

    useEffect(function () {
        const groupList = async () => {
            const data = await getData("group/fetchALLGroupsByUserId");
            if (data) {
                setListGroup(data.data);
                props.setGroupId(data.data[0].ppm_group.id)
            }
        }
        groupList();
        // eslint-disable-next-line
    }, [])

    const handleSelectChange = (value) => {
        props.setGroupId(value)
    }

    return <Grid container spacing={4}>
        <Grid item sm={4} style={{ marginLeft: 20 }}>
            {
                listGroup.length === 1 ?
                    <div>{listGroup[0].ppm_group.name + "-" + listGroup[0].ppm_group.value}</div>
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
            <u>{props.heading}</u>
        </Grid>
    </Grid>

}