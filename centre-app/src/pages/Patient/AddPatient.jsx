import React from "react";
import PatientForm from "../../components/layout-ui/Forms/PatientForm";
import { useCreatePatient } from "../../hooks/usePatient";
const AddPatient = () => {
  const { initialValues, validationSchema, handleSubmit, isSubmitting } = useCreatePatient();

  return (
    <PatientForm
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      mode="add"
      isSubmitting={isSubmitting}
    />
  );
};

export default AddPatient;
