import React from "react";
import DynamicForm from "./DynamicForm";


const formFields = [
  {
    name: "expenseType",
    label: "Expense Type",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Office Supplies", value: "office_supplies" },
      { label: "Travel", value: "travel" },
      { label: "Utilities", value: "utilities" },
      { label: "Miscellaneous", value: "miscellaneous" },
    ],
    validation: { required: true },
  },
  { 
    name: "amount", 
    label: "Amount", 
    type: "number", 
    validation: { required: true } 
  },
  { 
    name: "date", 
    label: "Date", 
    type: "date", 
    validation: { required: true } 
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
    name: "notes", 
    label: "Notes", 
    type: "textarea", 
    validation: { required: false } 
  },
];

const ExpenseForm = () => {
  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <div className="form-container">
      
      <DynamicForm formFields={formFields} onSubmit={handleSubmit} formTitle="Expense Entry Form" />
    </div>
  );
};

export default ExpenseForm;
