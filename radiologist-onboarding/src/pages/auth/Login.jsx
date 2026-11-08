import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

// Optional: Import your custom FormInput component
import FormInput from "../../components/FormInput";
import Button from "../../components/layout-ui/Button";

const LoginPage = () => {
  const navigate = useNavigate();
  const [autoFill, setAutoFill] = useState(false);

  // Validation schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Must be at least 3 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Must be at least 6 characters")
      .required("Password is required"),
    rememberMe: Yup.boolean(),
  });

  const initialValues = {
    username: "",
    password: "",
    rememberMe: false,
  };

  // Submit handler
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Simulate server delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store a fake token for authentication
      localStorage.setItem("token", "fake-jwt-token");

      // Redirect to home
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-fill credentials for testing
  const handleSelfAuthChange = (e, setFieldValue) => {
    const checked = e.target.checked;
    setAutoFill(checked);

    if (checked) {
      setFieldValue("username", "admin", false);
      setFieldValue("password", "StrongP@ssword1", false);
    } else {
      setFieldValue("username", "", false);
      setFieldValue("password", "", false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-gray-900 bg-slate-200">
      <div className="w-full max-w-md p-8 bg-slate-50 dark:bg-gray-950 rounded-lg shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-cyan-500 rounded"></div>
            <span className="ml-2 text-xl font-bold">Brand Logo</span>
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
                <div className="flex items-center">
                  <Field
                    name="rememberMe"
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                {/* Self Auth Checkbox */}
                <div className="flex items-center">
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
                </div>
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
