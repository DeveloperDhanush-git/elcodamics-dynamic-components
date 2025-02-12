import React from "react";
import VendorForm from "./Common/DynamicCompents/Suppliersform/VendorForm";
import PurchaseOrderForm from "./Common/DynamicCompents/Suppliersform/PurchaseOrderForm";
import SupplierPaymentForm from "./Common/DynamicCompents/Suppliersform/SupplierPaymentForm";
const App = () => {
  return (
    <div>
      
      <VendorForm />
      
      
      <PurchaseOrderForm />
      
     
      <SupplierPaymentForm />
    </div>
  );
};

export default App;
