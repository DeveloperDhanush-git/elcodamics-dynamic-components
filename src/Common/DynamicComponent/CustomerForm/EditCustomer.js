import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";

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

const API_URL = "http://localhost/customer_form.php";

const CustomerForm = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch all customers from the backend
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

  // Handle form submission for both creating and updating customers
  const handleCustomerSubmit = async (values) => {
    console.log("Form submitted with values:", values); // Debugging line

    try {
      const method = values.id ? "PUT" : "POST"; // Check if it has an id (for update)
      
      // Ensure ModifiedOn is updated, but not CreatedOn
      const payload = { ...values };
      delete payload.CreatedOn; // Ensure CreatedOn is not included in the update request

      const response = await fetch(API_URL, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      alert(data.message);
      fetchCustomers(); // Refresh the customer list
      setSelectedCustomer(null); // Reset form after submission
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Handle customer deletion (soft delete)
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
      fetchCustomers(); // Refresh the customer list
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // Set the customer to be edited
  const handleEdit = (customer) => {
    console.log("Editing customer:", customer); // Debugging line
    setSelectedCustomer(customer);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <DynamicForm
        formTitle={selectedCustomer ? "Edit Customer" : "Add/Edit Customer Form"}
        formFields={customerFormFields}
        onSubmit={handleCustomerSubmit}
        initialValues={selectedCustomer || {}}
      />
      
      <h2 className="text-xl font-bold mt-6">Customer List</h2>
      <ul className="mt-4 border border-gray-200 rounded-md overflow-hidden">
        {customers.map((customer) => (
          <li key={customer.id} className="flex justify-between p-4 border-b last:border-b-0">
            <div>
              <p className="font-medium">{customer.customerName} ({customer.email})</p>
              <p className="text-gray-600 text-sm">Status: {customer.status}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(customer)} 
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(customer.id)} 
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerForm;
