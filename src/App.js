import React from "react";
import DynamicTabs from "./Common/DynamicComponent/Tabs/Tabs";

const App = () => {
  
  const tabNames = ["Home", "Profile", "Settings", "NewTab","new1"];
  const hometab = ["Home", "Profile", "Settings"];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      
      <DynamicTabs tabNames={tabNames} />
      <DynamicTabs tabNames={hometab} />
    </div>
  );
};

export default App;
