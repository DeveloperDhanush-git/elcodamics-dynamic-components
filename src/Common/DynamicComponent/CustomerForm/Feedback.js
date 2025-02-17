import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";

const feedbackFormFields = [
  { name: "customerName", label: "Customer Name", type: "text" },
  { name: "issueCategory", label: "Issue Category", type: "select", options: [
      { label: "Billing", value: "billing" },
      { label: "Service", value: "service" },
      { label: "Product Quality", value: "product_quality" },
    ],
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
      { label: "Closed", value: "closed" },
    ],
  },
];

const API_URL = "http://localhost/feedback_form.php"; // Update with the appropriate backend URL

const FeedbackForm = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Fetch all feedback from the backend
  const fetchFeedback = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setFeedbackList(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Handle form submission for both creating and updating feedback
  const handleFeedbackSubmit = async (values) => {
    console.log("Feedback Form Submitted:", values);
  
    try {
      const method = values.id ? "PUT" : "POST"; // Check if it has an id (for update)
  
      const feedbackData = { ...values };
  
      const response = await fetch(API_URL, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });
  
      // Check if the response is valid JSON
      const textResponse = await response.text();
  
      try {
        const data = JSON.parse(textResponse); // Try parsing the text as JSON
  
        if (!response.ok) {
          throw new Error(data.error || 'An error occurred');
        }
  
        alert(data.message);
        fetchFeedback(); // Refresh the feedback list
        setSelectedFeedback(null); // Reset form after submission
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("An error occurred: " + textResponse);
      }
    } catch (error) {
      console.error("Error submitting the feedback:", error);
      alert("An error occurred while submitting the form: " + error.message);
    }
  };
  

  // Handle feedback deletion (soft delete)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;

    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      alert(data.message);
      fetchFeedback(); // Refresh the feedback list
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  // Set the feedback to be edited
  const handleEdit = (feedback) => {
    console.log("Editing feedback:", feedback);
    setSelectedFeedback(feedback);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <DynamicForm
        formTitle={selectedFeedback ? "Edit Feedback" : "Feedback/Complaint Form"}
        formFields={feedbackFormFields}
        onSubmit={handleFeedbackSubmit}
        initialValues={selectedFeedback || {}}
      />

      <h2 className="text-xl font-bold mt-6">Feedback List</h2>
      <ul className="mt-4 border border-gray-200 rounded-md overflow-hidden">
        {feedbackList.map((feedback) => (
          <li key={feedback.id} className="flex justify-between p-4 border-b last:border-b-0">
            <div>
              <p className="font-medium">{feedback.customerName} ({feedback.issueCategory})</p>
              <p className="text-gray-600 text-sm">Status: {feedback.status}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(feedback)} 
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(feedback.id)} 
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

export default FeedbackForm;
