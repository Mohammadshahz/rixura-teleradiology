import React, { useState } from "react";
import { Formik, Form } from "formik";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Button from "../../components/layout-ui/Buttons";
import FormInput from "../../components/layout-ui/InputFields/FormInput";
import { useNavigate } from "react-router-dom";
import useProfile from "../../hooks/useProfile";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const { initialValues, validationSchema, handleSubmit, loading, submitting } =
    useProfile();

  return (
    <Formik
      enableReinitialize
      initialValues={{ ...initialValues, password: "123456" }} // placeholder password
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const { password, ...rest } = values; // omit password
        handleSubmit(rest);
        setEditMode(false);
      }}
    >
      {({ values, submitForm }) => (
        <Form className="flex flex-col">
          {/* Header */}
          <div className="mb-4 border-b border-gray-light2 p-2 gap-4 flex items-center">
            <div
              className="text-lg w-6 h-6 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <ChevronLeftIcon className="text-gray-light" />
            </div>
            <h1 className="text-xl font-medium">Profile</h1>
            {/* <div className="ml-auto">
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
                  disabled={submitting}
                  className="bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div> */}
          </div>

          {/* Form Body with Loader Overlay */}
          {(loading || submitting) && (
            <div className="absolute inset-0 z-10 bg-gray-light2/40 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <span className="text-gray dark:text-gray-light text-lg font-medium">
                {loading ? "Loading profile..." : "Saving profile..."}
              </span>
            </div>
          )}
          <div className="relative px-4 flex flex-col md:gap-4">
            <div
              className={`transition-opacity ${
                loading || submitting ? "pointer-events-none opacity-30" : ""
              }`}
            >
              {["name", "email", "password", "mobileNumber"].map((field) => (
                <div
                  key={field}
                  className="grid md:grid-cols-2 grid-cols-1 gap-2 items-center mb-4"
                >
                  <label
                    htmlFor={field}
                    className="pt-2 capitalize font-medium text-gray-700 dark:text-gray-200"
                  >
                    {field === "mobileNumber"
                      ? "Mobile Number"
                      : field === "password"
                      ? "Password"
                      : field}
                  </label>

                  {editMode && field !== "password" ? (
                    <FormInput
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      placeholder={`Enter ${field}`}
                      required
                    />
                  ) : field === "password" ? (
                    <FormInput
                      name="password"
                      type="password"
                      disabled
                      value="123456"
                    />
                  ) : (
                    <p className="py-2 text-gray-900 dark:text-white">
                      {values[field]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Profile;
