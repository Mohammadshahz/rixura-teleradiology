import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PatientForm from "../../components/layout-ui/Forms/PatientForm";

const EditPatient = () => {
  const { id } = useParams(); // Assuming route is /edit/:id
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    // Fetch patient details here
    // Example:
    // axios.get(`/api/patients/${id}`).then((res) => setInitialValues(res.data));

    // Demo mock
    setInitialValues({
      patientName: "John Doe",
      phoneNumber: "9876543210",
      email: "john@example.com",
      date: "2024-06-01",
      age: 35,
      gender: "Male",
    });
  }, [id]);

  const handleSubmit = (values) => {
    // axios.put(`/api/patients/${id}`, values);
  };

  return initialValues ? (
    <PatientForm initialValues={initialValues} onSubmit={handleSubmit} mode="edit" />
  ) : (
    <div>Loading...</div>
  );
};

export default EditPatient;
