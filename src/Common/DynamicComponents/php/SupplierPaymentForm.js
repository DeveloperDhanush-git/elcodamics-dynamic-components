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
  const [formData, setFormData] = useState({
    supplierName: "",
    purchaseOrderNumber: "",
    amountPaid: 0,
    paymentMode: "",
    paymentDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [payments, setPayments] = useState([]); // Store the list of payments
  const [editIndex, setEditIndex] = useState(null); // To track the item being edited

  // Fetch the payments data from the backend
  const fetchPayments = async () => {
    try {
      const response = await fetch("http://localhost/SavePayment.php");
      const data = await response.json();
  
      if (response.ok) {
        setPayments(data.data); // Store fetched payments in state
      } else {
        throw new Error("Failed to fetch payments");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setMessage("Error fetching payments");
      setOpenSnackbar(true);
    }
  };

  // Fetch payments when component mounts
  useEffect(() => {
    fetchPayments();
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const paymentData = { ...values };

      // Sending data to the PHP backend
      const response = await fetch("http://localhost/SavePayment.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData), // Sending as JSON
      });

      if (!response.ok) {
        throw new Error("Server response was not OK");
      }

      const result = await response.json(); // Assuming your PHP backend returns JSON response

      if (result.success) {
        setMessage("Payment submitted successfully");
        fetchPayments(); // Reload payments after submission
      } else {
        throw new Error("Error submitting payment");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
      resetForm();
    }
  };

  // Handle field changes in the form
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Reset form fields after submission
  const resetForm = () => {
    setFormData({
      supplierName: "",
      purchaseOrderNumber: "",
      amountPaid: 0,
      paymentMode: "",
      paymentDate: "",
    });
  };

  // Handle edit
  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(payments[index]);
  };

  // Handle delete
  const handleDelete = async (index) => {
    const paymentId = payments[index].id;
    try {
      const response = await fetch("http://localhost/deletePayment.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: paymentId }), // Send the payment ID to delete
      });

      if (response.ok) {
        const updatedPayments = payments.filter((_, i) => i !== index);
        setPayments(updatedPayments);
        setMessage("Payment deleted successfully");
        setOpenSnackbar(true);
      } else {
        setMessage("Error deleting payment data");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      setMessage("Error deleting payment data");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
        Supplier Payment Form
      </Typography>

      <DynamicForm
        formFields={supplierPaymentFields}
        onSubmit={handleSubmit}
        initialValues={formData}
        onChange={handleChange}
      />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={message}
      />

      {/* Table to display the list of payments */}
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
            {payments.map((payment, index) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.supplierName}</TableCell>
                <TableCell>{payment.purchaseOrderNumber}</TableCell>
                <TableCell>{payment.amountPaid}</TableCell>
                <TableCell>{payment.paymentMode}</TableCell>
                <TableCell>{payment.paymentDate}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(index)} sx={{ marginRight: 1 }}>
                    Edit
                  </Button>
                  <Button variant="outlined" onClick={() => handleDelete(index)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
};

export default SupplierPaymentForm;
