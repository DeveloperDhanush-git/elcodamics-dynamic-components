import React from "react";
import DynamicForm from "./DynamicForm";
import { Typography } from "@mui/material";

const userFormFields = [
  {
    name: "userName",
    label: "User Name",
    type: "text"
  },
  {
    name: "email",
    label: "Email",
    type: "text"
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "text"
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "Manager", value: "manager" }
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

const handleUserFormSubmit = (values) => {
  console.log("User Form Submitted:", values);
};

const UserForm = () => (
  <div>
    <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
      Add/Edit User Form
    </Typography>
    <DynamicForm formFields={userFormFields} onSubmit={handleUserFormSubmit} />
  </div>
);

export default UserForm;
