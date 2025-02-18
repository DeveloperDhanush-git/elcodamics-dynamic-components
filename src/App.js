import React from "react";

import PurchaseOrderForm from "./Common/DynamicComponents/php/PurcheaseOrderForm";
import SupplierPaymentForm from "./Common/DynamicComponents/php/SupplierPaymentForm";
import MachineMaintenanceForm from "./Common/DynamicComponents/php/MachineMaintenanceForm";
import ToolReplacementForm from "./Common/DynamicComponents/php/ToolReplacementForm";

const App = () => {
  return (
    <div>
      
      {/* <PurchaseOrderForm/> */}
      
      {/* <MachineMaintenanceForm /> */}
      <ToolReplacementForm />
     {/* <SupplierPaymentForm/> */}
   
    </div>
  );
};

export default App;