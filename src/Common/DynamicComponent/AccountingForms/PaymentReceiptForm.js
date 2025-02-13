import React from "react";
import DynamicForm from "./DynamicForm";
import { Typography } from "@mui/material";

const formFields = [
  {
    name: "customerVendorName",
    label: "Customer/Vendor Name",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Customer A", value: "customer_a" },
      { label: "Vendor B", value: "vendor_b" },
      { label: "Customer C", value: "customer_c" },
      { label: "Vendor D", value: "vendor_d" },
    ],
    validation: { required: true },
  },
  {
    name: "invoicePurchaseOrderNumber",
    label: "Invoice/Purchase Order Number",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "INV-12345", value: "inv_12345" },
      { label: "PO-67890", value: "po_67890" },
      { label: "INV-23456", value: "inv_23456" },
      { label: "PO-12345", value: "po_12345" },
    ],
    validation: { required: true },
  },
  {
    name: "amount",
    label: "Amount",
    type: "number",
    validation: { required: true },
  },
  {
    name: "paymentMode",
    label: "Payment Mode",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Cash", value: "cash" },
      { label: "Credit Card", value: "credit_card" },
      { label: "Bank Transfer", value: "bank_transfer" },
    ],
    validation: { required: true },
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    validation: { required: true },
  },
];

const PaymentReceiptForm = () => {
  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };

  return (
    
    <div className="form-container">
      <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
      Payment Receipt Form
      </Typography>
      <DynamicForm
        formFields={formFields}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default PaymentReceiptForm;
