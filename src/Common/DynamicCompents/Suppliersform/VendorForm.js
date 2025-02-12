import React from "react";
import DynamicForm from "./DynamicForm";

const vendorFields = [
  { name: "vendorName", label: "Vendor Name", type: "text", validation: { required: true } },
  { name: "contactPerson", label: "Contact Person", type: "text", validation: { required: true } },
  { name: "contactNumber", label: "Contact Number", type: "number", validation: { required: true } },
  { name: "email", label: "Email", type: "email", validation: { required: true } },
  { name: "gstNumber", label: "GST Number", type: "text", validation: { required: true } },
  {
    name: "businessType",
    label: "Business Type",
    type: "select",
    options: [{ label: "Retail", value: "retail" }, { label: "Wholesale", value: "wholesale" }],
    validation: { required: true },
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }],
    validation: { required: true },
  },
];

const VendorForm = () => {
  return <DynamicForm formFields={vendorFields} onSubmit={(values) => console.log(values)} formTitle="Vendor Form" />;
};

export default VendorForm;
