import React, { useState } from "react";
import Card from "./Common/DynamicComponents/Card/Card"; 

function App() {
  return (

    <div className="flex flex-row p-10">
      <Card 
        title="Website Visits"
        visits={178080} 
        changePercent={3.49}
        bgColor="bg-white"
        borderColor="border-gray-300"
        borderRadius="rounded-lg"
        textColor="text-black"
        barColor="#6366F1"
      />
      <Card 
        title="App Traffic"
        visits={179000} 
        changePercent={-2.15} 
        bgColor="bg-gray-900"
        borderColor="border-gray-700"
        borderRadius="rounded-xl"
        textColor="text-white"
        barColor="#FACC15"
        className="mt-5"
      />
      <Card 
        title="Website Visits"
        visits={278080} 
        changePercent={5.9} 
        bgColor="bg-white"
        borderColor="border-gray-300"
        borderRadius="rounded-lg"
        textColor="text-green"
        barColor="#6366F1"
      />
    </div>
  );
}

export default App;
