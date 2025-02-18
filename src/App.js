import React from "react";

 import PurchaseOrderForm from "./Common/DynamicComponents/php/PurcheaseOrderForm";
// import SupplierPaymentForm from "./Common/DynamicComponents/php/SupplierPaymentForm";
import MachineMaintenanceForm from "./Common/DynamicComponents/php/MachineMaintenanceForm";

const App = () => {
  return (
    <div>
      
 {/* <PurchaseOrderForm/> */}
      
      <MachineMaintenanceForm />
     
   
    </div>
  );
};

export default App;