import React from "react";
import DynamicForm from "./DynamicForm";

const leadFormFields = [
  { name: "leadName", label: "Lead Name", type: "text" },
  { name: "contactPerson", label: "Contact Person", type: "text" },
  { name: "phoneNumber", label: "Phone Number", type: "text" },
  { name: "email", label: "Email", type: "email" },
  {
    name: "leadSource",
    label: "Lead Source",
    type: "select",
    options: [
      { label: "Website", value: "website" },
      { label: "Referral", value: "referral" },
      { label: "Advertisement", value: "advertisement" }
    ]
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "New", value: "new" },
      { label: "In Progress", value: "in_progress" },
      { label: "Converted", value: "converted" }
    ]
  },
  { name: "notes", label: "Notes", type: "text" }
];

const handleLeadSubmit = (values) => {
  console.log("Lead Form Submitted:", values);
};

const LeadForm = () => (
  <div>

    <DynamicForm formTitle="Lead Entry Form" formFields={leadFormFields} onSubmit={handleLeadSubmit} />
  </div>
);

export default LeadForm;
