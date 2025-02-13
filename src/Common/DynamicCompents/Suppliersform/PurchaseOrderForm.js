import React, { useState } from "react";
import DynamicForm from "./DynamicForm";
import { Typography } from "@mui/material";

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
    type: "multi-select",
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

  return (
    <>
      <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
        Purchase Order Form
      </Typography>

      <DynamicForm
        formFields={purchaseOrderFields}
        onSubmit={(values) => console.log("Purchase Order Data:", values)}
        initialValues={formData} // Pass dynamic values
        onChange={handleChange} // Trigger updates
      />
    </>
  );
};

export default PurchaseOrderForm;
