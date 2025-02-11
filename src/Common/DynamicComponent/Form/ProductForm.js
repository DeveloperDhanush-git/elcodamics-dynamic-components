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
  Button,
  Typography,
  Box,
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
      values[field.name] = field.defaultValue || "";
      return values;
    }, {}),
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} style={{ maxWidth: 500, margin: "auto", marginBottom: 20, fontFamily: "Montserrat" }}>
      {formFields.map((field) => (
        <FormControl key={field.name} fullWidth margin="normal">
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
              sx={{ fontFamily: "Montserrat" }}
            />
          ) : field.type === "select" ? (
            <Select
              name={field.name}
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              sx={{ fontFamily: "Montserrat" }}
            >
              {field.options.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{ fontFamily: "Montserrat" }}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          ) : field.type === "radio" ? (
            <RadioGroup
              name={field.name}
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              sx={{ fontFamily: "Montserrat" }}
            >
              {field.options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                  sx={{ fontFamily: "Montserrat" }}
                />
              ))}
            </RadioGroup>
          ) : field.type === "file" ? (
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed #ccc",
                borderRadius: "8px",
                padding: "16px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "#f9f9f9",
                fontFamily: "Montserrat",
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon fontSize="large" color="primary" />
              <Typography variant="body1" sx={{ fontFamily: "Montserrat" }}>
                Drag and drop an image here
              </Typography>
              {image && <img src={image} alt="Preview" style={{ marginTop: 10, maxWidth: "100%", height: "auto" }} />}
            </Box>
          ) : null}
        </FormControl>
      ))}
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontFamily: "Montserrat" }}>
        Submit
      </Button>
    </form>
  );
};

const formFields = [
  { name: "productName", label: "Product Name", type: "text", validation: { required: true } },
  {
    name: "productCategory",
    label: "Product Category",
    type: "select",
    options: [
      { label: "Please Select", value: "" },
      { label: "Electronics", value: "electronics" },
      { label: "Clothing", value: "clothing" },
    ],
    validation: { required: true },
  },
  {
    name: "productFreshness",
    label: "Product Freshness",
    type: "radio",
    options: [
      { label: "Brand New", value: "brand_new" },
      { label: "Second Hand", value: "second_hand" },
      { label: "Refurbished", value: "refurbished" },
    ],
    validation: { required: true },
  },
  { name: "productImage", label: "Image of Product", type: "file", validation: { required: false } },
  { name: "additionalDescription", label: "Additional Description", type: "text", validation: { required: false } },
  { name: "productPrice", label: "Product Price", type: "text", validation: { required: true } },
  { name: "comments", label: "Comments", type: "text", validation: { required: false } },
];

export default function App() {
  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };

  return <DynamicForm formFields={formFields} onSubmit={handleSubmit} />;
}
