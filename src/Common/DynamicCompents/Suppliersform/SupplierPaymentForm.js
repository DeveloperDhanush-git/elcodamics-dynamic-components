import React from "react";
import DynamicForm from "./DynamicForm";
import { Typography } from "@mui/material";

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
  const handleSubmit = (values) => {
    console.log("Supplier Payment Data:", values);
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
        Supplier Payment Form
      </Typography>
      <DynamicForm formFields={supplierPaymentFields} onSubmit={handleSubmit} formTitle="SUPPLIER PAYMENT FORM" />
    </>
  );
};

export default SupplierPaymentForm;
