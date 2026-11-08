import React, { useState } from "react";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { AuthService } from "../services/Auth.service";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/auth.slice";
import { toast } from "react-toastify";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [autoFill, setAutoFill] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Must be at least 3 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Must be at least 6 characters")
      .required("Password is required"),
    rememberMe: Yup.boolean(),
  });

  const initialValues = {
    username: "",
    password: "",
    rememberMe: false,
  };

  // Submit handler
  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setIsLoading(true);
    AuthService.login(values)
      .then((data) => {
        const submitData = {
          user: {
            id: data.userId,
            name: data.username,
            email: data.email,
          },
          accessToken: data.accessToken,
          centerId: data.centerId,

        };
        navigate("/");
        // TODO: Replace with actual user data from response
        dispatch(loginSuccess(submitData));
      })
      .catch((error) => {
        console.error("Login failed:", error);
        // Handle error, e.g., show a toast notification
        toast.error("Login failed. Please check your credentials.");
      })
      .finally(() => {
        setSubmitting(false);
        setIsLoading(false);
      });
  };

  // Auto-fill credentials for testing
  const handleSelfAuthChange = (e, setFieldValue) => {
    const checked = e.target.checked;
    setAutoFill(checked);

    if (checked) {
      setFieldValue("username", "admin", false);
      setFieldValue("password", "StrongP@ssword1", false);
    } else {
      setFieldValue("username", "", false);
      setFieldValue("password", "", false);
    }
  };

  return {
    validationSchema,
    initialValues,
    handleSubmit,
    handleSelfAuthChange,
    autoFill,
    isLoading,
  };
};

export default useAuth;
