import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, MenuItem, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

const formFields = [
  { name: "firstName", label: "First Name", type: "text", validation: Yup.string().required("Required") },
  { name: "lastName", label: "Last Name", type: "text", validation: Yup.string().required("Required") },
  { name: "email", label: "Email Address", type: "email", validation: Yup.string().email("Invalid email").required("Required") },
  { name: "company", label: "Company (if applicable)", type: "text", validation: Yup.string() },
  { name: "address", label: "Physical Address", type: "text", validation: Yup.string().required("Required") },
  { name: "month", label: "Month", type: "select", options: ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"], validation: Yup.string().required("Required") },
  { name: "day", label: "Day", type: "select", options: Array.from({ length: 31 }, (_, i) => i + 1), validation: Yup.string().required("Required") },
  { name: "year", label: "Year", type: "select", options: Array.from({ length: 100 }, (_, i) => 2024 - i), validation: Yup.string().required("Required") },
];

const validationSchema = Yup.object(
  formFields.reduce((schema, field) => {
    if (field.validation) {
      schema[field.name] = field.validation;
    }
    return schema;
  }, {})
);

const DynamicForm = () => {
  const formik = useFormik({
    initialValues: formFields.reduce((values, field) => {
      values[field.name] = "";
      return values;
    }, {}),
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Data:", values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <Grid container spacing={2}>
        {formFields.map((field, index) => (
          field.name === "month" ? (
            <Grid item xs={12} key="dob">
              <Typography variant="subtitle1" sx={{ fontWeight: 500, marginBottom: "5px", fontFamily: "Montserrat" }}>Date of Birth</Typography>
              <Grid container spacing={2}>
                {["month", "day", "year"].map((dobField) => {
                  const dobData = formFields.find(f => f.name === dobField);
                  return (
                    <Grid item xs={4} key={dobData.name}>
                      <TextField
                        select
                        fullWidth
                        label={dobData.label}
                        name={dobData.name}
                        value={formik.values[dobData.name]}
                        onChange={formik.handleChange}
                        error={formik.touched[dobData.name] && Boolean(formik.errors[dobData.name])}
                        helperText={formik.touched[dobData.name] && formik.errors[dobData.name]}
                        sx={{ fontFamily: "Montserrat" }}
                      >
                        {dobData.options.map((option) => (
                          <MenuItem key={option} value={option} sx={{ fontFamily: "Montserrat" }}>{option}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          ) : (
            field.type !== "select" && (
              <Grid item xs={12} sm={field.name === "firstName" || field.name === "lastName" ? 6 : 12} key={index}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, marginBottom: "5px", fontFamily: "Montserrat" }}>{field.label}</Typography>
                <TextField
                  fullWidth
                  name={field.name}
                  type={field.type}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
                  helperText={formik.touched[field.name] && formik.errors[field.name]}
                  sx={{ fontFamily: "Montserrat" }}
                />
              </Grid>
            )
          )
        ))}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth type="submit" sx={{ fontFamily: "Montserrat" }}>Submit</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default DynamicForm;
