import React, { useEffect, useState } from "react";
import DynamicForm from "./DynamicForm";

const StockAdjustmentForm = ({ onSubmit }) => {
  const [products, setProducts] = useState([]);

  // Fetch products dynamically (Simulated API Call)
  useEffect(() => {
    async function fetchProducts() {
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve([
              { label: "Laptop (Stock: 50)", value: "Laptop", stock: 50 },
              { label: "Mobile Phone (Stock: 30)", value: "Mobile Phone", stock: 30 },
              { label: "Headphones (Stock: 20)", value: "Headphones", stock: 20 },
            ]),
          500
        )
      );
      setProducts(response);
    }
    fetchProducts();
  }, []);

  const formFields = [
    {
      name: "productName",
      label: "Product Name",
      type: "select",
      options: [{ label: "Select Product", value: "" }, ...products],
      validation: { required: true },
    },
    {
      name: "adjustmentType",
      label: "Adjustment Type",
      type: "select",
      options: [
        { label: "Select Adjustment Type", value: "" },
        { label: "Increase", value: "increase" },
        { label: "Decrease", value: "decrease" },
      ],
      validation: { required: true },
    },
    { name: "quantity", label: "Quantity", type: "number", validation: { required: true } },
    { name: "reason", label: "Reason", type: "text", validation: { required: true } },
  ];

  const handleSubmit = (values) => {
    const selectedProduct = products.find((p) => p.value === values.productName);
    if (values.adjustmentType === "decrease" && Number(values.quantity) > selectedProduct?.stock) {
      alert("Error: Cannot decrease more than available stock!");
      return;
    }
    alert("Stock Adjustment Submitted Successfully!");
    console.log("Stock Adjustment Data:", values);
    onSubmit(values);
  };

  return <DynamicForm formFields={formFields} onSubmit={handleSubmit}  formTitle="STOCK ADJUSTMENT FORM"/>;
};

export default StockAdjustmentForm;
