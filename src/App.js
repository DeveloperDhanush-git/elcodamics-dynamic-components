import React from "react";
import PaymentReceiptForm from "./Common/DynamicComponent/AccountingForms/PaymentReceiptForm";
import TaxGstFilingForm from "./Common/DynamicComponent/AccountingForms/TaxGstFilingForm";
import ExpenseForm from "./Common/DynamicComponent/AccountingForms/ExpenseForm";




function App() {

  return (
    <div className="App">
      <ExpenseForm  /> 
        <PaymentReceiptForm />
      <TaxGstFilingForm />
      
    </div>
  );
}

export default App;
