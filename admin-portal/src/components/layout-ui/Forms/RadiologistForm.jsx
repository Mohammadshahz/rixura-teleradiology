// src/components/forms/RadiologistForm.jsx
import React from "react";
import { Formik, Form } from "formik";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import FormInput from "../InputFields/FormInput";
import Button from "../Button";
import FormFileInput from "../InputFields/FormFileInput";
// import FormAutocomplete from "../InputFields/FormAutocomplete";

const RadiologistForm = ({
  initialValues,
  onSubmit,
  mode = "add",
  validationSchema,
}) => {
  const navigate = useNavigate();

  const title = mode === "edit" ? "Edit Radiologist" : "Add Radiologist";
  const buttonText = mode === "edit" ? "Save Changes" : "Add Radiologist";

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
            <div className="flex flex-col gap-4 border p-4 rounded shadow ">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
                <label htmlFor="name" className="pt-2">
                  Radiologist Name
                </label>
                <FormInput
                  name="name"
                  type="text"
                  placeholder="Enter radiologist name"
                />
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
                <label htmlFor="email" className="pt-2">
                  Email
                </label>
                <FormInput name="email" type="text" placeholder="Enter email" />
              </div>

              {mode === "add" && (
                <>
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
                    <label htmlFor="password" className="pt-2">
                      Password
                    </label>
                    <FormInput
                      name="password"
                      type="password"
                      placeholder="Enter password"
                    />
                  </div>
                </>
              )}

              <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
                <label htmlFor="phoneNumber" className="pt-2">
                  Phone Number
                </label>
                <FormInput
                  name="phoneNumber"
                  type="text"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
                <label htmlFor="address" className="pt-2">
                  Address
                </label>
                <FormInput
                  name="address"
                  type="text"
                  placeholder="Enter address"
                />
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                <label htmlFor="signature" className="pt-2">
                  Signature
                </label>
                <FormFileInput name="signature" />
              </div>
            </div>

            <div className="flex flex-col gap-4 border p-4 rounded shadow ">
              <label className="pt-2 text-xl font-medium border-b-slate-300">
                Prices
              </label>
              {/* CT-SCAN Prices */}
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                <label className="pt-2">CT-SCAN Regular</label>
                <FormInput
                  name="prices.CT-SCAN.regular"
                  type="number"
                  placeholder="Enter regular price for CT-SCAN"
                />
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                <label className="pt-2">CT-SCAN Review</label>
                <FormInput
                  name="prices.CT-SCAN.review"
                  type="number"
                  placeholder="Enter review price for CT-SCAN"
                />
              </div>

              {/* XRAY Prices */}
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                <label className="pt-2">X-RAY Regular</label>
                <FormInput
                  name="prices.XRAY.regular"
                  type="number"
                  placeholder="Enter regular price for X-RAY"
                />
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                <label className="pt-2">X-RAY Review</label>
                <FormInput
                  name="prices.XRAY.review"
                  type="number"
                  placeholder="Enter review price for X-RAY"
                />
              </div>

              {/* MRI Prices */}
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                <label className="pt-2">MRI Regular</label>
                <FormInput
                  name="prices.MRI.regular"
                  type="number"
                  placeholder="Enter regular price for MRI"
                />
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                <label className="pt-2">MRI Review</label>
                <FormInput
                  name="prices.MRI.review"
                  type="number"
                  placeholder="Enter review price for MRI"
                />
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RadiologistForm;
