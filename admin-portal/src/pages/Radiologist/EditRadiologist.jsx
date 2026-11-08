import RadiologistForm from "../../components/layout-ui/Forms/RadiologistForm";
import { useParams } from "react-router-dom";
import useRadiologist from "../../hooks/useRadiologist";

const EditRadiologist = () => {
  const { id } = useParams(); // /radiologist/edit/:id

  const {
    initialValues,
    validationSchema,
    handleSubmit,
    loading,
    isSubmitting,
  } = useRadiologist({
    mode: "edit",
    id,
    onSuccess: () => {
      // Optionally handle success, e.g., show a toast or redirect
    },
  });

  return !loading && initialValues ? (
    <RadiologistForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      mode="edit"
      validationSchema={validationSchema}
      isSubmitting={isSubmitting}
    />
  ) : (
    <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <span className="text-gray-light text-lg font-medium">
        Loading radiologist details...
      </span>
    </div>
  );
};

export default EditRadiologist;
