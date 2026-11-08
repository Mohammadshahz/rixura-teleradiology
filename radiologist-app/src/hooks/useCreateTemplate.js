import { useEffect, useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TemplateService, TemplatesService } from "../services/Templates.service";
import { UserService } from "../services/Users.service";
import { useSelector } from "react-redux";

const useCreateTemplate = ({ mode = "add", id = null, onSuccess }) => {
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(mode === "edit"); // load only if editing
  const [radiologists, setRadiologists] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = useSelector((state) => state.auth.user?.id);

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  });

  useEffect(() => {
    if (mode === "edit" && id) {
      TemplateService.getTemplateById(id)
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
        radiologistId: userId || "",});
    }
  }, [mode, id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    const payload = {
      title: values.title,
      type: "CUSTOM",
      description: values.description,
      radiologistId: userId,
    };

    try {
      if (mode === "edit" && id) {
        await TemplateService.updateTemplate(id, payload);
        toast.success("Template updated successfully");
        navigate("/templates");
      } else {
        await TemplateService.addTemplate(payload);
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

export default useCreateTemplate;
