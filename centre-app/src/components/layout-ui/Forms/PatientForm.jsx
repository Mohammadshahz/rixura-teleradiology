import React from "react";
import { Formik, Form } from "formik";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import FormInput from "../InputFields/FormInput";
import Button from "../Buttons";
import FormAutocomplete from "../InputFields/FormAutocomplete";

const genderOptions = [
  { label: "Male", id: "male" },
  { label: "Female", id: "female" },
  { label: "Others", id: "others" },
];

const PatientForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  mode = "add",
}) => {
  const navigate = useNavigate();
  const title = mode === "edit" ? "Edit Patient" : "Add Patient";
  const buttonText = mode === "edit" ? "Save Changes" : "Submit Patient";

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
              isSubmitting && mode === "edit"
                ? "pointer-events-none opacity-30"
                : ""
            }`}
          >
            {isSubmitting && (
              <div className="absolute inset-0 z-10 bg-gray-light2/40 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <span className="text-gray dark:text-gray-light text-lg font-medium">
                  {mode === "edit"
                    ? "Updating patient..."
                    : "Submitting patient..."}
                </span>
              </div>
            )}
            {/* Patient Name */}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 items-center">
              <label htmlFor="patientName" className="pb-2">
                Patient Name
              </label>
              <FormInput
                name="patientName"
                type="text"
                placeholder="Enter patient name"
              />
            </div>
            {/* Age */}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 items-center">
              <label htmlFor="age" className="pt-2">
                Age
              </label>
              <FormInput name="age" type="number" placeholder="Enter age" />
            </div>
            {/* Gender */}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 items-center">
              <label htmlFor="gender" className="pt-2">
                Gender
              </label>
              <FormAutocomplete
                name="gender"
                placeholder="Select gender"
                suggestions={genderOptions}
              />
            </div>
            {/* Phone Number */}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 items-center">
              <label htmlFor="phoneNumber" className="pt-2">
                Phone Number
              </label>
              <FormInput
                name="phoneNumber"
                type="text"
                placeholder="Enter phone number"
              />
            </div>
            {/* Email */}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 items-center">
              <label htmlFor="email" className="pt-2">
                Email
              </label>
              <FormInput name="email" type="text" placeholder="Enter email" />
            </div>
            {/* Date */}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2 items-center">
              <label htmlFor="date" className="pt-2">
                Date of Birth
              </label>
              <FormInput
                name="date"
                type="text"
                placeholder="dd/mm/yyyy"
                pattern="\d{1,2}/\d{1,2}/\d{4}"
                maxLength={10}
                onInput={(e) => {
                  const target = e.target;
                  const value = target.value;
                  const pos = value.length;
                  if (pos === 2) {
                    target.value = `${value}/`;
                    target.selectionStart = target.selectionEnd = pos + 1;
                  } else if (pos === 5) {
                    target.value = `${value.slice(0, pos)}/`;
                    target.selectionStart = target.selectionEnd = pos + 1;
                  }
                }}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PatientForm;
