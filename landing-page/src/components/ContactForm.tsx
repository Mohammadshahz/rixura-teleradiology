import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSubmitForm } from "../hooks/useSubmitForm";
import { Send } from "lucide-react";

const ContactForm = ({ requestType = "QUERY", onSuccess }: any) => {
  const { submitContact, loading } = useSubmitForm();

  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    userType: Yup.string().required("Please select a user type"),
  });

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    message: "",
    userType: "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: any
  ) => {
    await submitContact({ ...values, requestType });
    resetForm();
    onSuccess?.();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name *
            </label>
            <Field
              name="name"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Dr. John Smith"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-sm text-red-500 mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address *
            </label>
            <Field
              name="email"
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="john.smith@hospital.com"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-sm text-red-500 mt-1"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number
          </label>
          <Field
            name="phone"
            type="tel"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            placeholder="Enter your 10-digit phone number"
          />
          <ErrorMessage
            name="phone"
            component="div"
            className="text-sm text-red-500 mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I am a *
          </label>
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <Field
                type="radio"
                name="userType"
                value="Center"
                className="text-blue-600"
              />
              <span className="text-gray-700">Center</span>
            </label>

            <label className="flex items-center space-x-2">
              <Field
                type="radio"
                name="userType"
                value="Radiologist"
                className="text-blue-600"
              />
              <span className="text-gray-700">Radiologist</span>
            </label>
          </div>
          <ErrorMessage
            name="userType"
            component="div"
            className="text-sm text-red-500 mt-1"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Message *
          </label>
          <Field
            name="message"
            as="textarea"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
            placeholder="Please tell us about your teleradiology needs..."
          />
          <ErrorMessage
            name="message"
            component="div"
            className="text-sm text-red-500 mt-1"
          />
        </div>

        {loading ? (
          <div className="text-center text-blue-600 font-semibold">
            Submitting form...
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Send Message</span>
          </button>
        )}
      </Form>
    </Formik>
  );
};

export default ContactForm;
