import React, { useState } from "react";
import DynamicForm from "./DynamicForm";
import { Typography } from "@mui/material";

const machineMaintenanceFields = [
  { name: "machineName", label: "Machine Name", type: "select", options: [
      { label: "Machine 1", value: "machine1" },
      { label: "Machine 2", value: "machine2" }
    ], validation: { required: true } 
  },
  { name: "issueType", label: "Issue Type", type: "select", options: [
      { label: "Electrical", value: "electrical" },
      { label: "Mechanical", value: "mechanical" }
    ], validation: { required: true } 
  },
  
  { name: "priority", label: "Priority", type: "select", options: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" }
    ], validation: { required: true } 
  },
  
  { name: "scheduledDate", label: "Scheduled Date", type: "date", validation: { required: true } },
  { name: "description", label: "Description", type: "textarea", validation: { required: true } },
];

const MachineMaintenanceForm = () => {
  const [formData, setFormData] = useState({});

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (values) => {
    console.log("Machine Maintenance Data:", { ...values, ...formData });
  };

  return ( <> 
       <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", marginBottom: 2 }}>
        MachineMaintenanceForm
      </Typography>
  
  <DynamicForm
      formFields={machineMaintenanceFields}
      onSubmit={handleSubmit}
      formTitle="Machine Maintenance Request"
      formData={formData}
      onChange={handleChange}
    />
  
  
  
  </>
   
  );
};

export default MachineMaintenanceForm;
