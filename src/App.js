import React from "react";
import PaymentReceiptForm from "./Common/DynamicComponent/AccountingForms/PaymentReceiptForm";
import TaxGstFilingForm from "./Common/DynamicComponent/AccountingForms/TaxGstFilingForm";
import ExpenseForm from "./Common/DynamicComponent/AccountingForms/ExpenseForm";
//import Example from "./Common/DynamicComponent/AccountingForms/Example";



function App() {
  // const expenseTypes = ["Travel", "Food", "Office Supplies", "Utilities", "Other"];
  // const paymentModes = ["Cash", "Credit Card", "Debit Card", "UPI", "Bank Transfer"];

  return (
    <div className="App">
      <ExpenseForm  /> 
        <PaymentReceiptForm />
      <TaxGstFilingForm />
      {/* <Example /> */}
    </div>
  );
}

export default App;
