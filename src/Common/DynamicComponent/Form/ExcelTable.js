import React, { useState } from "react";
import Spreadsheet from "react-spreadsheet";
import * as XLSX from "xlsx";
import { evaluate } from "mathjs";

const ExcelTable = () => {
  const [data, setData] = useState([]);
  const [formulaMap, setFormulaMap] = useState({}); // Store formulas separately

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

        let formulas = {};
        let formattedData = jsonData.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (typeof cell === "string" && cell.startsWith("=")) {
              formulas[`${rowIndex}-${colIndex}`] = cell.substring(1); // Store formula without "="
              return { value: evaluateFormula(cell.substring(1), jsonData) };
            }
            return { value: cell };
          })
        );

        setData(formattedData);
        setFormulaMap(formulas);
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Error processing the file. Please check your file format.");
      }
    };
    reader.readAsBinaryString(file);
  };

  // Function to evaluate formulas dynamically
  const evaluateFormula = (formula, jsonData) => {
    try {
      return evaluate(formula, convertToMathJSVariables(jsonData));
    } catch (error) {
      return "ERROR";
    }
  };

  // Convert spreadsheet to a mathjs-compatible object
  const convertToMathJSVariables = (jsonData) => {
    let vars = {};
    jsonData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        vars[`R${rowIndex}C${colIndex}`] = isNaN(cell) ? 0 : Number(cell);
      });
    });
    return vars;
  };

  // Handle cell changes and update formulas dynamically
  const handleDataChange = (newData, { row, column }) => {
    let updatedData = [...newData];

    // If the changed cell has dependent formulas, update them
    Object.keys(formulaMap).forEach((key) => {
      const [formulaRow, formulaCol] = key.split("-").map(Number);
      updatedData[formulaRow][formulaCol] = {
        value: evaluateFormula(formulaMap[key], updatedData.map(r => r.map(c => c.value)))
      };
    });

    setData(updatedData);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Upload and View Excel Data</h2>
      
      {/* File Upload Button */}
      <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
        Choose File
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
      </label>

      {/* Spreadsheet Component */}
      <div className="mt-4">
        <Spreadsheet data={data} onChange={handleDataChange} />
      </div>
    </div>
  );
};

export default ExcelTable;
