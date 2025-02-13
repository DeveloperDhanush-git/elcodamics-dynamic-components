import React, { useCallback, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const DynamicForm = ({ formFields, onSubmit }) => {
  const [image, setImage] = useState(null);

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

  const validationSchema = Yup.object(
    formFields.reduce((schema, field) => {
      if (field.validation) {
        let validator = Yup.string();
        if (field.type === "number") {
          validator = Yup.number();
          if (field.validation.min !== undefined) {
            validator = validator.min(field.validation.min, `Minimum value is ${field.validation.min}`);
          }
          if (field.validation.max !== undefined) {
            validator = validator.max(field.validation.max, `Maximum value is ${field.validation.max}`);
          }
        }
        if (field.type === "date") {
          validator = Yup.date().required("This field is required");
        }
        if (field.validation.required) {
          validator = validator.required("This field is required");
        }
        schema[field.name] = validator;
      }
      return schema;
    }, {})
  );

  const formik = useFormik({
    initialValues: formFields.reduce((values, field) => {
      values[field.name] = field.defaultValue || (field.type === "number" ? 0 : "");
      return values;
    }, {}),
    validationSchema,
    onSubmit,
  });

  return (
    <form className="p-4 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10" onSubmit={formik.handleSubmit} style={{ maxWidth: 800, margin: "auto", fontFamily: "Montserrat" }}>
      
      <Grid container spacing={2} rowSpacing={3}>
        {formFields.map((field) => (
          <Grid item xs={12} sm={4} key={field.name}>
            <FormControl fullWidth>
              <Typography variant="subtitle1" sx={{ fontFamily: "Montserrat" }}>
                {field.label}
              </Typography>
              {field.type === "text" || field.type === "email" || field.type === "password" ? (
                <TextField
                  type={field.type}
                  name={field.name}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              ) : field.type === "number" ? (
                <TextField
                  type="number"
                  name={field.name}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              ) : field.type === "date" ? (
                <TextField
                  type="date"
                  name={field.name}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              ) : field.type === "textarea" ? (
                <TextField
                  name={field.name}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                />
              ) : field.type === "select" ? (
                <Select
                  name={field.name}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  size="small"
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              ) : field.type === "file" ? (
                <Box {...getRootProps()} sx={{ border: "2px dashed #ccc", padding: "20px", textAlign: "center", cursor: "pointer" }}>
                  <input {...getInputProps()} />
                  {!image ? (
                    <>
                      <CloudUploadIcon fontSize="large" color="primary" />
                      <Typography variant="body2">Drag and drop an image here or click to select</Typography>
                    </>
                  ) : (
                    <Box>
                      <img src={image} alt="Preview" style={{ width: "100%", height: "100px", objectFit: "contain" }} />
                      <Button onClick={(e) => { e.stopPropagation(); setImage(null); }}>✖</Button>
                    </Box>
                  )}
                </Box>
              ) : null}
              {formik.touched[field.name] && formik.errors[field.name] && (
                <Typography color="error" variant="caption">
                  {formik.errors[field.name]}
                </Typography>
              )}
            </FormControl>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default DynamicForm;
