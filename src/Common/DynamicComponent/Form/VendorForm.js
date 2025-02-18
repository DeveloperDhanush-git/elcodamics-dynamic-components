import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import { Typography, Snackbar, Alert, Button, List, ListItem, ListItemText, Paper, Box, Divider, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from 'axios';

const API_URL = "http://localhost/vendors.php";

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
    validation: { required: true } 
  },
];

const VendorForm = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [vendorList, setVendorList] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log("Fetched data:", response.data);  // Log the fetched data
  
      // Access the 'data' property from the response
      if (response.data && Array.isArray(response.data.data)) {
        setVendorList(response.data.data);  // Use response.data.data to get the vendor list
      } else {
        console.error("Unexpected response format:", response.data);
        setSnackbar({ open: true, message: "Error fetching vendors", severity: "error" });
      }
    } catch (error) {
      // Log the full error for better debugging
      console.error("Error fetching vendors:", error);
  
      // Check if error response has a response object
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
  
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: "error" });
    }
  };
  

  const handleSubmit = async (values) => {
  const action = editingRecord ? "PUT" : "POST";
  const requestBody = { ...values, id: editingRecord?.id };

  try {
    const response = await axios({
      method: action,
      url: API_URL,
      headers: { "Content-Type": "application/json" },
      data: requestBody,
    });

    console.log("Response after submission:", response.data);  // Log the response
    setSnackbar({ open: true, message: response.data.message, severity: response.data.success ? "success" : "error" });

    if (response.data.success) {
      fetchVendors();
      setEditingRecord(null); // Clear the form by resetting editingRecord
      // Clear form fields by passing empty initial values to DynamicForm
    }
  } catch (error) {
    console.error("Error submitting vendor:", error);
    setSnackbar({ open: true, message: `Error: ${error.message}`, severity: "error" });
  }

  // Clear the form even if the submission fails
  setEditingRecord(null); // Reset the editing record to clear the form
};

  

  const handleEdit = (record) => setEditingRecord(record);

  const handleDelete = async (id) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: API_URL,
        headers: { "Content-Type": "application/json" },
        data: { id },
      });

      console.log("Delete Response:", response.data);  // Log the response
      setSnackbar({ open: true, message: response.data.message, severity: response.data.success ? "success" : "error" });

      if (response.data.success) fetchVendors();
    } catch (error) {
      console.error("Error deleting vendor:", error);
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: "error" });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3, bgcolor: "white", boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", mb: 3 }}>
        Vendor Management
      </Typography>

      {/* Dynamic Form */}
      <DynamicForm formFields={vendorFields} onSubmit={handleSubmit} initialValues={editingRecord || {}} />

      {/* Snackbar for feedback messages */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Vendors List */}
      <Typography variant="h6" sx={{ fontFamily: "Montserrat", mt: 4, mb: 2 }}>Registered Vendors</Typography>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        {vendorList.length === 0 ? (
          <Typography align="center" color="textSecondary">No vendors found.</Typography>
        ) : (
          <List>
            {vendorList.map((record) => (
              <React.Fragment key={record.id}>
                <ListItem sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <ListItemText
                    primary={`${record.vendorName} (${record.businessType})`}
                    secondary={`${record.contactPerson} - ${record.contactNumber}`}
                  />
                  <Box>
                    <IconButton color="primary" onClick={() => handleEdit(record)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(record.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default VendorForm;
