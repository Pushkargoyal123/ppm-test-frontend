// external dependency
import { Dialog } from "@material-ui/core";
import { useEffect, useState } from "react";
import MaterialTable from "material-table";

// internal dependency
import { postData } from "../../service/service";

export default function ViewPrizeDistribution(props) {

    const [prizeList, setPrizeList] = useState([]);

    useEffect(function () {
        viewPrizes()
        // eslint-disable-next-line
    }, [props.clickedEvent])

    const viewPrizes = async () => {
        if (props.clickedEvent) {
            const body = { ppmDreamNiftyId: props.clickedEvent.id };
            const data = await postData("dreamNifty/prize/prizeDistribution", body);
            if (data.success) {
                let sum = 0;
                const finalData = data.data.map(function (item, index) {
                    sum += item.participant;
                    if (index)
                        item.members = (sum - item.participant) + " - " + sum;
                    else
                        item.members = " 1 - " + sum;
                    item.prizePerMember = '₹' + Math.round(props.clickedEvent.totalRewardPrice * item.percentDistribution / 100 / item.participant);
                    return item;
                })
                setPrizeList(finalData);
            }
        }
    }

    return <Dialog
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
    >
        <div className="flexBox">
            <span></span>
            <h2 id="simple-modal-title">Prize Distribution</h2>
            <i style={{ fontSize: 25, cursor: "pointer" }} onClick={() => props.setOpen(false)} class="fas fa-times"></i>
        </div>
        <MaterialTable
            style={{ minWidth: "80%", textAlign: "center", fontWeight: 500 }}
            title=""
            components={{
                Toolbar: () => <div></div>
            }}
            columns={[
                {
                    title: 'SNO',
                    cellStyle: { textAlign: "center", color: "blue", fontWeight: "600" },
                    render: (rowData) => <div> {rowData.tableData.id + 1} </div>
                },
                {
                    title: 'Prize Per Members',
                    field: 'prizePerMember',
                    cellStyle: { textAlign: "center" },
                },
                {
                    title: 'Rank',
                    field: 'members',
                    cellStyle: { textAlign: "center" },
                },
            ]}
            data={prizeList}

            options={{
                search: false,
                maxBodyHeight: '80vh',
                paging: false,
                headerStyle: {
                    fontWeight: "500",
                    backgroundColor: "#D1D1D8",
                    textAlign: "center"
                },
                rowStyle: { height: 50, fontWeight: 600, fontSize: 18 }
            }}
        />

    </Dialog>
}