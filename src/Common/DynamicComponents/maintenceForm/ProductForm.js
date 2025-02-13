import React from "react";
import DynamicForm from "./DynamicForm";

const formFields = [
  {
    name: "productName",
    label: "Product Name",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Product A", value: "product_a" },
      { label: "Product B", value: "product_b" },
      { label: "Product C", value: "product_c" },
    ],
    validation: { required: true },
  },
  {
    name: "fromWarehouse",
    label: "From Warehouse",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Warehouse 1", value: "warehouse_1" },
      { label: "Warehouse 2", value: "warehouse_2" },
      { label: "Warehouse 3", value: "warehouse_3" },
    ],
    validation: { required: true },
  },
  {
    name: "toWarehouse",
    label: "To Warehouse",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Warehouse 1", value: "warehouse_1" },
      { label: "Warehouse 2", value: "warehouse_2" },
      { label: "Warehouse 3", value: "warehouse_3" },
    ],
    validation: { required: true },
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "number",
    validation: { required: true, min: 1 },
  },
  {
    name: "transferDate",
    label: "Transfer Date",
    type: "date",
    validation: { required: true },
  },
];

const WarehouseTransferForm = () => {
  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <DynamicForm
      formFields={formFields}
      onSubmit={handleSubmit}
      formTitle="Warehouse Transfer Form"
    />
  );
};

export default WarehouseTransferForm;
