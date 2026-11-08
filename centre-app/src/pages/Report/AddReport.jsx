import { Formik, Form } from "formik";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Button from "../../components/layout-ui/Buttons";
import FormInput from "../../components/layout-ui/InputFields/FormInput";
import FormAutocomplete from "../../components/layout-ui/InputFields/FormAutocomplete";
import ActiveInactiveSwitch from "../../components/ActiveInactiveSwitch";
import DicomFileUploader from "../../components/layout-ui/Buttons/DiacomFileUploader";
import useReportForm from "../../hooks/useReportForm";
import { Close } from "@mui/icons-material";

const AddReport = ({ edit = false }) => {
  const navigate = useNavigate();

  const {
    initialValues,
    validationSchema,
    handleSubmit,
    radiologists,
    patients,
    xrayTypes,
    isActive,
    handleToggle,
    loading,
    submitting,
  } = useReportForm(edit);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, errors, touched }) => (
        <Form className="flex flex-col relative">
          {/* Header */}
          <div className="mb-4 border-b border-gray-light2 p-2 gap-4 flex items-center">
            <div
              className="text-lg w-6 h-6 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <ChevronLeftIcon className="text-gray-light" />
            </div>
            <h1 className="text-xl font-medium">
              {edit ? "Edit" : "Add"} Report
            </h1>
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              <Button type="submit" disabled={loading || submitting}>
                {submitting
                  ? edit
                    ? "Updating Report..."
                    : "Submitting Report..."
                  : edit
                  ? " Update Report"
                  : "Submit Report"}
              </Button>
            </div>
          </div>

          {/* Loader Overlay */}
          <div
            className={`px-4 flex flex-col md:gap-4 transition-opacity ${
              loading || submitting ? "pointer-events-none opacity-30" : ""
            }`}
          >
            {(submitting || (edit && loading)) && (
              <div className="absolute inset-0 z-10 bg-gray-light2/40 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <span className="text-gray dark:text-gray-light text-lg font-medium">
                  {submitting
                    ? edit
                      ? "Updating report..."
                      : "Submitting report..."
                    : "Loading form data..."}
                </span>
              </div>
            )}

            {/* Form Body */}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
              <label htmlFor="title" className="pt-2">
                Title
              </label>
              <FormInput
                name="title"
                type="text"
                placeholder="Enter report title"
              />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
              <label htmlFor="patientName" className="pt-2">
                Patient Name
              </label>
              <FormAutocomplete
                name="patientName"
                placeholder="Select patient"
                suggestions={patients}
              />

              {/* if patient not in list, show hint + add button */}
              <div className="col-span-full flex justify-end items-center mt-2">
                <span className="text-sm text-gray-600 mr-4">
                  Patient does not exist ?
                </span>
                <Button
                  type="button"
                  onClick={() => navigate("../../patients/add")}
                  className="text-sm"
                >
                  Add New Patient
                </Button>
              </div>

            </div>


            <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
              <label htmlFor="complaint" className="pt-2">
                Complaint
              </label>
              <FormInput
                name="complaint"
                as="textarea"
                rows={3}
                type="text"
                placeholder="Enter complaint"
              />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
              <label htmlFor="xrayType" className="pt-2">
                Report Category
              </label>
              <FormAutocomplete
                name="xrayType"
                placeholder="Select report Category"
                suggestions={xrayTypes}
              />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
              <label htmlFor="chooseRadiologist" className="pt-2">
                Choose Radiologist (Optional)
              </label>
              <FormAutocomplete
                name="chooseRadiologist"
                placeholder="Select radiologist"
                suggestions={[{ id: "", label: "None" }, ...radiologists]}
                disabled={edit}
              />

            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
              <label htmlFor="reportFile" className="pt-2">
                Upload Report
              </label>
              <div className="flex flex-col gap-2">
                <DicomFileUploader
                  value={values.reportFile}
                  onChange={(files) => setFieldValue("reportFile", files)}
                  error={errors.reportFile}
                  touched={touched.reportFile}
                />
                {values?.reportUrls?.map?.((url, index) => (
                  <div
                    className="flex gap-2 p-1 test-sm bg-gray-200 dark:bg-gray-900 rounded-sm cursor-pointer justify-between"
                    onClick={() => {
                      const urlList = values.reportUrls;

                      const pushUrlList = [];

                      const filterReportUrls = values.reportUrls.filter(
                        (_, i) => {
                          if (i === index) {
                            pushUrlList.push(url);
                          }
                          return i !== index;
                        }
                      );
                      setFieldValue("reportUrlsToSend", [
                        ...(values.reportUrlsToSend || []),
                        ...pushUrlList,
                      ]);
                      setFieldValue("reportUrls", filterReportUrls);
                    }}
                  >
                    <span>File-{index + 1} </span>
                    <Close />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
              <label htmlFor="reportType" className="pt-2">
                Report Type (Optional)
              </label>
              <ActiveInactiveSwitch
                isActive={isActive}
                onToggle={handleToggle}
                activeText="Critical"
                inactiveText="Normal"
                activeColor="bg-red-500"
                textColor="text-white"
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddReport;
