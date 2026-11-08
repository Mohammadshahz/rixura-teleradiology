import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PatientService } from "../../services/Patient.Service";
import PatientForm from "../../components/layout-ui/Forms/PatientForm";

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    PatientService.getPatientById(id)
      .then((patient) => {
        setInitialValues({
          patientName: patient.name,
          age: patient.age,
           gender: patient.gender, // e.g. "female"

          phoneNumber: patient.phoneNumber || "",
          email: patient.email || "",
          date: patient.createdAt ? patient.createdAt.split("T")[0] : "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      name: values.patientName,
      age: values.age,
      gender: values.gender.toLowerCase(),
      phoneNumber: values.phoneNumber,
      email: values.email,
    };
    try {
      await PatientService.updatePatient(id, payload);
      toast.success("Update successful");
      setSubmitting(false);
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
     <div className="absolute inset-0 z-10 bg-gray-light2/40 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <span className="text-gray dark:text-gray-light text-lg font-medium">
          Loading patient data...
        </span>
      </div>
    );
  }
  if (error) {
    return <div>Error loading patient: {error}</div>;
  }

  return (
    <>
      <ToastContainer />
      <PatientForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        mode="edit"
      />
    </>
  );
};

export default EditPatient;
