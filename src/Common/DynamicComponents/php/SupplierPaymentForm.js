import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import {
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const supplierPaymentFields = [
  {
    name: "supplierName",
    label: "Supplier Name",
    type: "select",
    options: [
      { label: "Supplier A", value: "supplier_a" },
      { label: "Supplier B", value: "supplier_b" },
      { label: "Supplier C", value: "supplier_c" },
      { label: "Supplier D", value: "supplier_d" },
      { label: "Supplier E", value: "supplier_e" },
    ],
    validation: { required: true },
  },
  {
    name: "purchaseOrderNumber",
    label: "Purchase Order Number",
    type: "select",
    options: [
      { label: "PO-001", value: "po_001" },
      { label: "PO-002", value: "po_002" },
      { label: "PO-003", value: "po_003" },
      { label: "PO-004", value: "po_004" },
      { label: "PO-005", value: "po_005" },
    ],
    validation: { required: true },
  },
  { name: "amountPaid", label: "Amount Paid", type: "number", validation: { required: true, min: 0 } },
  {
    name: "paymentMode",
    label: "Payment Mode",
    type: "select",
    options: [
      { label: "Credit Card", value: "credit_card" },
      { label: "UPI", value: "upi" },
    ],
    validation: { required: true },
  },
  { name: "paymentDate", label: "Payment Date", type: "date", validation: { required: true } },
];

const SupplierPaymentForm = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [payments, setPayments] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const API_BASE_URL = "http://localhost"; // Change this if needed

  // Fetch payments from the server
  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/SavePayment.php`);
      if (!response.ok) throw new Error("Failed to fetch payments");

      const data = await response.json();
      console.log("Fetched Payments:", data); // Debugging API response
      setPayments(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setMessage("Error fetching payments");
      setOpenSnackbar(true);

      // Fallback data to display something
      setPayments([
        {
          id: 1,
          supplierName: "Supplier A",
          purchaseOrderNumber: "PO-001",
          amountPaid: 1000,
          paymentMode: "Credit Card",
          paymentDate: "2024-02-19",
        },
      ]);
    }
  };

  useEffect(() => {
    fetch("http://localhost:8000/SavePayment.php")
        .then((response) => response.json())
        .then((data) => {
            console.log(data); // Debugging: Check what the API is returning
            if (data.status === "success") {
                setPayments(data.data);
            }
        })
        .catch((error) => console.error("Error fetching data:", error));
}, []);

const handleSubmit = async (values) => {
  console.log("Submitting:", values);
  try {
    setLoading(true);
    let apiUrl = `${API_BASE_URL}/SavePayment.php`;
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        _method: editIndex !== null ? "PUT" : "POST",  // Ensure compatibility with PHP
      }),
    });

    const result = await response.json();
    console.log("Server Response:", result);

    if (result.status === "success") {
      setMessage(editIndex !== null ? "Payment updated successfully" : "Payment submitted successfully");
      fetchPayments();
      resetForm();
    } else {
      throw new Error(result.message || "Error submitting payment");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    setMessage(error.message);
  } finally {
    setLoading(false);
    setOpenSnackbar(true);
  }
};


  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(payments[index]);
  };

  const handleDelete = async (index) => {
    const paymentId = payments[index]?.id;
    if (!paymentId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/SavePayment.php?id=${paymentId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete payment");

      setMessage("Payment deleted successfully");
      fetchPayments(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting payment:", error);
      setMessage("Error deleting payment");
    } finally {
      setOpenSnackbar(true);
    }
  };

  const resetForm = () => {
    setFormData(null);
    setEditIndex(null);
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
        Supplier Payment Form
      </Typography>
      <DynamicForm formFields={supplierPaymentFields} onSubmit={handleSubmit} initialValues={formData || {}} />
      
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} message={message} />

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
          Payment List
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Supplier Name</TableCell>
              <TableCell>PO Number</TableCell>
              <TableCell>Amount Paid</TableCell>
              <TableCell>Payment Mode</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length > 0 ? (
              payments.map((payment, index) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.supplierName}</TableCell>
                  <TableCell>{payment.purchaseOrderNumber}</TableCell>
                  <TableCell>{payment.amountPaid}</TableCell>
                  <TableCell>{payment.paymentMode}</TableCell>
                  <TableCell>{payment.paymentDate}</TableCell>
                  <TableCell>
                    <Button variant="outlined" sx={{ marginRight: 1 }} onClick={() => handleEdit(index)}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(index)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </>
  );
};

export default SupplierPaymentForm;
