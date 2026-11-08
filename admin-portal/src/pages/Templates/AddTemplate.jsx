import TemplateForm from "../../components/layout-ui/Forms/TemplateForm";
import useTemplates from "../../hooks/useTemplates";

const AddTemplate = () => {
  const {
    initialValues,
    handleSubmit,
    validationSchema,
    isSubmitting,
    radiologists,
  } = useTemplates({
    onSuccess: () => {
      // Optionally handle success, e.g., show a toast or redirect
    },
  });
  return (
    <>
      <TemplateForm
        mode="add"
        initialValues={initialValues}
        validationSchema={validationSchema}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        radiologists={radiologists}
      />
    </>
  );
};

export default AddTemplate;
