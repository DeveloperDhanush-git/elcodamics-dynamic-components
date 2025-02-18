import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import { Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Snackbar } from "@mui/material";

const purchaseOrderFields = [
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
    name: "productName",
    label: "Product Name",
    type: "multiselect",
    options: [
      { label: "Laptop", value: "laptop" },
      { label: "Mobile", value: "mobile" },
      { label: "Tablet", value: "tablet" },
      { label: "Monitor", value: "monitor" },
      { label: "Keyboard", value: "keyboard" },
    ],
    validation: { required: true },
  },
  { name: "quantity", label: "Quantity", type: "number", validation: { required: true, min: 1 } },
  { name: "unitPrice", label: "Unit Price", type: "text", validation: { required: true } },
  { name: "totalAmount", label: "Total Amount", type: "number", validation: { required: true }, readOnly: true },
  { name: "orderDate", label: "Order Date", type: "date", validation: { required: true } },
  { name: "expectedDeliveryDate", label: "Expected Delivery Date", type: "date", validation: { required: true } },
];

const PurchaseOrderForm = () => {
  const [formData, setFormData] = useState({
    supplierName: "",
    productName: [],
    quantity: 0,
    unitPrice: 0,
    totalAmount: 0,
    orderDate: "",
    expectedDeliveryDate: "",
  });
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Fetch purchase orders from the backend
  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost/ProductForm.php");
      const data = await response.json();
      setPurchaseOrders(data);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      setMessage("Error fetching purchase orders");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders(); // Fetch purchase orders on component mount
  }, []);

  // Handle field changes and recalculate total amount
  const handleChange = (name, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Recalculate totalAmount when quantity or unitPrice changes
      if (name === "quantity" || name === "unitPrice") {
        const quantity = parseFloat(updatedData.quantity) || 0;
        const unitPrice = parseFloat(updatedData.unitPrice) || 0;
        updatedData.totalAmount = quantity * unitPrice;
      }

      return updatedData;
    });
  };

  // Handle form submission (add or update purchase order)
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const method = formData.id ? "PUT" : "POST"; // Determine method based on whether it's a new order or edit
      const url = "http://localhost/ProductForm.php"; // PHP endpoint for processing form data
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setMessage(result.message);
      setOpenSnackbar(true);
      fetchPurchaseOrders(); // Refresh purchase orders after submission
      resetForm(); // Reset the form after submission
    } catch (error) {
      console.error("Error submitting form data:", error);
      setMessage("Error submitting form data");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete action for a purchase order
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this purchase order?")) {
      try {
        setLoading(true);
        const response = await fetch("http://localhost/ProductForm.php", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const result = await response.json();
        setMessage(result.message);
        setOpenSnackbar(true);
        fetchPurchaseOrders(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting purchase order:", error);
        setMessage("Error deleting purchase order");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle form population for editing
  const handleEdit = (id) => {
    const orderToEdit = purchaseOrders.find((order) => order.id === id);
    if (orderToEdit) {
      setFormData({
        id: orderToEdit.id,
        supplierName: orderToEdit.supplier_name,
        productName: orderToEdit.product_name.split(", "), // Convert string to array
        quantity: orderToEdit.quantity,
        unitPrice: orderToEdit.unit_price,
        totalAmount: orderToEdit.total_amount,
        orderDate: orderToEdit.order_date,
        expectedDeliveryDate: orderToEdit.expected_delivery_date,
      });
    }
  };

  // Reset form fields after submission
  const resetForm = () => {
    setFormData({
      supplierName: "",
      productName: [],
      quantity: 0,
      unitPrice: 0,
      totalAmount: 0,
      orderDate: "",
      expectedDeliveryDate: "",
    });
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
        Purchase Order Form
      </Typography>

      <DynamicForm
        formFields={purchaseOrderFields}
        onSubmit={(values) => handleSubmit(values)}
        initialValues={formData}
        onChange={handleChange}
      />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
        Purchase Orders List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Expected Delivery</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.supplier_name}</TableCell>
                <TableCell>{order.product_name}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.unit_price}</TableCell>
                <TableCell>{order.total_amount}</TableCell>
                <TableCell>{order.order_date}</TableCell>
                <TableCell>{order.expected_delivery_date}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(order.id)}>Edit</Button>
                  <Button onClick={() => handleDelete(order.id)} color="error">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={message}
      />
    </>
  );
};

export default PurchaseOrderForm;
