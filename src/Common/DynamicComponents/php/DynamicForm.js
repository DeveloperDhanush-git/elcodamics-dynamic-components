import React, { useEffect, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const DynamicForm = ({
  formTitle,
  formFields = [],
  onSubmit = () => {},
  initialValues,
}) => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState(initialValues || {});

  useEffect(() => {
    // Update formData when initialValues (or formData prop) changes.
    setFormData(initialValues || {});
  }, [initialValues]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      // Recalculate totalAmount when quantity or unitPrice changes
      if (name === "quantity" || name === "unitPrice") {
        const quantity = parseFloat(updatedData.quantity) || 0;
        const unitPrice = parseFloat(updatedData.unitPrice) || 0;
        updatedData.totalAmount = quantity * unitPrice;
      }

      return updatedData;
    });
  };

  const validationSchema = Yup.object(
    formFields.reduce((schema, field) => {
      if (field.validation) {
        if (field.type === "multiselect") {
          let validator = Yup.array();
          if (field.validation.required) {
            validator = validator.min(1, "This field is required");
          }
          schema[field.name] = validator;
        } else {
          let validator = Yup.string();
          if (field.validation.required) {
            validator = validator.required("This field is required");
          }
          schema[field.name] = validator;
        }
      }
      return schema;
    }, {})
  );

  const formikInitialValues = formFields.reduce((values, field) => {
    if (field.type === "checkbox" || field.type === "multiselect") {
      values[field.name] = field.defaultValue || [];
    } else {
      values[field.name] = field.defaultValue || "";
    }
    return values;
  }, {});

  const formik = useFormik({
    initialValues: formikInitialValues,
    validationSchema,
    enableReinitialize: true, // Ensure the form reinitializes when initialValues change
    onSubmit,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
    onSubmit(formData); // This sends the custom form data to the parent
  };

  return (
    <Box
      sx={{
        maxWidth: "900px",
        padding: 4,
        margin: "auto",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Montserrat",
      }}
    >
      {formTitle && (
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            marginBottom: 3,
            fontFamily: "Montserrat",
            color: "black",
            padding: "12px",
          }}
        >
          {formTitle}
        </Typography>
      )}
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Grid container spacing={2}>
          {formFields.map((field) => (
            <Grid item xs={12} sm={4} key={field.name}>
              <FormControl fullWidth>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#333",
                    marginBottom: 1,
                    fontFamily: "Montserrat",
                  }}
                >
                  {field.label}
                </Typography>
                {["text", "email", "password", "number", "date"].includes(field.type) && (
                  <TextField
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || formik.values[field.name]}
                    onChange={(e) => {
                      handleChange(e);
                      formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                    variant="outlined"
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        fontSize: "1rem",
                        borderRadius: "8px",
                        fontFamily: "Montserrat",
                      },
                    }}
                  />
                )}
                {field.type === "select" && (
                  <Select
                    name={field.name}
                    value={formData[field.name] || formik.values[field.name]}
                    onChange={(e) => {
                      handleChange(e);
                      formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                    fullWidth
                    sx={{
                      fontSize: "1rem",
                      borderRadius: "8px",
                      fontFamily: "Montserrat",
                    }}
                  >
                    {field.options.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        sx={{ fontSize: "1rem" }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                {field.type === "multiselect" && (
                  <Select
                    multiple
                    name={field.name}
                    value={formData[field.name] || []}
                    onChange={(e) => {
                      handleChange(e);
                      formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                    fullWidth
                    sx={{
                      fontSize: "1rem",
                      borderRadius: "8px",
                      fontFamily: "Montserrat",
                    }}
                    renderValue={(selected) =>
                      Array.isArray(selected) ? selected.join(", ") : ""
                    }
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Checkbox
                          checked={(
                            formData[field.name] || []
                          ).includes(option.value)}
                        />
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                {field.type === "file" && (
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: "2px dashed #1976D2",
                      borderRadius: "8px",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor: "#F5F5F5",
                      transition: "0.3s",
                      "&:hover": { backgroundColor: "#E3F2FD" },
                      fontFamily: "Montserrat",
                    }}
                  >
                    <input {...getInputProps()} />
                    <CloudUploadIcon fontSize="large" color="primary" />
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "1rem",
                        color: "#555",
                        fontFamily: "Montserrat",
                      }}
                    >
                      Drag and drop an image here or click to upload
                    </Typography>
                    {image && (
                      <img
                        src={image}
                        alt="Preview"
                        style={{
                          marginTop: 10,
                          maxWidth: "100%",
                          height: "auto",
                          borderRadius: "6px",
                          fontFamily: "Montserrat",
                        }}
                      />
                    )}
                  </Box>
                )}
                {field.type === "checkbox" && (
                  <>
                    {field.options.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        control={
                          <Checkbox
                            checked={(
                              formData[field.name] || []
                            ).includes(option.value)}
                            onChange={(event) => {
                              const newValue = event.target.checked
                                ? [...(formData[field.name] || []), option.value]
                                : (formData[field.name] || []).filter(
                                    (val) => val !== option.value
                                  );
                              setFormData((prev) => ({
                                ...prev,
                                [field.name]: newValue,
                              }));
                            }}
                          />
                        }
                        label={option.label}
                      />
                    ))}
                  </>
                )}
                {field.type === "textarea" && (
                  <TextField
                    multiline
                    rows={4}
                    name={field.name}
                    value={formData[field.name] || formik.values[field.name]}
                    onChange={(e) => {
                      handleChange(e);
                      formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                    variant="outlined"
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        fontSize: "1rem",
                        borderRadius: "8px",
                        fontFamily: "Montserrat",
                      },
                    }}
                  />
                )}
              </FormControl>
            </Grid>
          ))}
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 3,
            fontSize: "1.2rem",
            padding: "12px",
            borderRadius: "8px",
            fontFamily: "Montserrat",
          }}
        >
          {initialValues?.id ? "Update" : "Submit"}
        </Button>
      </form>
    </Box>
  );
};

export default DynamicForm;
