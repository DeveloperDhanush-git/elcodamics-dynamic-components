import React, { useState, useEffect } from "react";
import DynamicForm from "./Dynamic";
import { Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

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

  // Fetch purchase orders function
  const fetchPurchaseOrders = async () => {
    try {
      const response = await fetch("http://localhost/api.php");
      const data = await response.json();
      setPurchaseOrders(data);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    }
  };

  // Fetch purchase orders when the component mounts
  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      if (name === "quantity" || name === "unitPrice") {
        const quantity = parseFloat(updatedData.quantity) || 0;
        const unitPrice = parseFloat(updatedData.unitPrice) || 0;
        updatedData.totalAmount = quantity * unitPrice;
      }

      return updatedData;
    });
  };

  const handleSubmit = async (formData) => {
    try {
      const method = formData.id ? "PUT" : "POST";
      const url = "http://localhost/api.php";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(result.message);
      fetchPurchaseOrders(); // Refresh the list after submit
      resetForm(); // Reset form after submission
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch("http://localhost/api.php", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      console.log(result.message);
      fetchPurchaseOrders();
    } catch (error) {
      console.error("Error deleting purchase order:", error);
    }
  };

  const handleEdit = (id) => {
    const orderToEdit = purchaseOrders.find((order) => order.id === id);
    console.log("Editing order:", orderToEdit); // Check the order data here
    if (orderToEdit) {
      setFormData({
        id: orderToEdit.id,
        supplierName: orderToEdit.supplier_name,
        productName: orderToEdit.product_name.split(", "), // Convert to array
        quantity: orderToEdit.quantity,
        unitPrice: orderToEdit.unit_price,
        totalAmount: orderToEdit.total_amount,
        orderDate: orderToEdit.order_date,
        expectedDeliveryDate: orderToEdit.expected_delivery_date,
      });
    }
  };

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
        onSubmit={(values) => {
          handleSubmit(values);
        }}
        initialValues={formData}
        onChange={handleChange}
      />

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
    </>
  );
};

export default PurchaseOrderForm;
