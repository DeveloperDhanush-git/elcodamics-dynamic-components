import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";

const API_URL = "http://localhost/warehousetransfer.php";

const warehouseTransferFormFields = [
  {
    name: "productName",
    label: "Product Name",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Product A", value: "Product A" },
      { label: "Product B", value: "Product B" },
      { label: "Product C", value: "Product C" },
    ],
  },
  {
    name: "fromWarehouse",
    label: "From Warehouse",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Coimbatore", value: "Coimbatore" },
      { label: "Chennai", value: "Chennai" },
      { label: "Bangalore", value: "Bangalore" },
    ],
  },
  {
    name: "toWarehouse",
    label: "To Warehouse",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Coimbatore", value: "Coimbatore" },
      { label: "Chennai", value: "Chennai" },
      { label: "Bangalore", value: "Bangalore" },
    ],
  },
  { name: "quantity", label: "Quantity", type: "number" },
  { name: "transferDate", label: "Transfer Date", type: "date" },
];

const WarehouseTransferForm = () => {
  const [transfers, setTransfers] = useState([]);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  // Fetch warehouse transfers from the backend
  const fetchTransfers = async () => {
    try {
      const response = await fetch(API_URL);
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);

      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }

      const text = await response.text();
      console.log("Raw Response:", text);

      if (text.startsWith("<")) {
        throw new Error("Response is HTML, not JSON. Check server error logs.");
      }

      let data;
      try {
        data = JSON.parse(text);
        if (!Array.isArray(data)) {
          throw new Error("Expected an array but got something else.");
        }
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        throw new Error("Failed to parse JSON response");
      }

      // Convert backend field names to frontend-friendly format
      const formattedData = data.map((item) => ({
        id: item.id,
        productName: item.product_name,
        fromWarehouse: item.from_warehouse,
        toWarehouse: item.to_warehouse,
        quantity: item.quantity,
        transferDate: item.transfer_date,
      }));

      setTransfers(formattedData);
    } catch (error) {
      console.error("Error fetching transfers:", error);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  // Handle form submission for create/update
  const handleTransferSubmit = async (values) => {
    console.log("Form Values:", values);

    const dataToSend = {
      product_name: values.productName,
      from_warehouse: values.fromWarehouse,
      to_warehouse: values.toWarehouse,
      quantity: values.quantity,
      transfer_date: values.transferDate,
      is_active: 1,
      is_deleted: 0,
    };

    try {
      const method = values.id ? "PUT" : "POST";
      const response = await fetch(API_URL, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const text = await response.text();
      console.log("Raw Response:", text);

      if (text.startsWith("<")) {
        throw new Error("Response is HTML, not JSON. Check server error logs.");
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        throw new Error("Failed to parse JSON response");
      }

      alert(data.message);
      fetchTransfers();
      setSelectedTransfer(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Handle transfer delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transfer?")) {
      try {
        const response = await fetch(API_URL, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();
        alert(data.message);
        fetchTransfers();
      } catch (error) {
        console.error("Error deleting transfer:", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <DynamicForm
        formTitle={selectedTransfer ? "Edit Transfer" : "Add Transfer"}
        formFields={warehouseTransferFormFields}
        onSubmit={handleTransferSubmit}
        initialValues={selectedTransfer || {}}
      />

      <h2 className="text-xl font-bold mt-6">Transfer List</h2>
      <ul className="mt-4 border border-gray-200 rounded-md overflow-hidden">
        {transfers.length > 0 ? (
          transfers.map((transfer) => (
            <li key={transfer.id} className="flex justify-between p-4 border-b last:border-b-0">
              <div>
                <p className="font-medium">{transfer.productName}</p>
                <p className="text-gray-600 text-sm">
                  From: {transfer.fromWarehouse} → To: {transfer.toWarehouse}
                </p>
                <p className="text-gray-500 text-xs">
                  Quantity: {transfer.quantity} | Transfer Date: {transfer.transferDate}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTransfer(transfer)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(transfer.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="p-4 text-center">No transfers available</p>
        )}
      </ul>
    </div>
  );
};

export default WarehouseTransferForm;
