import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";

const leadFormFields = [
  { name: "leadName", label: "Lead Name", type: "text" },
  { name: "contactPerson", label: "Contact Person", type: "text" },
  { name: "phoneNumber", label: "Phone Number", type: "text" },
  { name: "email", label: "Email", type: "email" },
  {
    name: "leadSource",
    label: "Lead Source",
    type: "select",
    options: [
      { label: "Website", value: "website" },
      { label: "Referral", value: "referral" },
      { label: "Advertisement", value: "advertisement" },
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "New", value: "new" },
      { label: "In Progress", value: "in_progress" },
      { label: "Converted", value: "converted" },
    ],
  },
  { name: "notes", label: "Notes", type: "text" },
];

const API_URL = "http://localhost/lead_form.php";

const LeadForm = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  // Fetch all leads from the backend
  const fetchLeads = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Handle form submission for both creating and updating leads
  const handleLeadSubmit = async (values) => {
    console.log("Lead Form Submitted:", values);

    try {
      const method = values.id ? "PUT" : "POST"; // Check if it has an id (for update)

      // Create the lead data object to send to the backend
      const leadData = { ...values };

      const response = await fetch(API_URL, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      });

      const data = await response.json();
      alert(data.message);
      fetchLeads(); // Refresh the lead list
      setSelectedLead(null); // Reset form after submission
    } catch (error) {
      console.error("Error submitting the lead:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  // Handle lead deletion (soft delete)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      alert(data.message);
      fetchLeads(); // Refresh the lead list
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  // Set the lead to be edited
  const handleEdit = (lead) => {
    console.log("Editing lead:", lead);
    setSelectedLead(lead);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      
      <DynamicForm
        formTitle={selectedLead ? "Edit Lead" : "Lead Entry Form"}
        formFields={leadFormFields}
        onSubmit={handleLeadSubmit}
        initialValues={selectedLead || {}}
      />

      <h2 className="text-xl  mt-6" style={{fontFamily: "Montserrat",fontSize: "1.3rem",}}>Lead List</h2>
      <TableContainer className="mt-4">
        <Table sx={{ minWidth: 650 }} aria-label="lead table">
          <TableHead>
            <TableRow>
              <TableCell style={{fontFamily: "Montserrat",fontSize: "1.1rem",}}>Lead Name</TableCell>
              <TableCell style={{fontFamily: "Montserrat",fontSize: "1.1rem",}}>Email</TableCell>
              <TableCell style={{fontFamily: "Montserrat",fontSize: "1.1rem",}}>Status</TableCell>
              <TableCell style={{fontFamily: "Montserrat",fontSize: "1.1rem",}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell style={{fontFamily: "Montserrat",fontSize: "1.0rem",}}>{lead.leadName}</TableCell>
                <TableCell style={{fontFamily: "Montserrat",fontSize: "1.0rem",}}>{lead.email}</TableCell>
                <TableCell style={{fontFamily: "Montserrat",fontSize: "1.0rem",}}>{lead.status}</TableCell>
                <TableCell style={{fontFamily: "Montserrat",fontSize: "1.0rem",}}>
                  <div className="flex space-x-2">
                    <IconButton
                      onClick={() => handleEdit(lead)}
                      color="primary"
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(lead.id)}
                      color="secondary"
                      aria-label="delete"
                    >
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

export default LeadForm;
