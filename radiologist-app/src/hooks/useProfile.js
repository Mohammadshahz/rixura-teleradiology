import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { UserService } from "../services/Users.service";

const useProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    mobileNumber: "",
  });

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
   mobileNumber: Yup.string()
  .matches(
    /^(\+91[-\s]?)?\d{10}$/,
    "Mobile number must be 10 digits (with optional +91)"
  )
  .required("Mobile number is required"),

  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await UserService.getSingleUser(userId);
        setInitialValues({
          name: data.name || "",
          email: data.email || "",
          mobileNumber: data.mobileNumber || "",
        });
      } catch (err) {
        toast.error("Failed to load user profile");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      await UserService.updateUser(userId, values);
      toast.success("Profile updated successfully");
      navigate("/");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    initialValues,
    validationSchema,
    handleSubmit,
    loading,
    submitting,
  };
};

export default useProfile;
