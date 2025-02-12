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

export default function CustomerFeedbackForm({ initialValues }) {
  const [formData, setFormData] = useState(initialValues || {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="p-6 bg-white shadow-lg rounded-lg w-full">
      <h2 className="text-2xl mb-4">Customer Feedback</h2>
      <div className="flex flex-wrap -mx-3">
        <FormInput label="Customer Name" name="customerName" value={formData.customerName || ""} onChange={handleInputChange} />

        <div className="w-full md:w-1/3 px-2 mb-4">
          <label className="block">Issue Category</label>
          <select   
            name="issueCategory"
            value={formData.issueCategory || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Issue Category</option>
            <option value="Service">Service</option>
            <option value="Product">Product</option>
          </select>
        </div>

        <div className="w-full px-2 mb-4 md:w-1/3 ">
          <label className="block">Attachments</label>
          <input
            type="file"
            name="attachment"
            onChange={(e) => setFormData({ ...formData, attachment: e.target.files[0] })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="w-full px-2 mb-4">
          <label className="block">Complaint Details</label>
          <textarea
            name="details"
            value={formData.details || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Describe the issue in detail"
          ></textarea>
        </div>

        

        <div className="w-full md:w-1/3 px-2 mb-4">
          <label className="block">Status</label>
          <select
            name="status"
            value={formData.status || "Pending"}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}
