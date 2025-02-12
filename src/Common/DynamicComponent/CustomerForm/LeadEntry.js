import { useState } from "react";

const FormInput = ({ label, name, type = "text", value, onChange }) => (
  <div className="w-full md:w-1/3 px-2 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
    <label className="block">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded"
      required
    />
  </div>
);

export default function LeadEntryForm({ initialValues }) {
  const [formData, setFormData] = useState(initialValues || {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="p-6 bg-white shadow-lg rounded-lg w-full">
      <h2 className="text-2xl mb-4">Lead Entry</h2>
      <div className="flex flex-wrap -mx-2">
        <FormInput label="Lead Name" name="leadName" value={formData.leadName || ""} onChange={handleInputChange} />
        <FormInput label="Contact Person" name="contactPerson" value={formData.contactPerson || ""} onChange={handleInputChange} />
        <FormInput label="Phone Number" name="phone" type="text" value={formData.phone || ""} onChange={handleInputChange} />
        <FormInput label="Email" name="email" type="email" value={formData.email || ""} onChange={handleInputChange} />
        
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label className="block">Lead Source</label>
          <select
            name="source"
            value={formData.source || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Source</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Advertisement">Advertisement</option>
          </select>
        </div>

        <div className="w-full md:w-1/3 px-2 mb-4">
          <label className="block">Status</label>
          <select
            name="status"
            value={formData.status || "New"}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Converted">Converted</option>
          </select>
        </div>

        <div className="w-full px-2 mb-4">
          <label className="block">Notes</label>
          <textarea
            name="notes"
            value={formData.notes || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter any notes"
          ></textarea>
        </div>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}
