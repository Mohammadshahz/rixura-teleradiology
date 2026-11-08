import TemplateForm from "../../components/layout-ui/Forms/TemplateForm";
import useCreateTemplate from "../../hooks/useCreateTemplate";

const AddTemplate = () => {
  const {
    initialValues,
    handleSubmit,
    validationSchema,
    isSubmitting,
    radiologists,
  } = useCreateTemplate({
    onSuccess: () => {
      // Optionally, you can navigate or show a success message here
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
