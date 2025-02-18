import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import DynamicForm from "./DynamicForm";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";

const API_URL = "http://localhost/expence-entry-form.php";

const ExpenseForm = () => {
  const [formData, setFormData] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const formFields = [
    { name: "expenseType", label: "Expense Type", type: "select", options: [
        { label: "Please Select", value: "" },
        { label: "Office Supplies", value: "office_supplies" },
        { label: "Travel", value: "travel" },
        { label: "Utilities", value: "utilities" },
        { label: "Miscellaneous", value: "miscellaneous" }
      ]},
    { name: "amount", label: "Amount", type: "number" },
    { name: "date", label: "Date", type: "date" },
    { name: "paymentMode", label: "Payment Mode", type: "select", options: [
        { label: "Please Select", value: "" },
        { label: "Cash", value: "cash" },
        { label: "Credit Card", value: "credit_card" },
        { label: "Bank Transfer", value: "bank_transfer" }
      ]},
    { name: "notes", label: "Notes", type: "text" }
  ];

  const fetchFormData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (Array.isArray(data)) setFormData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => { fetchFormData(); }, []);

  const handleSubmit = async (values) => {
    const method = values.id ? "PUT" : "POST";
    try {
      const response = await fetch(API_URL, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const data = await response.json();
      alert(data.message);
      fetchFormData();
      setSelectedExpense(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (expense) => setSelectedExpense(expense);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await response.json();
      alert(data.message);
      fetchFormData();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>Expense Entry</Typography>
      <DynamicForm formFields={formFields} initialValues={selectedExpense || {}} onSubmit={handleSubmit} />
      <h2 className="text-xl font-bold mt-6">Expense List</h2>
      <TableContainer className="mt-4">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Expense Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Payment Mode</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.expenseType}</TableCell>
                <TableCell>₹{expense.amount}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.paymentMode}</TableCell>
                <TableCell>{expense.notes}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(expense)} color="primary"><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(expense.id)} color="secondary"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ExpenseForm;
