import React from "react";
import PatientForm from "../../components/layout-ui/Forms/PatientForm";

const AddPatient = () => {
  const initialValues = {
    patientName: "",
    phoneNumber: "",
    email: "",
    date: "",
    age: "",
    gender: "",
  };

  const handleSubmit = (values) => {
    // axios.post("/api/patients", values);
  };

  return <PatientForm initialValues={initialValues} onSubmit={handleSubmit} mode="add" />;
};

export default AddPatient;
