import { Formik, Form, Field } from "formik";
// Optional: Import your custom FormInput component
import Button from "../../components/layout-ui/Button";
import FormInput from "../../components/layout-ui/InputFields/FormInput";
import useAuth from "../../hooks/useAuth";
import { logo, logoWhite } from "../../assets";
import loginImage from "../../assets/images/loginImage.png";
import { useState } from "react";
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

          <div className="space-y-1 pl-1">
            {/* ✅ Email */}
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
              📧{" "}
              <a
                href="mailto:support@rixura@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                support@rixura@gmail.com
              </a>
            </p>

            {/* ✅ Phone */}
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
              📞{" "}
              <span className="text-gray-500 dark:text-gray-400">
                +91 9921447664
              </span>
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button variant="outlined" className="px-16" onClick={onClose}>
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
  const [isForgotOpen, setForgotOpen] = useState(false);

  return (
    <div
      className="flex items-center justify-center min-h-screen dark:bg-gray-900 bg-slate-200"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url(${loginImage})`,
      }}
    >
      {/* Login Form Container */}
      {/* 🔁 Loader Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <span className="text-gray-light text-lg font-medium">
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
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
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
        </div>

        {/* Title */}
        <h1 className="mb-6 text-2xl font-bold text-center">
          Sign in to your account
        </h1>

        {/* Formik Login Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              {/* Username Field */}
              <FormInput
                name="username"
                placeholder="Enter Username"
                type="text"
              />

              {/* Password Field */}
              <FormInput
                name="password"
                placeholder="Enter Password"
                type="password"
              />

              {/* Options Row: Remember Me + Self Auth */}
              <div className="flex items-center justify-between mb-6">
                {/* Remember Me */}
                {/* <div className="flex items-center">
                  <Field
                    name="rememberMe"
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Remember me
                  </label>
                </div> */}

                {/* Self Auth Checkbox */}
                {/* <div className="flex items-center">
                  <input
                    id="selfAuth"
                    type="checkbox"
                    checked={autoFill}
                    onChange={(e) => handleSelfAuthChange(e, setFieldValue)}
                    className="w-4 h-4 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="selfAuth"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Self Auth
                  </label>
                </div> */}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                // className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
              {/* Forgot Password Trigger
              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:underline"
                  onClick={() => setForgotOpen(true)}
                >
                  Forgot Password?
                </button>
              </div> */}
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
