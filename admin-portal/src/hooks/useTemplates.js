import { useEffect, useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TemplatesService } from "../services/Templates.service";
import { RadiologistService } from "../services/Radiologist.service";

const useTemplates = ({ mode = "add", id = null, onSuccess }) => {
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(mode === "edit"); // load only if editing
  const [radiologists, setRadiologists] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    // radiologistId: Yup.string().required("Please select a radiologist"),
  });

  useEffect(() => {
    RadiologistService.getAll()
      .then((res) => {
        setRadiologists(res || []);
      })
      .catch((err) => {
        console.error("Failed to load radiologists:", err);
        toast.error("Failed to load radiologists");
      });
  }, []);

  useEffect(() => {
    if (mode === "edit" && id) {
      TemplatesService.getById(id)
        .then((template) => {
          setInitialValues({
            title: template.title || "",
            description: template.description || "",
            radiologistId: template.radiologistId || "",
          });
        })
        .catch((err) => {
          console.error("Failed to fetch template :", err);
          toast.error("Failed to load template data");
        })
        .finally(() => setLoading(false));
    } else {
      setInitialValues({
        title: "",
        description: "",
        radiologistId: "",
      });
    }
  }, [mode, id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    const type = values.radiologistId ? "CUSTOM" : "DEFAULT";
    const payload = {
      title: values.title,
      description: values.description,
      type: type,
      ...(values.radiologistId && { radiologistId: values.radiologistId }),
    };

    try {
      if (mode === "edit" && id) {
        await TemplatesService.update(id, payload);
        toast.success("Template updated successfully");
        navigate("/templates");
      } else {
        await TemplatesService.create(payload);
        toast.success("Template added successfully");
        navigate("/templates");
      }
      onSuccess?.();
    } catch (err) {
      toast.error("Error submitting templates data");
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
    radiologists,
  };
};

export default useTemplates;
