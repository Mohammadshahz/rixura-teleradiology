import React from "react";
import { Formik, Form } from "formik";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import FormInput from "../InputFields/FormInput";
import Button from "../Button";
import FormFileInput from "../InputFields/FormFileInput";

const EditCenterForm = ({
  centerInitialValues,
  userInitialValues,
  centerValidationSchema,
  userValidationSchema,
  onCenterSubmit,
  onUserSubmit,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8">
      {/* --- Center Form --- */}
      <Formik
        initialValues={centerInitialValues}
        validationSchema={centerValidationSchema}
        onSubmit={onCenterSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4 border p-4 rounded shadow">
            <div className="border-b border-b-slate-300 pb-2 gap-4 flex items-center">
              <div
                className="text-lg w-6 h-6 cursor-pointer"
                onClick={() => navigate(-1)}
              >
                <ChevronLeftIcon className="text-lg text-gray-400" />
              </div>
              <h1 className="text-xl font-medium">Edit Center</h1>
              <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Center"}
              </Button>
            </div>

            {/* <div className="grid md:grid-cols-2 gap-4"> */}
            <div className="mb-2 p-2">
              {isSubmitting && (
                <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-gray-light text-lg font-medium">
                    Updating center...
                  </span>
                </div>
              )}
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
                <label htmlFor="centreName" className="pt-2">
                  Center Name
                </label>
                <FormInput
                  name="centreName"
                  type="text"
                  placeholder="Enter center name"
                />
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
                <label htmlFor="centreCode" className="pt-2">
                  Center Code
                </label>
                <FormInput
                  name="centreCode"
                  type="text"
                  placeholder="Enter center code"
                  disabled
                />
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
                <label htmlFor="centerAddress" className="pt-2">
                  Center Address
                </label>
                <FormInput
                  name="centerAddress"
                  type="text"
                  placeholder="Enter center address"
                />
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
                <label htmlFor="phoneNumbers" className="pt-2">
                  Phone Number
                </label>
                <FormInput
                  name="phoneNumbers"
                  type="text"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
                <label htmlFor="website" className="pt-2">
                  Website
                </label>
                <FormInput
                  name="website"
                  type="text"
                  placeholder="Enter website URL"
                />
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
                <label htmlFor="centerScopes" className="pt-2">
                  Center Scopes
                </label>
                <FormInput
                  name="centerScopes"
                  type="text"
                  placeholder="Enter Center Scopes with comma separated"
                />
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                <label htmlFor="logo" className="pt-2">
                  Logo
                </label>
                <FormFileInput name="logo" />
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {/* --- User Form --- */}
      <Formik
        initialValues={userInitialValues}
        validationSchema={userValidationSchema}
        onSubmit={onUserSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4 border p-4 rounded shadow">
            <div className="border-b border-b-slate-300 pb-2 gap-4 flex items-center">
              <h1 className="text-xl font-medium">Edit User</h1>
              <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update User"}
              </Button>
            </div>

            {/* <div className="grid md:grid-cols-2 gap-4"> */}
            <div className="p-2">
              {isSubmitting && (
                <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-gray-light text-lg font-medium">
                    Updating center user...
                  </span>
                </div>
              )}
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
                <label htmlFor="name" className="pt-2">
                  Name
                </label>
                <FormInput name="name" type="text" placeholder="Enter name" />
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
                <label htmlFor="email" className="pt-2">
                  Email
                </label>
                <FormInput name="email" type="text" placeholder="Enter email" />
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2 ">
                <label htmlFor="mobileNumber" className="pt-2">
                  Mobile Number
                </label>
                <FormInput
                  name="mobileNumber"
                  type="text"
                  placeholder="Enter mobile number"
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
                  placeholder="Enter regular price for XRAY"
                />
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                <label className="pt-2">X-RAY Review</label>
                <FormInput
                  name="prices.XRAY.review"
                  type="number"
                  placeholder="Enter review price for XRAY"
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
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditCenterForm;
