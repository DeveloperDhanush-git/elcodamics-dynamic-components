import React from "react";
import DynamicForm from "./DynamicFields";
import { Typography } from "@mui/material";

const formFields = [
  { name: "productName", label: "Product Name", type: "text", validation: { required: true } },
  {
    name: "productCategory",
    label: "Product Category",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Electronics", value: "electronics" },
      { label: "Clothing", value: "clothing" },
    ],
    validation: { required: true },
  },
  { name: "productPrice", label: "Product Price", type: "text", validation: { required: true } },
  {
    name: "productFreshness",
    label: "Product Freshness",
    type: "select",
    options: [
      { label: "Please select", value: "" },
      { label: "Brand New", value: "brand_new" },
      { label: "Second Hand", value: "second_hand" },
      { label: "Refurbished", value: "refurbished" },
    ],
    validation: { required: true },
  },
  { name: "additionalDescription", label: "Additional Description", type: "text", validation: { required: false } },
  { name: "comments", label: "Comments", type: "text", validation: { required: false } },
  {},
  { name: "productImage", label: "Image of Product", type: "file", validation: { required: false } },
];

const ProductForm = () => {
  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
        Product Form
      </Typography>
      <DynamicForm formFields={formFields} onSubmit={handleSubmit} />
    </>
  );
};

export default ProductForm;
