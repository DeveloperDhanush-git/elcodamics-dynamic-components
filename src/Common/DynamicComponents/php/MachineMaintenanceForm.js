import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import {
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const machineMaintenanceFields = [
  {
    name: "machineName",
    label: "Machine Name",
    type: "select",
    options: [
      { label: "Machine 1", value: "machine1" },
      { label: "Machine 2", value: "machine2" },
    ],
    validation: { required: true },
  },
  {
    name: "issueType",
    label: "Issue Type",
    type: "select",
    options: [
      { label: "Electrical", value: "electrical" },
      { label: "Mechanical", value: "mechanical" },
    ],
    validation: { required: true },
  },
  {
    name: "priority",
    label: "Priority",
    type: "select",
    options: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ],
    validation: { required: true },
  },
  {
    name: "scheduledDate",
    label: "Scheduled Date",
    type: "date",
    validation: { required: true },
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    validation: { required: true },
  },
];

const API_URL = "http://localhost/MachineMaintenanceForm.php"; // Backend URL
const MachineMaintenanceForm = () => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [editingId, setEditingId] = useState(null); // Store ID of record being edited
  
    // Fetch existing records on component mount
    useEffect(() => {
      fetchMaintenanceData();
    }, []);
  
    // Fetch the data from the backend
    const fetchMaintenanceData = async () => {
      try {
        const response = await fetch(API_URL, { method: "GET" });
        const data = await response.json();
        setMaintenanceData(data); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching maintenance data:", error);
      }
    };
  
    // Handle changes in form fields
    const handleChange = (name, value) => {
      setFormData({ ...formData, [name]: value });
    };
  
    // Handle form submission
    const handleSubmit = async (values) => {
      if (loading) return; // Prevent multiple submissions
      try {
        setLoading(true); // Start loading
  
        const requestOptions = {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingId ? { ...values, id: editingId } : values),
        };
  
        const response = await fetch(API_URL, requestOptions);
        const result = await response.json();
  
        if (result.status === "success") {
          setMessage(result.message);
          setOpenSnackbar(true);
          setFormData({}); // Reset the form
          setEditingId(null); // Reset the editing ID
          fetchMaintenanceData(); // Refresh list after submission
        } else {
          setMessage(result.message || "Something went wrong.");
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error("Error submitting request:", error);
        setMessage("Error submitting request");
        setOpenSnackbar(true);
      } finally {
        setLoading(false); // End loading
      }
    };
  
    // Handle form population for editing
    const handleEdit = (id) => {
      const maintenanceToEdit = maintenanceData.find((item) => item.id === id);
      if (maintenanceToEdit) {
        setFormData({
          id: maintenanceToEdit.id,
          machineName: maintenanceToEdit.machine_name,
          issueType: maintenanceToEdit.issue_type,
          priority: maintenanceToEdit.priority,
          scheduledDate: maintenanceToEdit.scheduled_date,
          description: maintenanceToEdit.description,
        });
        setEditingId(maintenanceToEdit.id); // Set the editing ID for later use
      }
    };
  
    // Handle delete operation
    const handleDelete = async (id) => {
      try {
        await fetch(API_URL, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        setMessage("Maintenance request deleted successfully!");
        setOpenSnackbar(true);
        fetchMaintenanceData(); // Refresh the data
      } catch (error) {
        console.error("Error deleting maintenance data:", error);
        setMessage("Error deleting maintenance request");
        setOpenSnackbar(true);
      }
    };
  
    return (
      <>
    
        <DynamicForm
          formFields={machineMaintenanceFields}
          onSubmit={handleSubmit}
          formTitle={editingId ? "Edit Maintenance Request" : "Machine Maintenance Request"}
          formData={formData}
          onChange={handleChange}
        />
  
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6">Existing Maintenance Requests</Typography>
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Machine Name</TableCell>
                  <TableCell>Issue Type</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Scheduled Date</TableCell>
                  <TableCell>Description</TableCell> {/* Description column added */}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {maintenanceData.length > 0 ? (
                  maintenanceData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.machine_name}</TableCell>
                      <TableCell>{row.issue_type}</TableCell>
                      <TableCell>{row.priority}</TableCell>
                      <TableCell>{row.scheduled_date}</TableCell>
                      <TableCell>{row.description}</TableCell> {/* Display description */}
                      <TableCell>
                        <Button onClick={() => handleEdit(row.id)}>Edit</Button>
                        <Button onClick={() => handleDelete(row.id)} color="error">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
  
        {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message={message}
        />
      </>
    );
  };
  
  export default MachineMaintenanceForm;
  