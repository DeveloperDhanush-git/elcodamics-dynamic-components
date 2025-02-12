import CustomerEditForm from "./Common/DynamicComponent/CustomerForm/EditCustomer";
import LeadEntryForm from "./Common/DynamicComponent/CustomerForm/LeadEntry";
import CustomerFeedbackForm from "./Common/DynamicComponent/CustomerForm/Feedback";

function App() {
  const formData = {
    customerEdit: {
      name: "",
      contact: "",
      email: "",
      address: "",
      gst: "",
      businessType: "",
      status: "",
    },
    leadEntry: {
      leadName: "",
      contactPerson: "",
      phone: "",
      email: "",
      source: "",
      status: "",
      notes: "",
    },
    customerFeedback: {
      customerName: "",
      issueCategory: "",
      details: "",
      status: "",
    },
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6"style={{ fontFamily: "Montserrat, sans-serif" }}>

      <CustomerEditForm initialValues={formData.customerEdit} />
<LeadEntryForm initialValues={formData.leadEntry} />
<CustomerFeedbackForm initialValues={formData.customerFeedback} />

    </div>
  );
}

export default App;
