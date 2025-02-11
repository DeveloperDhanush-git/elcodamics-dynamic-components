import React from "react";
import AgTable from "./Common/DynamicComponent/AgTable/AgTable";

function App() {
  const headers = [
    { key: "Car", label: "Car" },
    { key: "model", label: "Model" },
    { key: "price", label: "Price" },
    { key: "electric", label: "Electric" },
  ];
  const Examplehead = [
    { key: "bike",     label: "Bike" },
    { key: "bikemodel",    label: "Bike Model" },
    { key: "price",    label: "Price" },
    { key: "electric", label: "Electric" },
  ];

  const cardata = [
    { Car: "Tesla",     model: "Model Y", price: 64950, electric: true },
    { Car: "Ford",      model: "F-Series", price: 33850, electric: false },
    { Car: "Toyota",    model: "Corolla", price: 29600, electric: false },
    { Car: "Mercedes",  model: "EQA", price: 48890, electric: true },
    { Car: "Fiat",      model: "500", price: 15774, electric: false },
    { Car: "Nissan",    model: "Juke", price: 20675, electric: false },
    { Car: "Vauxhall",  model: "Corsa", price: 18460, electric: false },
    { Car: "Volvo",     model: "EX30", price: 33795, electric: true },
  ];
  const bikedata = [
    { bike: "bike1", bikemodel: "Model Y", price: 64950, electric: true },
    { bike: "bike2", bikemodel: "F-Series", price: 33850, electric: false },
    { bike: "bike3", bikemodel: "Corolla", price: 29600, electric: false },
    { bike: "bike4", bikemodel: "EQA", price: 48890, electric: true },
   
  ];


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <AgTable headers={headers} data={cardata} />
      <AgTable headers={Examplehead} data={bikedata} />
    </div>
  );
}

export default App;
