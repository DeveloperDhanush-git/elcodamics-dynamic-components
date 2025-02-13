
import React from "react";
import ProductForm from "./Common/DynamicComponents/maintenceForm/ProductForm";
import StockAdjustmentForm from "./Common/DynamicComponents/maintenceForm/StockAdjustmentForm";
import WarehouseTransferForm from "./Common/DynamicComponents/maintenceForm/WarehouseForm";


function App() {
  return (
    <>
    <ProductForm />
    <StockAdjustmentForm/>
    <WarehouseTransferForm/>
    </>
  );
}

export default App;
