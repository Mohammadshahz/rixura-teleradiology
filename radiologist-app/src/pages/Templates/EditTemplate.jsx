import { useParams } from "react-router-dom";
import TemplateForm from "../../components/layout-ui/Forms/TemplateForm";
import useCreateTemplate from "../../hooks/useCreateTemplate";

const EditTemplate = () => {
  const { id } = useParams(); // /templates/edit/:id

  const {
    initialValues,
    validationSchema,
    handleSubmit,
    loading,
    isSubmitting,
    radiologists,
  } = useCreateTemplate({
    mode: "edit",
    id,
    onSuccess: () => {
      // Optionally, you can navigate or show a success message here
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
