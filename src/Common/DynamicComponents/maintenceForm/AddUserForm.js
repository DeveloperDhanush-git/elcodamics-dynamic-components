import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import { Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const API_URL = "http://localhost/role-form.php"; // API endpoint for managing roles

const RoleManagement = () => {
  const [formData, setFormData] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  // Define the form fields for role records
  const roleFormFields = [
    { name: "roleName", label: "Role Name", type: "text" },
    { name: "accessLevel", label: "Access Level", type: "multiselect", options: [
        { label: "Read", value: "read" },
        { label: "Write", value: "write" },
        { label: "Delete", value: "delete" },
      ]
    },
    { name: "modulesAllowed", label: "Modules Allowed", type: "multiselect", options: [
        { label: "Dashboard", value: "dashboard" },
        { label: "Users", value: "users" },
        { label: "Settings", value: "settings" },
      ]
    }
  ];

  // Fetch the list of role records from the backend
  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (Array.isArray(data)) {
        setFormData(data);
      } else {
        console.error("Invalid data format received:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form submission for both creating and updating role records
  const handleFormSubmit = async (values) => {
    const isEdit = Boolean(values.id);
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(API_URL, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const text = await response.text();
      console.log("Server Response:", text);
      const data = JSON.parse(text);
      alert(data.message);
      fetchData();
      setSelectedRole(null);
    } catch (error) {
      console.error("Form submission failed:", error);
      alert("Failed to submit form. Check console for details.");
    }
  };

  // Set the selected record into state to populate the form for editing
  const handleEdit = (role) => {
    setSelectedRole(role);
  };

  // Handle record deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      alert(data.message);
      fetchData();
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Error deleting role");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>
        {selectedRole ? "Edit Role" : "Add Role"}
      </Typography>

      <DynamicForm
        formFields={roleFormFields}
        initialValues={selectedRole || {}}
        onSubmit={handleFormSubmit}
      />

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Role List
      </Typography>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="role table">
          <TableHead>
            <TableRow>
              <TableCell>Role Name</TableCell>
              <TableCell>Access Level</TableCell>
              <TableCell>Modules Allowed</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.roleName}</TableCell>
                <TableCell>{role.accessLevel}</TableCell>
                <TableCell>{role.modulesAllowed}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(role)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(role.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RoleManagement;
