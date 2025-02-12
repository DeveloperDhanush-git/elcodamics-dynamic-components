import { useState } from "react";

const FormInput = ({ label, name, type = "text", value, onChange }) => (
  <div className="w-full md:w-1/3 px-2 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
    <label className="block">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} className="w-full p-2 border rounded" required />
  </div>
);

export default function CustomerEditForm({ initialValues }) {
  const [formData, setFormData] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Customer Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.contact || !/^\d{10}$/.test(formData.contact)) newErrors.contact = "Invalid contact number";
   
      
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
    }
  };


  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded-lg w-full">
      <h2 className="text-2xl mb-4">Add/Edit Customer</h2>
      <div className="flex flex-wrap -mx-2">
        <FormInput label="Customer Name" name="name" value={formData.name || ""} onChange={handleInputChange} />
        <FormInput label="Contact Number" name="contact" type="text" value={formData.contact || ""} onChange={handleInputChange} />
        <FormInput label="Email" name="email" type="email" value={formData.email || ""} onChange={handleInputChange} />

        <div className="w-full md:w-1/3 px-2 mb-3">
  <label className="block">Address</label>
  <textarea 
    name="address" 
    value={formData.address || ""} 
    onChange={handleInputChange} 
    className="w-full p-2 border rounded" 
    rows="2" 
    required
  ></textarea>
</div>
<FormInput 
  label="GST Number" 
  name="gst" 
  value={formData.gst || ""} 
  onChange={handleInputChange} 
/>


        <div className="w-full md:w-1/3 px-2 mb-4">
          <label className="block">Business Type</label>
          <select name="businessType" value={formData.businessType || ""} onChange={handleInputChange} className="w-full p-2 border rounded">
            <option value="">Select Business Type</option>
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
          </select>
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label className="block ">Status</label>
          <select name="status" value={formData.status || "Active"} onChange={handleInputChange} className="w-full p-2 border rounded">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex gap-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
        
      </div>
      {Object.keys(errors).map((key) => (
        <p key={key} className="text-red-500">{errors[key]}</p>
      ))}
    </form>
  );
}
