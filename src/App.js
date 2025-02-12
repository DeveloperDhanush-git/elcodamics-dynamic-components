import React from "react";
import CustomerForm from "./Common/DynamicComponent/CustomerForm/EditCustomer";
import LeadForm from "./Common/DynamicComponent/CustomerForm/LeadEntry";
import FeedbackForm from "./Common/DynamicComponent/CustomerForm/Feedback";

const FormContainer = () => {
  return (
    <div>
      <CustomerForm />
      <LeadForm />
      <FeedbackForm />
    </div>
  );
};

export default FormContainer;
