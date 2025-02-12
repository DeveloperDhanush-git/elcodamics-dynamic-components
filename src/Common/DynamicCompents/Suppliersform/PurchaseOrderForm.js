import React, { useState } from "react";
import DynamicForm from "./DynamicForm";

const purchaseOrderFields = [
  { name: "supplierName", label: "Supplier Name", type: "text", validation: { required: true } },
  {
    name: "productName",
    label: "Product Name",
    type: "select",
    options: [
      { label: "Laptop", value: "laptop" },
      { label: "Mobile", value: "mobile" },
    ],
    validation: { required: true },
  },
  { name: "quantity", label: "Quantity", type: "number", validation: { required: true } },
  { name: "unitPrice", label: "Unit Price", type: "number", validation: { required: true } },
  { name: "totalAmount", label: "Total Amount", type: "number", validation: { required: true }, readOnly: true },
  { name: "orderDate", label: "Order Date", type: "date", validation: { required: true } },
  { name: "expectedDeliveryDate", label: "Expected Delivery Date", type: "date", validation: { required: true } },
];

const PurchaseOrderForm = () => {
  const [formData, setFormData] = useState({
    quantity: 0,
    unitPrice: 0,
    totalAmount: 0,
  });

  const handleChange = (name, value) => {
    let updatedData = { ...formData, [name]: value };
  
    // Auto-calculate Total Amount
    if (name === "quantity" || name === "unitPrice") {
      const quantity = updatedData.quantity || 0;
      const unitPrice = updatedData.unitPrice || 0;
      updatedData.totalAmount = quantity * unitPrice;
    }
  
    setFormData(updatedData);
    
  };


  const handleSubmit = (values) => {
    console.log("Purchase Order Data:", { ...values, ...formData });
  };

  return (
    <DynamicForm
      formFields={purchaseOrderFields}
      onSubmit={handleSubmit}
      formTitle="Purchase Order Form"
      formData={formData}
      onChange={handleChange} // Pass the change handler
    />
  );
};

export default PurchaseOrderForm;
