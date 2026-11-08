import { useEffect, useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ProfileService } from "../services/Profile.service";
import { RadiologistService } from "../services/Radiologist.service";

const useResetPassword = ({ id, type, onSuccess }) => {
  const [initialValues, setInitialValues] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const passwordRules =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    newPassword: Yup.string()
      .required("Password is required")
      .matches(
        passwordRules,
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("newPassword")], "Passwords must match"),
  });

  useEffect(() => {
    const fetchInitials = async () => {
      if (type === "center") {
        setLoading(true);
        try {
          const data = await ProfileService.getCenterUser(id);
          // console.log("center id :", data[0].user.username);
          setInitialValues({
            username: data[0].user.username || "",
            newPassword: "",
            confirmPassword: "",
          });
        } catch (err) {
          toast.error("Error fetcing username data");
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else if (type === "radiologist") {
        try {
          setLoading(true);
          const data = await RadiologistService.getById(id);
          // console.log("user id : ", data.username);
          setInitialValues({
            username: data.username || "",
            newPassword: "",
            confirmPassword: "",
          });
        } catch (err) {
          toast.error("Error fetcing username data");
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setInitialValues({
          username: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    };
    fetchInitials();
  }, [type, id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    const payload = {
      username: values.username,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };

    try {
      await ProfileService.resetPassword(payload);
      toast.success("Password change successfully");
      navigate("/profile");
      onSuccess?.();
    } catch (err) {
      toast.error("Error submitting new password data");
      console.error(err);
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  return {
    validationSchema,
    initialValues,
    handleSubmit,
    isSubmitting,
    loading,
  };
};

export default useResetPassword;
