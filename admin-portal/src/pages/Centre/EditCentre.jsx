import { useLocation, useParams } from "react-router-dom";
import EditCenterForm from "../../components/layout-ui/Forms/EditCenterForm";
import useEditCenter from "../../hooks/useEditCenter";

const EditCentre = () => {
  const { id } = useParams(); // Assuming route is /edit/:id
  const location = useLocation();
  const { userId } = location.state || {};

  const {
    centerInitialValues,
    userInitialValues,
    centerValidationSchema,
    userValidationSchema,
    onCenterSubmit,
    onUserSubmit,
    isSubmitting,
    loading,
  } = useEditCenter({
    onSuccess: () => {
      // Optionally handle success, e.g., show a toast or redirect
    },
    id,
    userId,
  });

  return !loading ? (
    <EditCenterForm
      centerInitialValues={centerInitialValues}
      userInitialValues={userInitialValues}
      centerValidationSchema={centerValidationSchema}
      userValidationSchema={userValidationSchema}
      onCenterSubmit={onCenterSubmit}
      onUserSubmit={onUserSubmit}
      isSubmitting={isSubmitting}
    />
  ) : (
    <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <span className="text-gray-light text-lg font-medium">
        Loading centers details...
      </span>
    </div>
  );
};

export default EditCentre;
