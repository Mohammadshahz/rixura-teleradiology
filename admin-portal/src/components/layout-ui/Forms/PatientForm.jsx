// src/components/forms/PatientForm.jsx
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import FormInput from "../InputFields/FormInput";
import Button from "../Button";
import FormAutocomplete from "../InputFields/FormAutocomplete";

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

const PatientForm = ({ initialValues, onSubmit, mode = "add" }) => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    patientName: Yup.string()
      .required("Patient name is required")
      .min(3, "Patient name must be at least 3 characters"),
    phoneNumber: Yup.string().required("Phone number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    date: Yup.string().required("Date is required"),
    age: Yup.number()
      .required("Age is required")
      .min(0, "Age must be a positive number"),
    gender: Yup.string().required("Gender is required"),
  });

  const title = mode === "edit" ? "Edit Patient" : "Add Patient";
  const buttonText = mode === "edit" ? "Save Changes" : "Add Patient";

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {() => (
        <Form className="flex flex-col gap-4">
          {/* Header */}
          <div className="border-b border-b-slate-300 p-2 gap-4 flex items-center">
            <div
              className="text-lg w-6 h-6 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <ChevronLeftIcon className="text-lg text-gray-400" />
            </div>
            <h1 className="text-xl font-medium">{title}</h1>
            <Button type="submit" className="ml-auto">
              {buttonText}
            </Button>
          </div>

          {/* Form Fields */}
          <div className="px-4 flex flex-col md:gap-4">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
              <label htmlFor="patientName" className="pt-2">
                Patient Name
              </label>
              <FormInput
                name="patientName"
                type="text"
                placeholder="Enter patient name"
              />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
              <label htmlFor="age" className="pt-2">
                Age
              </label>
              <FormInput name="age" type="number" placeholder="Enter age" />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
              <label htmlFor="gender" className="pt-2">
                Gender
              </label>
              <FormAutocomplete
                name="gender"
                placeholder="Select gender"
                suggestions={genderOptions}
              />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
              <label htmlFor="phoneNumber" className="pt-2">
                Phone Number
              </label>
              <FormInput
                name="phoneNumber"
                type="text"
                placeholder="Enter phone number"
              />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
              <label htmlFor="email" className="pt-2">
                Email
              </label>
              <FormInput name="email" type="text" placeholder="Enter email" />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
              <label htmlFor="date" className="pt-2">
                Date
              </label>
              <FormInput name="date" type="date" />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PatientForm;
