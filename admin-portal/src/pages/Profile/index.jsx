import { Formik, Form } from "formik";
import Button from "../../components/layout-ui/Button";
import FormInput from "../../components/layout-ui/InputFields/FormInput";
import useProfile from "../../hooks/useProfile";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const {
    editMode,
    setEditMode,
    initialValues,
    validationSchema,
    handleSubmit,
    isSubmitting,
  } = useProfile();

  const navigate = useNavigate();

  // Show loading state until initialValues are fetched
  if (!initialValues)
    return (
      <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm flex items-center justify-center">
        <span className="text-gray-light text-lg font-medium">
          Loading profile details...
        </span>
      </div>
    );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, submitForm }) => (
        <Form className="flex flex-col gap-4">
          <div className="border-b border-b-slate-300 p-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {editMode && (
                <div
                  className="text-lg w-6 h-6 cursor-pointer"
                  onClick={() => setEditMode(false)}
                >
                  <ChevronLeftIcon className="text-lg text-gray-400" />
                </div>
              )}
              <h1 className="text-xl font-medium">Profile</h1>
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={() => navigate("reset-password")}>
                Change Password
              </Button>
              {!editMode ? (
                <Button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Make Changes
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={submitForm}
                  className="bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>
          </div>

          <div className="px-4 flex flex-col md:gap-4">
            {["name", "email", "mobile"].map((field) => (
              <div
                className="grid md:grid-cols-2 grid-cols-1 gap-2 "
                key={field}
              >
                <label htmlFor={field} className=" capitalize">
                  {field === "mobile" ? "Mobile Number" : field}
                </label>
                {editMode ? (
                  <FormInput
                    name={field}
                    type={field === "password" ? "password" : "text"}
                    placeholder={
                      field === "password"
                        ? "Enter new password (optional)"
                        : `Enter ${field}`
                    }
                    required={field !== "password"}
                  />
                ) : (
                  <p className="py-2">
                    {field === "password" ? "••••••" : values[field]}
                  </p>
                )}
              </div>
            ))}

            {isSubmitting && (
              <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                <span className="text-gray-light text-lg font-medium">
                  Updating admin...
                </span>
              </div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Profile;
