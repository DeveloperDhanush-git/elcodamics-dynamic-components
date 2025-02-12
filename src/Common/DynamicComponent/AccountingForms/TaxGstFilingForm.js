import React, { useState } from "react";
import DynamicForm from "./DynamicForm";

const formFields = [
  {
    name: "invoiceNumber",
    label: "Invoice Number",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "INV-12345", value: "inv_12345" },
      { label: "INV-67890", value: "inv_67890" },
      { label: "INV-23456", value: "inv_23456" },
      { label: "INV-98765", value: "inv_98765" },
    ],
    validation: { required: true },
  },
  {
    name: "gstType",
    label: "GST Type",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "CGST + SGST", value: "cgst_sgst" },
      { label: "IGST", value: "igst" },
    ],
    validation: { required: true },
  },
  {
    name: "amount",
    label: "Amount",
    type: "number",
    value: 0,
    validation: { required: true },
    disabled: true, // Auto-calculated value
  },
  {
    name: "filingDate",
    label: "Filing Date",
    type: "date",
    validation: { required: true },
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Filed", value: "filed" },
      { label: "Pending", value: "pending" },
    ],
    validation: { required: true },
  },
];

const TaxGstFilingForm = () => {
  const [invoiceAmount, setInvoiceAmount] = useState(0);
  const [gstType, setGstType] = useState("");

  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };

  const calculateAmount = (gstType, invoiceAmount) => {
    if (!invoiceAmount) return 0;
    let gstRate = 0;
    switch (gstType) {
      case "cgst_sgst":
        gstRate = 9; // 9% for CGST + SGST
        break;
      case "igst":
        gstRate = 18; // 18% for IGST
        break;
      default:
        gstRate = 0;
    }
    return (invoiceAmount * (gstRate / 100)) + invoiceAmount;
  };

  // Whenever the GST Type or Invoice Amount changes, recalculate the amount
  const handleGstChange = (event) => {
    const selectedGstType = event.target.value;
    setGstType(selectedGstType);
    const calculatedAmount = calculateAmount(selectedGstType, invoiceAmount);
    setInvoiceAmount(calculatedAmount);
  };

  const handleAmountChange = (event) => {
    const enteredAmount = parseFloat(event.target.value);
    setInvoiceAmount(enteredAmount);
  };

  return (
    <div className="form-container">
      <DynamicForm
        formFields={formFields.map((field) => {
          if (field.name === "amount") {
            field.value = invoiceAmount;
          }
          if (field.name === "gstType") {
            field.onChange = handleGstChange;
          }
          if (field.name === "amount") {
            field.onChange = handleAmountChange;
          }
          return field;
        })}
        onSubmit={handleSubmit}
        formTitle="Tax/GST Filing Form"
      />
    </div>
  );
};

export default TaxGstFilingForm;
