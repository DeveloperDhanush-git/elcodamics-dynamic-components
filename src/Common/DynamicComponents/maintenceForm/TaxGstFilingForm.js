import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";

const formFields = [
  {
    name: "invoiceNumber",
    label: "Invoice Number",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "INV-12345", value: "inv_12345" },
      { label: "INV-67890", value: "inv_67890" },
      { label: "INV-23456", value: "inv_23456" },
      { label: "INV-98765", value: "inv_98765" },
    ],
    validation: { required: true },
  },
  {
    name: "gstType",
    label: "GST Type",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "CGST + SGST", value: "cgst_sgst" },
      { label: "IGST", value: "igst" },
    ],
    validation: { required: true },
  },
  {
    name: "amount",
    label: "Amount",
    type: "number",
    value: 0,
    validation: { required: true },
    disabled: true,
  },
  {
    name: "filingDate",
    label: "Filing Date",
    type: "date",
    validation: { required: true },
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Filed", value: "filed" },
      { label: "Pending", value: "pending" },
    ],
    validation: { required: true },
  },
];

const API_URL = "http://localhost/tax-gst-filing-form.php";

const TaxGstFilingForm = () => {
  const [invoiceAmount, setInvoiceAmount] = useState(0);
  const [gstType, setGstType] = useState("");
  const [filingData, setFilingData] = useState([]);
  const [selectedFiling, setSelectedFiling] = useState(null);

  // Fetch existing filing data
  const fetchFilingData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setFilingData(data);
    } catch (error) {
      console.error("Error fetching filing data:", error);
    }
  };

  useEffect(() => {
    fetchFilingData();
  }, []);
 
  const handleSubmit = async (values) => {
    try {
      const method = values.id ? "PUT" : "POST";  
      const response = await fetch(API_URL, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      alert(data.message);
      fetchFilingData(); 
      setSelectedFiling(null); 
    } catch (error) {
      console.error("Error submitting filing:", error);
    }
  };

  // Handle deletion (soft delete) of filing
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this filing?")) return;
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      alert(data.message);
      fetchFilingData(); // Refresh the filing list
    } catch (error) {
      console.error("Error deleting filing:", error);
    }
  };

  // Calculate the invoice amount based on GST type
  const calculateAmount = (gstType, baseAmount) => {
    if (!baseAmount) return 0;
    let gstRate = 0;
    switch (gstType) {
      case "cgst_sgst":
        gstRate = 9;
        break;
      case "igst":
        gstRate = 18;
        break;
      default:
        gstRate = 0;
    }
    return baseAmount + baseAmount * (gstRate / 100);
  };

  // Handle changes in GST type and update the invoice amount
  const handleGstChange = (event) => {
    const selectedGstType = event.target.value;
    setGstType(selectedGstType);
    const calculatedAmount = calculateAmount(selectedGstType, invoiceAmount);
    setInvoiceAmount(calculatedAmount);
  };

  // Handle changes in amount
  const handleAmountChange = (event) => {
    const enteredAmount = parseFloat(event.target.value);
    setInvoiceAmount(enteredAmount);
  };

  // Set the selected filing for editing
  const handleEdit = (filing) => {
    setSelectedFiling(filing);
    setInvoiceAmount(filing.amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <DynamicForm
        formFields={formFields.map((field) => {
          if (field.name === "amount") {
            field.value = invoiceAmount;
          }
          if (field.name === "gstType") {
            field.onChange = handleGstChange;
          }
          if (field.name === "amount") {
            field.onChange = handleAmountChange;
          }
          return field;
        })}
        onSubmit={handleSubmit}
        initialValues={selectedFiling || {}}
      />
      <h2 className="text-xl font-bold mt-6">GST Filing List</h2>
      <TableContainer className="mt-4">
        <Table sx={{ minWidth: 650 }} aria-label="gst filing table">
          <TableHead>
            <TableRow>
              <TableCell className="font-medium">Invoice Number</TableCell>
              <TableCell className="font-medium">GST Type</TableCell>
              <TableCell className="font-medium">Amount</TableCell>
              <TableCell className="font-medium">Status</TableCell>
              <TableCell className="font-medium">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filingData.map((filing) => (
              <TableRow key={filing.id}>
                <TableCell>{filing.invoiceNumber}</TableCell>
                <TableCell>{filing.gstType.toUpperCase()}</TableCell>
                <TableCell>₹{filing.amount}</TableCell>
                <TableCell>{filing.status}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <IconButton
                      onClick={() => handleEdit(filing)}
                      color="primary"
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(filing.id)}
                      color="secondary"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TaxGstFilingForm;
