import React from "react";
import DynamicForm from "./DynamicForm";

const supplierPaymentFields = [
  { name: "supplierName", label: "Supplier Name", type: "text", validation: { required: true } },
  { name: "purchaseOrderNumber", label: "Purchase Order Number", type: "text", validation: { required: true } },
  { name: "amountPaid", label: "Amount Paid", type: "text", validation: { required: true } },
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
  { name: "paymentDate", label: "Payment Date", type: "text", validation: { required: true } },
];

const SupplierPaymentForm = () => {
  const handleSubmit = (values) => {
    console.log("Supplier Payment Data:", values);
  };

  return <DynamicForm formFields={supplierPaymentFields} onSubmit={handleSubmit}  formTitle="SUPPLIERPAYMENTFORM"/>;
};

export default SupplierPaymentForm;
