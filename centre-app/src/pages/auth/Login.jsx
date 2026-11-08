import React, { useState } from "react";
import { Formik, Form } from "formik";
// Optional: Import your custom FormInput component
import FormInput from "../../components/layout-ui/InputFields/FormInput";
import useAuth from "../../hooks/useAuth";
import bg from "../../assets/images/skeleton-bg.jpg";
import Button from "../../components/layout-ui/Buttons";
import { logo, logoWhite } from "../../assets"
import loginImage from "../../assets/images/loginImage.png"
import {
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

// Place the modal component in this file (below LoginPage or above)
function YourForgotPasswordModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
          Forgot Password
        </h2>

        <div className="mb-6">
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
            For password assistance, contact:
          </p>

          <div className="space-y-2 pl-1">
            {/* ✅ Email */}
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-gray-500" />
              <a
                href="mailto:support@rixura.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                support@rixura.com
              </a>

            </p>

            {/* ✅ Phone */}
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <PhoneIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-500 dark:text-gray-400">
                +91 82377 67664
              </span>

            </p>
          </div>
        </div>

        <div className="text-center">
          <Button
            className="w-full"
            color="gray"
            variant="outlined"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

const LoginPage = () => {
  const {
    validationSchema,
    initialValues,
    handleSubmit,
    handleSelfAuthChange,
    autoFill,
    isLoading,
  } = useAuth();
  // State to control the Forgot Password modal
  const [isForgotOpen, setForgotOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden" style={{ backgroundImage: `url(${loginImage})`, backgroundSize: "cover" }}>
      {isLoading && (
        <div className="absolute inset-0 z-40 bg-gray-light2/40 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <span className="text-gray dark:text-gray-light text-lg font-medium">
            Logging in...
          </span>
        </div>
      )}

      <div
        className="relative z-30 w-full max-w-md p-8
             bg-white/40 dark:bg-black/40    // translucent background
             rounded-lg shadow-lg
             backdrop-blur-md"
      >


        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            {/* Light Theme Logo */}
            <img
              src={logo}
              alt="Rixura Logo"
              className="w-24 h-10 object-contain dark:hidden"
            />

            {/* Dark Theme Logo */}
            <img
              src={logoWhite}
              alt="Rixura Logo Dark"
              className="w-24 h-10 object-contain hidden dark:block"
            />
          </div>

        </div>


        <h1 className="mb-6 text-2xl font-bold text-center">
          Sign in to your account
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormInput
                name="username"
                placeholder="Enter Username"
                type="text"
              />

              <FormInput
                name="password"
                placeholder="Enter Password"
                type="password"
              />

              {/* Spacer for future options */}
              <div className="flex items-center justify-between mb-6"></div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              {/* Forgot Password Trigger */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:underline"
                  onClick={() => setForgotOpen(true)}
                >
                  Forgot Password?
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Modal Rendering */}
        {isForgotOpen && (
          <YourForgotPasswordModal
            isOpen={isForgotOpen}
            onClose={() => setForgotOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default LoginPage;