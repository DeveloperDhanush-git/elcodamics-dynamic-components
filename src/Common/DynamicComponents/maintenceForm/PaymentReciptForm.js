import DynamicForm from "./DynamicForm";
import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";

const API_URL = "http://localhost/payment.php";

const PaymentReceiptForm = () => {
  const [formData, setFormData] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const formFields = [
    {
      name: "customerVendorName",
      label: "Customer/Vendor Name",
      type: "select",
      options: [
        { label: "Please Select", value: "" },
        { label: "Customer A", value: "customer_a" },
        { label: "Vendor B", value: "vendor_b" },
        { label: "Customer C", value: "customer_c" },
        { label: "Vendor D", value: "vendor_d" },
      ],
      validation: { required: true },
    },
    {
      name: "invoicePurchaseOrderNumber",
      label: "Invoice/Purchase Order Number",
      type: "select",
      options: [
        { label: "Please Select", value: "" },
        { label: "INV-12345", value: "inv_12345" },
        { label: "PO-67890", value: "po_67890" },
        { label: "INV-23456", value: "inv_23456" },
        { label: "PO-12345", value: "po_12345" },
      ],
      validation: { required: true },
    },
    {
      name: "amount",
      label: "Amount",
      type: "number",
      validation: { required: true },
    },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      options: [
        { label: "Please Select", value: "" },
        { label: "Cash", value: "cash" },
        { label: "Credit Card", value: "credit_card" },
        { label: "Bank Transfer", value: "bank_transfer" },
      ],
      validation: { required: true },
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      validation: { required: true },
    },
  ];

  const fetchFormData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (Array.isArray(data)) {
        setFormData(data);
      } else {
        console.error("Invalid data format received:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchFormData();
  }, []);
  
  const handleFormSubmit = async (values) => {
    console.log("Submitting:", values); // Debugging
    const dataToSend = {
      id: values.id || null,
      customerVendorName: values.customerVendorName,
      invoicePurchaseOrderNumber: values.invoicePurchaseOrderNumber,
      amount: values.amount,
      paymentMode: values.paymentMode,
      date: values.date,
      is_active: 1,
      is_deleted: 0,
    };
  
    try {
      const method = values.id ? "PUT" : "POST";
      const response = await fetch(API_URL, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
  
      const text = await response.text();
      console.log("Server Response:", text); // Debugging
      const data = JSON.parse(text);
  
      alert(data.message);
      fetchFormData();
      setSelectedPayment(null);
    } catch (error) {
      console.error("Form submission failed:", error);
      alert("Failed to submit form. Check console for details.");
    }
  };
  

  const handleEdit = (payment) => {
    setSelectedPayment(payment);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment record?")) return;
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      alert(data.message);
      fetchFormData();
    } catch (error) {
      console.error("Error deleting payment record:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>
        Payment Receipt Form
      </Typography>
      <DynamicForm
        formFields={formFields}
        initialValues={selectedPayment || {}}
        onSubmit={handleFormSubmit}
      />
      <h2 className="text-xl font-bold mt-6">Payment Receipt List</h2>
      <TableContainer className="mt-4">
        <Table sx={{ minWidth: 650 }} aria-label="payment table">
          <TableHead>
            <TableRow>
              <TableCell>Customer/Vendor Name</TableCell>
              <TableCell>Invoice/PO Number</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Mode</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.customerVendorName}</TableCell>
                <TableCell>{payment.invoicePurchaseOrderNumber}</TableCell>
                <TableCell>₹{payment.amount}</TableCell>
                <TableCell>{payment.paymentMode}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(payment)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(payment.id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PaymentReceiptForm;

