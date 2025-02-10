import Button from "./Common/DynamicComponents/Button/Button"; 
import React from "react";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Dynamic Button with Hover</h1>

    
      <Button text="Primary" color="blue" onClick={() => alert("Primary Button Clicked!")} />
      <Button text="Success" color="green" onClick={() => alert("Success Button Clicked!")} />
      <Button text="Danger" color="red" onClick={() => alert("Danger Button Clicked!")} />
    </div>
  );
}

export default App;
