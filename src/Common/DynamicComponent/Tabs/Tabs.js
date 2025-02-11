import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";

const DynamicTabs = ({ tabNames }) => {
  const [activeTab, setActiveTab] = useState(0);

 
  const tabs = tabNames.map((name, index) => ({
    id: index + 1,
    label: name,
    content: `This is the ${name} section`,
  }));

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        className="border-b"
      >
        {tabs.map((tab, index) => (
          <Tab key={tab.id} label={tab.label} />
        ))}
      </Tabs>

      <Box className="p-4 text-gray-700">{tabs[activeTab].content}</Box>
    </div>
  );
};

export default DynamicTabs;
