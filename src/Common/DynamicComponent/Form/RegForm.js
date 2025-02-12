import React from "react";
import DynamicForm from "./DynamicFields";

const formFields = [
  { name: "fullName", label: "Full Name", type: "text", validation: { required: true } },
  { name: "email", label: "Email", type: "email", validation: { required: true } },
  { name: "password", label: "Password", type: "password", validation: { required: true } },
  {
    name: "gender",
    label: "Gender",
    type: "radio",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
    validation: { required: true },
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "United States", value: "us" },
      { label: "Canada", value: "canada" },
      { label: "United Kingdom", value: "uk" },
    ],
    validation: { required: true },
  },
  { name: "profilePicture", label: "Profile Picture", type: "file", validation: { required: false } },
  { name: "bio", label: "Short Bio", type: "text", validation: { required: false } },
];

const RegForm = () => {
  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };

  return <DynamicForm formFields={formFields} onSubmit={handleSubmit} />;
};

export default RegForm;
