import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Form, Formik } from "formik";
import Button from "../../components/layout-ui/Button";
import FormInput from "../../components/layout-ui/InputFields/FormInput";
import { useLocation, useNavigate } from "react-router-dom";
import useResetPassword from "../../hooks/useResetPassword";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, type } = location.state || {};

  const { initialValues, validationSchema, handleSubmit, loading } =
    useResetPassword({
      id,
      type,
      onSuccess: () => {
        // Optionally handle success, e.g., show a toast or redirect
      },
    });

  if (loading) {
    return (
      <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm flex items-center justify-center">
        <span className="text-gray-light text-lg font-medium">
          Loading user details...
        </span>
      </div>
    );
  }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-4">
          {/* Header */}
          <div className="border-b border-b-slate-300 p-2 gap-4 flex items-center">
            <div
              className="text-lg w-6 h-6 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <ChevronLeftIcon className="text-lg text-gray-400" />
            </div>
            <h1 className="text-xl font-medium">Profile Reset Password</h1>
            <Button type="submit" className="ml-auto" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Reset Password"}
            </Button>
          </div>

          {/* Form Fields */}
          <div
            className={`relative px-4 flex flex-col md:gap-4 transition-opacity ${
              isSubmitting ? "pointer-events-none opacity-30" : ""
            }`}
          >
            {isSubmitting && (
              <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                <span className="text-gray-light text-lg font-medium">
                  Submitting New Password...
                </span>
              </div>
            )}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
              <label htmlFor="username" className="pt-2">
                Username
              </label>
              <FormInput
                name="username"
                type="text"
                placeholder="Enter username"
              />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
              <label htmlFor="newPassword" className="pt-2">
                New Password
              </label>
              <FormInput
                name="newPassword"
                type="password"
                placeholder="Enter new password"
              />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
              <label htmlFor="confirmPassword" className="pt-2">
                Confirm Password
              </label>
              <FormInput
                name="confirmPassword"
                type="password"
                placeholder="Enter confirm password"
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPassword;
