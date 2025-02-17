import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";
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
      { label: "Wholesale", value: "wholesale" },
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
];
const API_URL = "http://localhost/customer_id.php";
const CustomerForm = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const fetchCustomers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const handleCustomerSubmit = async (values) => {
    console.log("Form submitted with values:", values); 
    try {
      const method = values.id ? "PUT" : "POST"; 
      
      const payload = { ...values };
      delete payload.CreatedOn; 
      const response = await fetch(API_URL, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      alert(data.message);
      fetchCustomers(); 
      setSelectedCustomer(null); 
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      alert(data.message);
      fetchCustomers(); 
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };
  
  const handleEdit = (customer) => {
    console.log("Editing customer:", customer);
    setSelectedCustomer(customer);
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
    <DynamicForm
      formTitle={selectedCustomer ? "Edit Customer" : "Add/Edit Customer Form"}
      formFields={customerFormFields}
      onSubmit={handleCustomerSubmit}
      initialValues={selectedCustomer || {}}
    />
    <h2 className="text-xl mt-6 fontFamily: Montserrat, sans-serif">Customer List</h2>
    <TableContainer className="mt-4">
      <Table sx={{ minWidth: 650 }} aria-label="customer table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontFamily: 'Montserrat, sans-serif' }} className="font-medium">Customer Name</TableCell>
            <TableCell sx={{ fontFamily: 'Montserrat, sans-serif' }} className="font-medium">Email</TableCell>
            <TableCell sx={{ fontFamily: 'Montserrat, sans-serif' }} className="font-medium">Status</TableCell>
            <TableCell sx={{ fontFamily: 'Montserrat, sans-serif' }} className="font-medium">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell sx={{ fontFamily: 'Montserrat, sans-serif' }}>{customer.customerName}</TableCell>
              <TableCell sx={{ fontFamily: 'Montserrat, sans-serif' }}>{customer.email}</TableCell>
              <TableCell sx={{ fontFamily: 'Montserrat, sans-serif' }}>{customer.status}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <IconButton
                    onClick={() => handleEdit(customer)}
                    color="primary"
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(customer.id)}
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
export default CustomerForm;
