import React from "react";
import DynamicForm from "./DynamicForm";

const customerFormFields = [
  { name: "customerName", label: "Customer Name", type: "text" },
  { name: "contactNumber", label: "Contact Number", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "address", label: "Address", type: "text" },
  { name: "gstNumber", label: "GST Number", type: "text" },
  {
    name: "businessType",
    label: "Business Type",
    type: "select",
    options: [
      { label: "Retail", value: "retail" },
      { label: "Wholesale", value: "wholesale" }
    ]
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" }
    ]
  }
];

const handleCustomerSubmit = (values) => {
  console.log("Customer Form Submitted:", values);
};

const CustomerForm = () => (
  <div>
    <DynamicForm formTitle="Add/Edit Customer Form" formFields={customerFormFields} onSubmit={handleCustomerSubmit} />
  </div>
);

export default CustomerForm;
