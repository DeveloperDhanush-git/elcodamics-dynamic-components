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
    <form onSubmit={formik.handleSubmit} style={{ maxWidth: 800, margin: "auto", fontFamily: "Montserrat" }}>
      <Typography variant="h4" align="center" sx={{ fontFamily: "Montserrat", mb: 2 }}>
        
      </Typography>
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
                  sx={{ "& .MuiOutlinedInput-root": { height: "32px", fontSize: "13px", padding: "5px" } }}
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
                  inputProps={{ min: field.validation?.min, max: field.validation?.max }}
                  sx={{ "& .MuiOutlinedInput-root": { height: "32px", fontSize: "13px", padding: "5px" } }}
                  size="small"
                />
              ) : field.type === "select" ? (
                <Select
                  name={field.name}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  sx={{ height: "32px", fontSize: "13px" }}
                  size="small"
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontFamily: "Montserrat" }}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              ) : field.type === "file" ? (
                <Box
  {...getRootProps()}
  sx={{
    border: "2px dashed #ccc",
    borderRadius: "8px",
    padding: "20px",
    height: "120px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#F9F9F9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Montserrat",
    position: "relative",
  }}
>
  <input {...getInputProps()} />
  {!image ? (
    <>
      <CloudUploadIcon fontSize="large" color="primary" />
      <Typography variant="body2" sx={{ fontFamily: "Montserrat", mt: 1 }}>
        Drag and drop an image here or click to select
      </Typography>
    </>
  ) : (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <img
        src={image}
        alt="Preview"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          borderRadius: "8px",
        }}
      />
      
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={(e) => {
          e.stopPropagation(); 
          setImage(null);
        }}
        sx={{
          position: "absolute",
          top: 5,
          right: 5,
          fontSize: "12px",
          padding: "2px 6px",
          backgroundColor: "rgba(0,0,0,0.7)",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.9)" },
        }}
      >
        ✖
      </Button>
    </Box>
  )}
</Box>


              ) : null}
              {formik.touched[field.name] && formik.errors[field.name] && (
                <Typography color="error" variant="caption" sx={{ fontFamily: "Montserrat" }}>
                  {formik.errors[field.name]}
                </Typography>
              )}
            </FormControl>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" sx={{ fontFamily: "Montserrat", padding: "6px 16px", fontSize: "14px" }}>
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default DynamicForm;