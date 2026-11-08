import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RadiologistService } from "../services/Radiologist.service";
import { toast } from "react-toastify";

const useProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    RadiologistService.getById(user.id)
      .then((user) => {
        setInitialValues({
          name: user.name || "",
          email: user.email || "",
          mobile: user.mobileNumber || "",
          password: "",
        });
      })
      .catch((err) => {
        console.error("Failed to fetch admin:", err);
        toast.error("Failed to load admin data");
      })
      .finally(() => setLoading(false));
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
  });

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const payload = {
        name: values.name,
        email: values.email,
        mobileNumber: values.mobile,
      };
      if (values.password.trim()) {
        payload.password = values.password;
      }

      await RadiologistService.update(user.id, payload);
      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    editMode,
    setEditMode,
    initialValues,
    validationSchema,
    handleSubmit,
    loading,
    isSubmitting,
  };
};

export default useProfile;
