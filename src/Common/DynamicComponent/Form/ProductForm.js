import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";

const API_URL = "http://localhost/products-form.php";

const productFormFields = [
  { name: "productName", label: "Product Name", type: "text" },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Electronics", value: "electronics" },
      { label: "Clothing", value: "clothing" },
      { label: "Home Appliances", value: "home_appliances" },
    ],
  },
  {
    name: "subCategory",
    label: "Sub-Category",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Mobile Phones", value: "mobile_phones" },
      { label: "Laptops", value: "laptops" },
      { label: "Accessories", value: "accessories" },
    ],
  },
  { name: "skuCode", label: "SKU Code", type: "text" },
  { name: "unitPrice", label: "Unit Price", type: "text" },
  { name: "stockQuantity", label: "Stock Quantity", type: "number" },
  { name: "reorderLevel", label: "Reorder Level", type: "number" },
  {
    name: "supplierName",
    label: "Supplier Name",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Supplier A", value: "supplier_a" },
      { label: "Supplier B", value: "supplier_b" },
      { label: "Supplier C", value: "supplier_c" },
    ],
  },
];

const ProductForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form submission for create/update
  const handleProductSubmit = async (values) => {
    try {
      const method = values.id ? "PUT" : "POST"; // PUT for edit, POST for new product
      const payload = { ...values, isActive: values.isActive ?? 1 };
  
      console.log("Submitting form:", payload); // Debugging
  
      const response = await fetch(API_URL, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      alert(data.message);
      fetchProducts();
      setSelectedProduct(null); // Reset after editing
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  

  // Handle product delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(API_URL, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();
        alert(data.message);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <DynamicForm
        formTitle={selectedProduct ? "Edit Product" : "Add Product"}
        formFields={productFormFields}
        onSubmit={handleProductSubmit}
        initialValues={selectedProduct || {}}
      />

      <h2 className="text-xl font-bold mt-6">Product List</h2>
      <ul className="mt-4 border border-gray-200 rounded-md overflow-hidden">
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product.id} className="flex justify-between p-4 border-b last:border-b-0">
              <div>
                <p className="font-medium">{product.productName}</p>
                <p className="text-gray-600 text-sm">Category: {product.category}</p>
                <p className="text-gray-500 text-xs">Last Modified: {product.modified_on}</p>
              </div>
              <div className="flex space-x-2">
              <button
  onClick={() => {
    console.log("Editing product:", product); // Debugging
    setSelectedProduct(product);
  }}
  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
>
  Edit
</button>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="p-4 text-center">No products available</p>
        )}
      </ul>
    </div>
  );
};

export default ProductForm;
