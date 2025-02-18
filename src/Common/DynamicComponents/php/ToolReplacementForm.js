import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import { Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Snackbar } from "@mui/material";

const toolReplacementFields = [
  { name: "oldToolName", label: "Old Tool Name", type: "select", options: [
      { label: "Tool A", value: "toolA" },
      { label: "Tool B", value: "toolB" }
    ], validation: { required: true }
  },
  { name: "newToolName", label: "New Tool Name", type: "select", options: [
      { label: "Tool X", value: "toolX" },
      { label: "Tool Y", value: "toolY" }
    ], validation: { required: true }
  },
  { name: "approvalStatus", label: "Approval Status", type: "select", options: [
      { label: "Pending", value: "pending" },
      { label: "Approved", value: "approved" },
      { label: "Rejected", value: "rejected" }
    ], validation: { required: true }
  },
  { name: "reason", label: "Reason for Replacement", type: "textarea", validation: { required: true } },
];

const ToolReplacementForm = () => {
  const [formData, setFormData] = useState({
    oldToolName: "",
    newToolName: "",
    approvalStatus: "",
    reason: "",
  });
  const [toolReplacements, setToolReplacements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tool replacements from the backend
  const fetchToolReplacements = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost/ToolReplacement.php");
      const data = await response.json();
      console.log("Fetched Data:", data); // Log the response to verify the structure
      if (Array.isArray(data)) {
        setToolReplacements(data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching tool replacements:", error);
      setMessage("Error fetching tool replacements");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToolReplacements(); // Fetch tool replacements on component mount
  }, []);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);

    try {
      const method = formData.id ? "PUT" : "POST";
      const url = "http://localhost/ToolReplacement.php";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setMessage(result.message);
      setOpenSnackbar(true);
      fetchToolReplacements(); // Fetch updated data after submission
      resetForm();
    } catch (error) {
      console.error("Error submitting form data:", error);
      setMessage("Error submitting form data");
      setOpenSnackbar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete action for a tool replacement
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tool replacement?")) {
      try {
        setLoading(true);
        const response = await fetch("http://localhost/ToolReplacement.php", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const result = await response.json();
        setMessage(result.message);
        setOpenSnackbar(true);
        fetchToolReplacements(); // Fetch updated data after deletion
      } catch (error) {
        console.error("Error deleting tool replacement:", error);
        setMessage("Error deleting tool replacement");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle form population for editing
  const handleEdit = (id) => {
    const replacementToEdit = toolReplacements.find((replacement) => replacement.id === id);
    if (replacementToEdit) {
      setFormData({
        id: replacementToEdit.id,
        oldToolName: replacementToEdit.oldToolName,
        newToolName: replacementToEdit.newToolName,
        approvalStatus: replacementToEdit.approvalStatus,
        reason: replacementToEdit.reason,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      oldToolName: "",
      newToolName: "",
      approvalStatus: "",
      reason: "",
    });
  };

  return (
    <>
      <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
        Tool Replacement Form
      </Typography>

      <DynamicForm
        formFields={toolReplacementFields}
        onSubmit={(values) => handleSubmit(values)}
        initialValues={formData}
        onChange={handleChange}
      />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
        Tool Replacements List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Old Tool Name</TableCell>
              <TableCell>New Tool Name</TableCell>
              <TableCell>Approval Status</TableCell>
              <TableCell>Reason for Replacement</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {toolReplacements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No tool replacements found.
                </TableCell>
              </TableRow>
            ) : (
              toolReplacements.map((replacement) => (
                <TableRow key={replacement.id}>
                  <TableCell>{replacement.id}</TableCell>
                  <TableCell>{replacement.oldToolName || "N/A"}</TableCell>
                  <TableCell>{replacement.newToolName || "N/A"}</TableCell>
                  <TableCell>{replacement.approvalStatus || "N/A"}</TableCell>
                  <TableCell>{replacement.reason || "N/A"}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(replacement.id)}>Edit</Button>
                    <Button onClick={() => handleDelete(replacement.id)} color="error">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={message}
      />
    </>
  );
};

export default ToolReplacementForm;
