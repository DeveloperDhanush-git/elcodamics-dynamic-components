import React from "react";
import DynamicForm from "./DynamicForm";
import { Typography } from "@mui/material";

const roleFormFields = [
  {
    name: "roleName",
    label: "Role Name",
    type: "text"
  },
  {
    name: "accessLevel",
    label: "Access Level",
    type: "multiselect",
    options: [
      { label: "Read", value: "read" },
      { label: "Write", value: "write" },
      { label: "Delete", value: "delete" }
    ]
  },
  {
    name: "modulesAllowed",
    label: "Modules Allowed",
    type: "multiselect",
    options: [
      { label: "Dashboard", value: "dashboard" },
      { label: "Users", value: "users" },
      { label: "Settings", value: "settings" }
    ]
  }
];

const handleRoleFormSubmit = (values) => {
  console.log("Role Form Submitted:", values);
};

const RoleForm = () => (
  <div>
    <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
      Role Permission Form
    </Typography>
    <DynamicForm formFields={roleFormFields} onSubmit={handleRoleFormSubmit} />
  </div>
);

export default RoleForm;
