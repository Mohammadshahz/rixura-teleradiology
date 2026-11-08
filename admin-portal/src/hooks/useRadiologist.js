import { useEffect, useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { RadiologistService } from "../services/Radiologist.service";
import { useNavigate } from "react-router-dom";

const useRadiologist = ({ mode = "add", id = null, onSuccess }) => {
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(mode === "edit"); // load only if editing
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .min(10, "Mobile number must be at least 10 digits")
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
    username:
      mode === "add"
        ? Yup.string().required("Username is required")
        : Yup.string(),
    password:
      mode === "add"
        ? Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required")
        : Yup.string(),
    address: Yup.string().required("Address is required"),
    prices: Yup.object().shape({
      "CT-SCAN": Yup.object().shape({
        regular: Yup.number()
          .typeError("Regular price must be a number")
          .required("CT-SCAN regular price is required"),
        review: Yup.number()
          .typeError("Review price must be a number")
          .required("CT-SCAN review price is required"),
      }),
      XRAY: Yup.object().shape({
        regular: Yup.number()
          .typeError("Regular price must be a number")
          .required("XRAY regular price is required"),
        review: Yup.number()
          .typeError("Review price must be a number")
          .required("XRAY review price is required"),
      }),
      MRI: Yup.object().shape({
        regular: Yup.number()
          .typeError("Regular price must be a number")
          .required("MRI regular price is required"),
        review: Yup.number()
          .typeError("Review price must be a number")
          .required("MRI review price is required"),
      }),
    }),
  });

  useEffect(() => {
    if (mode === "edit" && id) {
      RadiologistService.getById(id)
        .then((user) => {
          setInitialValues({
            name: user.name || "",
            email: user.email || "",
            phoneNumber: user.mobileNumber || "",
            address: user.address || "",
            username: "", // optional in edit mode
            password: "", // optional in edit mode
            prices: {
              "CT-SCAN": {
                regular: user.prices?.["CT-SCAN"]?.regular || "",
                review: user.prices?.["CT-SCAN"]?.review || "",
              },
              XRAY: {
                regular: user.prices?.XRAY?.regular || "",
                review: user.prices?.XRAY?.review || "",
              },
              MRI: {
                regular: user.prices?.MRI?.regular || "",
                review: user.prices?.MRI?.review || "",
              },
            },
            signature: user.signatureUrl || "",
            // signatureUrl: user.signatureUrl || "", // URL for displaying existing signature
          });
        })
        .catch((err) => {
          console.error("Failed to fetch radiologist:", err);
          toast.error("Failed to load radiologist data");
        })
        .finally(() => setLoading(false));
    } else {
      setInitialValues({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        username: "",
        password: "",
        signature: null, // Assuming signature is a file input
        prices: {
          "CT-SCAN": { regular: "", review: "" },
          XRAY: { regular: "", review: "" },
          MRI: { regular: "", review: "" },
        },
      });
    }
  }, [mode, id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("role", "RADIOLOGIST");
    formData.append("email", values.email);
    formData.append("mobileNumber", values.phoneNumber);
    formData.append("address", values.address);
    formData.append("status", "ACTIVE");

    // Build prices object from nested structure
    const prices = {
      "CT-SCAN": {
        regular: Number(values.prices?.["CT-SCAN"]?.regular || 0),
        review: Number(values.prices?.["CT-SCAN"]?.review || 0),
      },
      XRAY: {
        regular: Number(values.prices?.XRAY?.regular || 0),
        review: Number(values.prices?.XRAY?.review || 0),
      },
      MRI: {
        regular: Number(values.prices?.MRI?.regular || 0),
        review: Number(values.prices?.MRI?.review || 0),
      },
    };

    // Append as stringified JSON
    formData.append("prices", JSON.stringify(prices));

    if (mode === "add") {
      formData.append("username", values.username);
      formData.append("password", values.password);
      if (values.signature) {
        formData.append("signature", values.signature); // file input
      }
    }

    try {
      if (mode === "edit" && id) {
        await RadiologistService.update(id, formData);
        toast.success("Radiologist updated successfully");
        navigate("/radiologist");
      } else {
        await RadiologistService.create(formData);
        toast.success("Radiologist added successfully");
        navigate("/radiologist");
      }
      onSuccess?.();
    } catch (err) {
      toast.error("Error submitting radiologist data");
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
    loading,
    isSubmitting,
  };
};

export default useRadiologist;
