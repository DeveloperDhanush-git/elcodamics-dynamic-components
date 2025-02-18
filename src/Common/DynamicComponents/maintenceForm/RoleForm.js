import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import { Typography } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";

const roleFormFields = [
  {
    name: "roleName",
    label: "Role Name",
    type: "text",
    validation: { required: true },
  },
  {
    name: "accessLevel",
    label: "Access Level",
    type: "multiselect",
    options: [
      { label: "Read", value: "read" },
      { label: "Write", value: "write" },
      { label: "Delete", value: "delete" },
    ],
    validation: { required: true },
  },
  {
    name: "modulesAllowed",
    label: "Modules Allowed",
    type: "multiselect",
    options: [
      { label: "Dashboard", value: "dashboard" },
      { label: "Users", value: "users" },
      { label: "Settings", value: "settings" },
    ],
    validation: { required: true },
  },
];

const API_URL = "http://localhost/role-form.php"; // Modify the URL as needed

const RoleForm = () => {
  const [roleFormValues, setRoleFormValues] = useState({
    roleName: "",
    accessLevel: [],
    modulesAllowed: [],
  });
  const [roleData, setRoleData] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState("");

  const fetchRoleData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setRoleData(data);
    } catch (error) {
      console.error("Error fetching role data:", error);
    }
  };

  useEffect(() => {
    fetchRoleData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoleFormValues((prev) => ({
      ...prev,
      [name]: Array.isArray(value) ? value : value.split(",").filter(Boolean),
    }));
  };

  const handleRoleFormSubmit = async (values) => {
    try {
      const method = values.id ? "PUT" : "POST";
      const payload = {
        roleName: values.roleName,
        accessLevel: Array.isArray(values.accessLevel)
          ? values.accessLevel.join(", ")
          : values.accessLevel,
        modulesAllowed: Array.isArray(values.modulesAllowed)
          ? values.modulesAllowed.join(", ")
          : values.modulesAllowed,
        id: values.id || undefined,
      };

      const response = await fetch(API_URL, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      alert(result.message);
      fetchRoleData();
      setSelectedRole(null);
    } catch (error) {
      console.error("Error submitting role form:", error);
      setError("Error submitting form");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      alert(result.message);
      fetchRoleData();
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setRoleFormValues({
      roleName: role.roleName || "",
      accessLevel: Array.isArray(role.accessLevel)
        ? role.accessLevel
        : role.accessLevel?.split(", ").filter(Boolean) || [],
      modulesAllowed: Array.isArray(role.modulesAllowed)
        ? role.modulesAllowed
        : role.modulesAllowed?.split(", ").filter(Boolean) || [],
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
        Role Permission Form
      </Typography>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <DynamicForm
        formFields={roleFormFields.map((field) => ({
          ...field,
          value: roleFormValues[field.name],
          onChange: handleInputChange,
        }))}
        onSubmit={handleRoleFormSubmit}
        initialValues={selectedRole || {}}
      />

      <h2 className="text-xl font-bold mt-6">Role List</h2>
      <TableContainer className="mt-4">
        <Table sx={{ minWidth: 650 }} aria-label="role table">
          <TableHead>
            <TableRow>
              <TableCell className="font-medium">Role Name</TableCell>
              <TableCell className="font-medium">Access Level</TableCell>
              <TableCell className="font-medium">Modules Allowed</TableCell>
              <TableCell className="font-medium">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roleData.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.roleName}</TableCell>
                <TableCell>{role.accessLevel}</TableCell>
                <TableCell>{role.modulesAllowed}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <IconButton onClick={() => handleEdit(role)} color="primary" aria-label="edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(role.id)} color="secondary" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RoleForm;
