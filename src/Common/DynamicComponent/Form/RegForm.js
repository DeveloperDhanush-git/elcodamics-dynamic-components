import React from "react";
import DynamicForm from "./DynamicFields";
import { Typography } from "@mui/material";

const formFields = [
  { name: "firstName", label: "First Name", type: "text", validation: { required: true } },
  { name: "lastName", label: "Last Name", type: "text", validation: { required: true } },
  { name: "email", label: "Email Address", type: "text", validation: { required: true } },
  { name: "company", label: "Company", type: "text", validation: { required: false } },
  { name: "physicalAddress", label: "Physical Address", type: "text", validation: { required: false } },
  { name: "dob", label: "Date of Birth", type: "date", validation: { required: true } },

];

const RegForm = () => {
  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <>
    <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
    Registration Form
  </Typography>
  <DynamicForm formFields={formFields} onSubmit={handleSubmit} />
  </>
  );
};

export default RegForm;
