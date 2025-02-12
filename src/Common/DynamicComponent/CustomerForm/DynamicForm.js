import React, { useCallback, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const DynamicForm = ({ formTitle, formFields, onSubmit }) => {
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
        schema[field.name] = Yup.string();
        if (field.validation.required) {
          schema[field.name] = schema[field.name].required("This field is required");
        }
      }
      return schema;
    }, {})
  );

  const formik = useFormik({
    initialValues: formFields.reduce((values, field) => {
      values[field.name] = field.type === "checkbox" ? [] : field.defaultValue || "";
      return values;
    }, {}),
    validationSchema,
    onSubmit,
  });

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
  {formTitle || "Untitled Form"}
</Typography>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <Grid container spacing={2}>
          {formFields.map((field) => (
            <Grid item xs={12} sm={4} key={field.name}>
              <FormControl fullWidth>
                <Typography variant="subtitle1" sx={{color: "#333", marginBottom: 1 , fontFamily: "Montserrat",}}>
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
                    sx={{ "& .MuiInputBase-root": { fontSize: "1rem", borderRadius: "8px", fontFamily: "Montserrat", } }}
                  />
                ) : field.type === "select" ? (
                  <Select
                    name={field.name}
                    value={formik.values[field.name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    sx={{ fontSize: "1rem", borderRadius: "8px", fontFamily: "Montserrat", }}
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value} sx={{ fontSize: "1rem" }}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                ) : field.type === "radio" ? (
                  <RadioGroup name={field.name} value={formik.values[field.name]} onChange={formik.handleChange}>
                    {field.options.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio color="primary" />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                ) : field.type === "checkbox" ? (
                  <>
                    {field.options.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        control={
                          <Checkbox
                            checked={formik.values[field.name].includes(option.value)}
                            onChange={(event) => {
                              const newValue = event.target.checked
                                ? [...formik.values[field.name], option.value]
                                : formik.values[field.name].filter((val) => val !== option.value);
                              formik.setFieldValue(field.name, newValue);
                            }}
                          />
                        }
                        label={option.label}
                      />
                    ))}
                  </>
                ) : field.type === "file" ? (
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: "2px dashed #1976d2",
                      borderRadius: "8px",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor: "#f5f5f5",
                      transition: "0.3s",
                      "&:hover": { backgroundColor: "#e3f2fd" },
                      fontFamily: "Montserrat",
                    }}
                  >
                    <input {...getInputProps()} />
                    <CloudUploadIcon fontSize="large" color="primary" />
                    <Typography variant="body1" sx={{ fontSize: "1rem", color: "#555", fontFamily: "Montserrat", }}>
                      Drag and drop an image here or click to upload
                    </Typography>
                    {image && <img src={image} alt="Preview" style={{ marginTop: 10, maxWidth: "100%", height: "auto", borderRadius: "6px", fontFamily: "Montserrat", }} />}
                  </Box>
                ) : null}
              </FormControl>
            </Grid>
          ))}
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 3, fontSize: "1.2rem", padding: "12px", borderRadius: "8px", fontFamily: "Montserrat", }}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default DynamicForm;