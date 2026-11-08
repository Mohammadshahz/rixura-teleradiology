import { useEffect, useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { CenterService } from "../services/Center.service";
import { useNavigate } from "react-router-dom";

const useEditCenter = ({ id = null, userId = null, onSuccess }) => {
  const [centerInitialValues, setCenterInitialValues] = useState(null);
  const [userInitialValues, setUserInitialValues] = useState(null);
  const [loading, setLoading] = useState(true); // load only if editing
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const centerValidationSchema = Yup.object({
    centreName: Yup.string().required("Required"),
    centreCode: Yup.string().required("Required"),
    centerAddress: Yup.string().required("Required"),
    phoneNumbers: Yup.string().required("Required"),
    website: Yup.string().url("Invalid URL").required("Required"),
    centerScopes: Yup.string().required("Required"),
  });

  const userValidationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    mobileNumber: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
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
    if (id && userId) {
      CenterService.getCenterAndUserById(id, userId)
        .then((data) => {
          setCenterInitialValues({
            centreName: data.center.name || "",
            centreCode: data.center.code || "",
            centerAddress: data.center.address || "",
            phoneNumbers: data.center.phoneNumbers || "",
            website: data.center.website || "",
            centerScopes: Array.isArray(data.center.centerScopes)
              ? data.center.centerScopes.join(", ")
              : data.center.centerScopes || "",
            logo: data.center.logoUrl || "",
          });
          setUserInitialValues({
            name: data.user.name || "",
            email: data.user.email || "",
            mobileNumber: data.user.mobileNumber || "",
            address: data.user.address || "",
            signature: data.user.signatureUrl || "",
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
    }
  }, [id, userId]);

  const onCenterSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    const formData = new FormData();
    // Convert centerScopes string to array
    const centerScope = (values.centerScopes || "")
      .split(",")
      .map((item) => item.trim());

    // Append each field individually (like first curl)
    formData.append("name", values.centreName);
    formData.append("code", values.centreCode);
    formData.append("address", values.centerAddress);
    formData.append("phoneNumbers", values.phoneNumbers);
    formData.append("website", values.website);

    // In the first curl, centerScopes is sent as CSV string, not JSON array
    formData.append("centerScopes", centerScope.join(","));

    // Add logo file directly
    if (values.logo instanceof File) {
      formData.append("logo", values.logo, values.logo.name);
    }
    try {
      if (id && userId) {
        await CenterService.updateCenter(id, formData);
        toast.success("Center detail updated successfully");
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

  const onUserSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    // const formData = new FormData();

    // Prepare user object with nested price structure
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

    // Append user object as JSON
    // formData.append("user", JSON.stringify(userData));

    try {
      if (id && userId) {
        await CenterService.updateCenterUser(userId, userData);
        toast.success("Center user updated successfully");
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
    centerValidationSchema,
    userValidationSchema,
    centerInitialValues,
    userInitialValues,
    onCenterSubmit,
    onUserSubmit,
    loading,
    isSubmitting,
  };
};

export default useEditCenter;
