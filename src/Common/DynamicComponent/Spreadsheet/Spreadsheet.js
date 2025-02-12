import React, { useState } from "react";
import Spreadsheet from "react-spreadsheet";
import * as XLSX from "xlsx";

const SpreadsheetComponent = () => {
  const [data, setData] = useState([]);

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select a valid Excel file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const binaryString = e.target.result;
        const workbook = XLSX.read(binaryString, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

        // Convert JSON data to spreadsheet format
        let formattedData = jsonData.map((row) => row.map((cell) => ({ value: cell })));

        // Ensure at least 2 columns exist
        if (formattedData.length > 1) {
          formattedData = calculateTotal(formattedData);
        }

        setData(formattedData);
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Error processing the file. Please check your file format.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // Function to calculate total dynamically
  const calculateTotal = (updatedData) => {
    let total = 0;

    // Identify the column containing prices (assumed to be last column)
    const priceColumnIndex = updatedData[0].length - 1;

    // Sum only numeric values in the price column, skipping header row
    for (let i = 1; i < updatedData.length; i++) {
      total += parseFloat(updatedData[i][priceColumnIndex]?.value) || 0;
    }

    // Append/Update the total row at the bottom
    if (updatedData.length > 1) {
      updatedData.push([{ value: "Total" }, { value: total }]);
    }

    return updatedData;
  };

  // Handle cell value changes & recalculate total
  const handleDataChange = (newData) => {
    setData(calculateTotal([...newData]));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Upload and View Excel Data</h2>

      {/* Styled File Input */}
      <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
        Choose File
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
      </label>

      {/* Spreadsheet Display */}
      {data.length > 0 && <Spreadsheet data={data} onChange={handleDataChange} />}
    </div>
  );
};

export default SpreadsheetComponent;
