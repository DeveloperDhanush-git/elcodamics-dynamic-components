import React from "react";
import DynamicForm from "./DynamicFields";

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
  {
    name: "productFreshness",
    label: "Product Freshness",
    type: "radio",
    options: [
      { label: "Brand New", value: "brand_new" },
      { label: "Second Hand", value: "second_hand" },
      { label: "Refurbished", value: "refurbished" },
    ],
    validation: { required: true },
  },
  { name: "productImage", label: "Image of Product", type: "file", validation: { required: false } },
  { name: "additionalDescription", label: "Additional Description", type: "text", validation: { required: false } },
  { name: "productPrice", label: "Product Price", type: "text", validation: { required: true } },
  { name: "comments", label: "Comments", type: "text", validation: { required: false } },
];

const ProductForm = () => {
  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };

  return <DynamicForm formFields={formFields} onSubmit={handleSubmit} />;
};

export default ProductForm;
