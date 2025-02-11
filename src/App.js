import React from "react";
import Button from "./Common/DynamicComponent/Button/MoreInfoButton";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-6">
      <h1 className="text-3xl font-bold mb-6">Dynamic More Info Button</h1>

      <Button text="More Info - Blue" bgColor="green" borderColor="blue" borderRadius="xl" />
      <Button text="More Info - Green" bgColor="green" borderColor="gray" borderRadius="full" />
      <Button text="More Info - Red" bgColor="blue" borderColor="gray" borderRadius="md" />
       </div>
  );
}

export default App;
