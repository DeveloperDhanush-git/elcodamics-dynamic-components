import React from "react";
import DynamicForm from "./DynamicForm";
import { Typography } from "@mui/material";

const WarehouseTransferForm = ({ products = [], warehouses = [], onSubmit }) => {
  const formFields = [
    {
      name: "productName",
      label: "Product Name",
      type: "select",
      options: [
        { label: "Please Select", value: "" },
        ...products.map((product) => ({ label: product, value: product })),
      ],
      validation: { required: true },
    },
    {
      name: "fromWarehouse",
      label: "From Warehouse",
      type: "select",
      options: [
        { label: "Please Select", value: "" },
        ...warehouses.map((warehouse) => ({ label: warehouse, value: warehouse })),
      ],
      validation: { required: true },
    },
    {
      name: "toWarehouse",
      label: "To Warehouse",
      type: "select",
      options: [
        { label: "Please Select", value: "" },
        ...warehouses.map((warehouse) => ({ label: warehouse, value: warehouse })),
      ],
      validation: { required: true },
    },
    { name: "quantity", label: "Quantity", type: "number", validation: { required: true, min: 1 } },
    { name: "transferDate", label: "Transfer Date", type: "date", validation: { required: true } },
  ];

  return (
    <>
      <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
        Warehouse Transfer Form
      </Typography>
      <DynamicForm formFields={formFields} onSubmit={onSubmit} />
    </>
  );
};

WarehouseTransferForm.defaultProps = {
  products: ["Product A", "Product B", "Product C"],
  warehouses: ["Coimbatore", "Chennai", "Bangalore"],
};

export default WarehouseTransferForm;
