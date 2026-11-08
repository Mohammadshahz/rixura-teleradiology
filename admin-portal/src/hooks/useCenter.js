import { useEffect, useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { CenterService } from "../services/Center.service";
import { useNavigate } from "react-router-dom";

const useCenter = ({ mode = "add", id = null, userId = null, onSuccess }) => {
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(mode === "edit"); // load only if editing
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    centreName: Yup.string()
      .required("Centre name is required")
      .min(3, "Centre name must be at least 3 characters"),
    centreCode: Yup.string().required("Centre Code is required"),
    centerAddress: Yup.string().required("Address is required"),
    phoneNumbers: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    name: Yup.string()
      .required("Centre name is required")
      .min(3, "Centre name must be at least 3 characters"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    username:
      mode === "add"
        ? Yup.string()
            .required("Username is required")
            .min(3, "Username must be at least 3 characters")
        : Yup.string(),
    password:
      mode === "add"
        ? Yup.string()
            .min(6)
            .required("Password is required")
            .min(6, "Password must be at least 6 characters")
        : Yup.string(),
    mobileNumber: Yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
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
    if (mode === "edit" && id && userId) {
      CenterService.getCenterAndUserById(id, userId)
        .then((data) => {
          setInitialValues({
            centreName: data.center.name || "",
            centreCode: data.center.code || "",
            centerAddress: data.center.address || "",
            phoneNumbers: data.center.phoneNumbers || "",
            webste: data.center.website || "",
            centerScopes: data.center.centerScopes || "",
            logo: data.center.logo || "",
            name: data.user.name || "",
            email: data.user.email || "",
            mobileNumber: data.user.mobileNumber || "",
            address: data.user.address || "",
            username: "", // optional in edit mode
            password: "", // optional in edit mode
            signature: "", // optional in edit mode
            prices: {
              "CT-SCAN": {
                regular: data.user.prices?.["CT-SCAN"]?.regular || "",
                review: data.user.prices?.["CT-SCAN"]?.review || "",
              },
              XRAY: {
                regular: data.user.prices?.XRAY?.regular || "",
                review: data.user.prices?.XRAY?.review || "",
              },
              MRI: {
                regular: data.user.prices?.MRI?.regular || "",
                review: data.user.prices?.MRI?.review || "",
              },
            },
          });
        })
        .catch((err) => {
          console.error("Failed to fetch center:", err);
          toast.error("Failed to load center data");
        })
        .finally(() => setLoading(false));
    } else {
      setInitialValues({
        centreName: "",
        centreCode: "",
        centerAddress: "",
        phoneNumbers: "",
        website: "",
        centerScopes: "",
        logo: null, // assuming logo is a File object
        name: "",
        email: "",
        mobileNumber: "",
        address: "",
        username: "",
        password: "",
        signature: null,
        prices: {
          "CT-SCAN": { regular: "", review: "" },
          XRAY: { regular: "", review: "" },
          MRI: { regular: "", review: "" },
        },
      });
    }
  }, [mode, id, userId]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    const formData = new FormData();

    // Convert centerScopes string to array
    const centerScope = (values.centerScopes || "")
      .split(",")
      .map((item) => item.trim());

    // Prepare center object
    const centerData = {
      name: values.centreName,
      code: values.centreCode,
      address: values.centerAddress,
      phoneNumbers: values.phoneNumbers,
      website: values.website,
      centerScopes: centerScope,
    };

    // Append center object as JSON
    formData.append("center", JSON.stringify(centerData));

    // Add logo file separately
    if (values.logo) {
      formData.append("logo", values.logo);
    }

    // Prepare user object with nested prices
    const userData = {
      name: values.name,
      email: values.email,
      mobileNumber: values.mobileNumber,
      address: values.address,
      prices: {
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
      },
    };

    // Add extra user fields if mode is 'add'
    if (mode === "add") {
      userData.username = values.username;
      userData.password = values.password;
    }

    // Append user object as JSON
    formData.append("user", JSON.stringify(userData));

    // Add signature file separately
    if (mode === "add" && values.signature) {
      formData.append("signature", values.signature);
    }

    try {
      if (mode === "edit" && id && userId) {
        await CenterService.update(id, userId, formData);
        toast.success("Center updated successfully");
        navigate("/center");
      } else {
        await CenterService.create(formData);
        toast.success("Center added successfully");
        navigate("/center");
      }
      onSuccess?.();
    } catch (err) {
      toast.error("Error submitting center data");
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

export default useCenter;
