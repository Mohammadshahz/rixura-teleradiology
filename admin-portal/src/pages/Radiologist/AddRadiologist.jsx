import RadiologistForm from "../../components/layout-ui/Forms/RadiologistForm";
import useRadiologist from "../../hooks/useRadiologist";

const AddRadiologist = () => {
  const { initialValues, handleSubmit, validationSchema, isSubmitting } =
    useRadiologist({
      onSuccess: () => {
      },
    });

  return (
    <RadiologistForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      mode="add"
      validationSchema={validationSchema}
      isSubmitting={isSubmitting}
    />
  );
};

export default AddRadiologist;
