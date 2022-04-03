import React, { useState } from "react";
import * as XLSX from "xlsx";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ExcelToTable() {

    const [fileData, setFileDAta] = useState("");

    const onChange = (e) => {
        const [file] = e.target.files;
        const reader = new FileReader();

        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            const array = data.split("\n");
            const finalData = array.map(function (item) {
                var properties = item.split(',');
                const obj = {};
                obj.SNO = properties[0];
                obj.work = properties[1];
                obj.date = properties[2];
                obj.status = properties[3];
                return obj
            })
            setFileDAta(finalData);
        };
        reader.readAsBinaryString(file);
    };
    return (
        <div>
            <input type="file" onChange={onChange} />
            <ExcelFile element={<button>Download File</button>}>
                <ExcelSheet data={fileData} name="DataSet">
                    <ExcelColumn label="SNO" value="SNO" />
                    <ExcelColumn label="Work" value="work" />
                    <ExcelColumn label="Date" value="date" />
                    <ExcelColumn label="Status" value="status" />
                </ExcelSheet>
            </ExcelFile>
        </div>
    );
}