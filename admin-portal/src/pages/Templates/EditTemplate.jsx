import { useParams } from "react-router-dom";
import useTemplates from "../../hooks/useTemplates";
import TemplateForm from "../../components/layout-ui/Forms/TemplateForm";

const EditTemplate = () => {
  const { id } = useParams(); // /templates/edit/:id

  const {
    initialValues,
    validationSchema,
    handleSubmit,
    loading,
    isSubmitting,
    radiologists,
  } = useTemplates({
    mode: "edit",
    id,
    onSuccess: () => {
      // Optionally handle success, e.g., show a toast or redirect
      // console.log("Template updated and form submitted");
    },
  });

  return !loading && initialValues ? (
    <TemplateForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      mode="edit"
      validationSchema={validationSchema}
      isSubmitting={isSubmitting}
      radiologists={radiologists}
    />
  ) : (
    <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <span className="text-gray-light text-lg font-medium">
        Loading template details...
      </span>
    </div>
  );
};

export default EditTemplate;
