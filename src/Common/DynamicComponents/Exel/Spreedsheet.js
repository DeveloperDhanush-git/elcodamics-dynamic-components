import React, { useState } from "react";
import * as XLSX from "xlsx";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";

const ExcelReader = () => {
    const [gridData, setGridData] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert sheet to JSON with better formatting
            let jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

            // Remove empty rows
            jsonData = jsonData.filter(row => row.length > 0);

            // Set column headers properly
            const headers = jsonData[0];
            const dataRows = jsonData.slice(1);

            // Ensure all rows have the same number of columns
            const formattedData = dataRows.map(row =>
                row.length < headers.length ? [...row, ...Array(headers.length - row.length).fill("")] : row
            );

            setGridData([headers, ...formattedData]);
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            {/* Header */}
            <h1 className="text-3xl font-bold mb-4">Excel File Reader</h1>

            {/* File Upload Input */}
            <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileUpload} 
                className="p-2 border rounded-md bg-white shadow-md cursor-pointer"
            />

            {/* Table Container */}
            {gridData.length > 0 && (
                <div className="w-full h-full mt-4 p-4 bg-white shadow-md rounded-lg overflow-hidden">
                    <HotTable
                        data={gridData}
                        colHeaders={gridData[0]} // Set headers correctly
                        rowHeaders={true}
                        width="100%"
                        height="80vh" // Takes most of the screen height
                        colWidths={150}
                        stretchH="all"
                        licenseKey="non-commercial-and-evaluation"
                        manualColumnResize={true}
                        manualRowResize={true}
                        contextMenu={true}
                        className="border rounded-lg"
                    />
                </div>
            )}
        </div>
    );
};

export default ExcelReader;
