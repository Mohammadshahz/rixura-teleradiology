import CentreForm from "../../components/layout-ui/Forms/CentreForm";
import useCenter from "../../hooks/useCenter";

const AddCentre = () => {
  const { initialValues, handleSubmit, validationSchema, isSubmitting } =
    useCenter({
      onSuccess: () => {
      },
    });

  return (
    <CentreForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      mode="add"
      validationSchema={validationSchema}
      isSubmitting={isSubmitting}
    />
  );
};

export default AddCentre;
