// src/hooks/useCreatePatient.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { PatientService } from "../services/Patient.Service";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";


export const useCreatePatient = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const centerId=useSelector((state)=> state.auth.centerId)
    const [loading, setLoading] = useState(true);

const genderOptions = [
    { label: "Male", id: "male" },
    { label: "Female", id: "female" },
    { label: "Others", id: "others" },
  ];


  const initialValues = {
    patientName: "",
    age: "",
    gender: "",
    phoneNumber: "",
    email: "",
    date: "",
  };

  const validationSchema = Yup.object({
    patientName: Yup.string()
      .required("Patient name is required")
      .min(3, "At least 3 characters"),
    age: Yup.number()
      .typeError("Age must be a number")
      .required("Age is required")
      .min(0, "Must be positive"),
    gender: Yup.string().required("Gender is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Digits only")
      .min(9, "Too short")
      .max(15, "Too long"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    date: Yup.string().required("Date of birth is required"),
  });

  const handleSubmit = (values, { resetForm, setSubmitting }) => {
    setIsSubmitting(true);

    const payload = {
      centerId: centerId,
      name: values.patientName,
      age: Number(values.age),
      gender: values.gender.toLowerCase(),
      phoneNumber: values.phoneNumber,
      email: values.email,
      date: values.date,
    };

    PatientService.createPatient(payload)
      .then((data) => {
        toast.success("Patient created successfully");
        resetForm();
        navigate("/patients");
      })
      .catch((error) => {
        console.error("Create patient failed:", error);
        toast.error(
          error?.response?.data?.message || "Failed to create patient"
        );
      })
      .finally(() => {
        setSubmitting(false);
        setIsSubmitting(false);
      });
  };

  return { initialValues, validationSchema, handleSubmit, isSubmitting,genderOptions  };
};
