import React from "react";
import DynamicForm from "./DynamicForm";
import { Typography } from "@mui/material";

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

const handleCustomerSubmit = async (values) => {
  try {
    
    const response = await fetch("http://localhost/customer-form.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName: values.customerName,
        contactNumber: values.contactNumber,
        email: values.email,
        address: values.address,
        gstNumber: values.gstNumber,
        businessType: values.businessType,
        status: values.status,
      }),
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("Customer record inserted successfully!");
    } else {
      console.error(result.message || "Failed to insert customer record");
      alert(result.message || "Failed to insert customer record");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Error submitting form");
  }
};

const CustomerForm = () => (
  <div>
    <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
      Add/Edit Customer Form
    </Typography>
    <DynamicForm formFields={customerFormFields} onSubmit={handleCustomerSubmit} />
  </div>
);

export default CustomerForm;
