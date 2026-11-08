import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import FormInput from "../InputFields/FormInput";
import Button from "../Button";
import CKEditorField from "../InputFields/CkEditorField";

const TemplateForm = ({
  initialValues,
  onSubmit,
  mode = "add",
  validationSchema,
  radiologists = [],
}) => {
  const navigate = useNavigate();

  const title = mode === "edit" ? "Edit Template" : "Add Template";
  const buttonText = mode === "edit" ? "Save Changes" : "Add Template";

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
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
            <h1 className="text-xl font-medium">{title}</h1>
            <Button type="submit" className="ml-auto" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : buttonText}
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
                  {mode === "edit"
                    ? "Updating radiologist..."
                    : "Submitting radiologist..."}
                </span>
              </div>
            )}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
              <label htmlFor="title" className="pt-2">
                Template Title
              </label>
              <FormInput
                name="title"
                type="text"
                placeholder="Enter template title"
              />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
              <label htmlFor="description" className="pt-2">
                Template Description
              </label>
              <CKEditorField name="description" label="Description" required />{" "}
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
              <label htmlFor="radiologistId" className="pt-2">
                Assign Radiologist
              </label>
              <Field
                as="select"
                name="radiologistId"
                className="px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 border-gray-light dark:border-gray-dark bg-white text-gray-dark dark:bg-black dark:text-gray-light"
              >
                <option value="">-- Select Radiologist --</option>
                {radiologists.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Field>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TemplateForm;
