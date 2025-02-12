import React from "react";
import DynamicForm from "./DynamicForm";

const feedbackFormFields = [
  {
    name: "customerName",
    label: "Customer Name",
    type: "select",
    options: [
      { label: "Customer A", value: "customer_a" },
      { label: "Customer B", value: "customer_b" }
    ]
  },
  {
    name: "issueCategory",
    label: "Issue Category",
    type: "select",
    options: [
      { label: "Billing", value: "billing" },
      { label: "Service", value: "service" },
      { label: "Product Quality", value: "product_quality" }
    ]
  },
  { name: "complaintDetails", label: "Complaint Details", type: "text" },
  { name: "attachments", label: "Attachments", type: "file" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Pending", value: "pending" },
      { label: "Resolved", value: "resolved" },
      { label: "Closed", value: "closed" }
    ]
  }
];

const handleFeedbackSubmit = (values) => {
  console.log("Feedback Form Submitted:", values);
};

const FeedbackForm = () => (
  <div>
    <DynamicForm formTitle="Customer Feedback/Complaint Form" formFields={feedbackFormFields} onSubmit={handleFeedbackSubmit} />
  </div>
);

export default FeedbackForm;
