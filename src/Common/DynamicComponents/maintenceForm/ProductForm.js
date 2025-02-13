import React from "react";
import DynamicForm from "./DynamicForm";
import { Typography } from "@mui/material";

const formFields = [
  {
    name: "productName",
    label: "Product Name",
    type: "text",
    validation: { required: true },
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Electronics", value: "electronics" },
      { label: "Clothing", value: "clothing" },
      { label: "Home Appliances", value: "home_appliances" },
    ],
    validation: { required: true },
  },
  {
    name: "subCategory",
    label: "Sub-Category",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Mobile Phones", value: "mobile_phones" },
      { label: "Laptops", value: "laptops" },
      { label: "Accessories", value: "accessories" },
    ],
    validation: { required: true },
  },
  {
    name: "skuCode",
    label: "SKU Code",
    type: "text",
    validation: { required: true },
  },
  {
    name: "unitPrice",
    label: "Unit Price",
    type: "text",
    validation: { required: true, pattern: "^[0-9]*\\.?[0-9]+$" },
  },
  {
    name: "stockQuantity",
    label: "Stock Quantity",
    type: "number",
    validation: { required: true, min: 0 },
  },
  {
    name: "reorderLevel",
    label: "Reorder Level",
    type: "number",
    validation: { required: true, min: 0 },
  },
  {
    name: "supplierName",
    label: "Supplier Name",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Supplier A", value: "supplier_a" },
      { label: "Supplier B", value: "supplier_b" },
      { label: "Supplier C", value: "supplier_c" },
    ],
    validation: { required: true },
  },
];

const AddEditProductForm = () => {
  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
        Add/Edit Product Form
      </Typography>
      <DynamicForm formFields={formFields} onSubmit={handleSubmit} />
    </>
  );
};

export default AddEditProductForm;
