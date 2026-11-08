// Updated: GenerateReport.jsx
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useFormikContext } from "formik";

import FormInput from "../../components/layout-ui/InputFields/FormInput";
import FormAutocomplete from "../../components/layout-ui/InputFields/FormAutocomplete";
import Button from "../../components/layout-ui/Button";
import CKEditorField from "../../components/layout-ui/InputFields/CkEditorField";
import PDFViewerComponent from "../../components/pdf/PDFViewer";
import InputModal from "../../components/layout-ui/Modal/InputModal";
import radiologistSignature from "../../assets/images/radiologistSign.png";
import centerLogo from "../../assets/images/centreImage.png";
import { convertImageToBase64 } from "../../utils/imageConvertBase64";
import { useReportStatusContext } from "../../context/ReportStatusContext";
import useGenerateReport from "../../hooks/useGenerateReport";
import { toast } from "react-toastify";

// TemplateSync autofills CKEditor content when template is selected
const TemplateSync = ({ getDescriptionByTitle }) => {
  const { values, setFieldValue } = useFormikContext();

  React.useEffect(() => {
    if (values.template) {
      const description = getDescriptionByTitle(values.template);
      setFieldValue("comments", description);
    }
  }, [values.template, getDescriptionByTitle, setFieldValue]);

  return null;
};

const validationSchema = Yup.object({
  reportTitle: Yup.string().required("Report title is required"),
  template: Yup.string().required("Template selection is required"),
  comments: Yup.string().required("Comments are required"),
});

const GenerateReport = ({ onSubmit, reportData }) => {
  const {
    templates,
    getDescriptionByTitle,
    applyTemplateToReport,
    saveAsNewTemplate,
    loading,
  } = useGenerateReport();
  
  // Format templates for autocomplete
  const templateOptions = templates.map(template => ({
    id: template.title,
    label: template.title
  }));
  const { setReportGenerated } = useReportStatusContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [showPDF, setShowPDF] = useState(false);
  
  const [base64Images, setBase64Images] = useState({
    signature: null,
    logo: null,
    isLoading: true
  });

  const patient = reportData?.patient || {};
  const radiologist = reportData?.radiologist || {};
  const centre = reportData?.center || {};
  
  useEffect(() => {
    const loadImages = async () => {
      setBase64Images(prev => ({ ...prev, isLoading: true }));
      const images = {};

      try {
        // Signature
        if (radiologist?.signatureUrl) {
          const isS3Url = radiologist.signatureUrl.includes('amazonaws.com') ||
                          radiologist.signatureUrl.includes('s3.') ||
                          radiologist.signatureUrl.includes('X-Amz-');
          
          if (isS3Url) {
            images.signature = radiologistSignature;
          } else {
            try {
              const base64Signature = await convertImageToBase64(radiologist.signatureUrl);
              images.signature = base64Signature;
            } catch (error) {
              console.error("Failed to load signature image", error);
              images.signature = radiologistSignature;
            }
          }
        } else {
          images.signature = radiologistSignature;
        }

        // Logo
        if (centre?.logoUrl) {
          try {
            const base64Logo = await convertImageToBase64(centre.logoUrl);
            images.logo = base64Logo;
          } catch (error) {
            console.error("Failed to load logo image", error);
            images.logo = centerLogo;
          }
        } else {
          images.logo = centerLogo;
        }

        setBase64Images({
          signature: images.signature,
          logo: images.logo,
          isLoading: false
        });
      } catch (error) {
        console.error("Error loading images:", error);
        setBase64Images({
          signature: radiologistSignature,
          logo: centerLogo,
          isLoading: false
        });
      }
    };

    loadImages();
  }, [radiologist, centre]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!values.comments.trim()) {
        toast.error("Report content cannot be empty");
        return;
      }

      const selectedTemplate = templates.find(t => t.title === values.template);
      const templateId = selectedTemplate?.id;

      await applyTemplateToReport(reportData.id, values.comments, templateId, values.reportTitle);
      toast.success("Report generated successfully!");
      setReportGenerated(true);

      setPdfData({
        reportTitle: selectedTemplate?.title || values.reportTitle,
        comments: values.comments,
        xRayType: reportData?.xRayType || "Radiology",
      });

      setShowPDF(true);
      onSubmit?.(values);
    } catch (err) {
      console.error("Report generation failed:", err);
      toast.error("Failed to generate report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {showPDF ? `${pdfData?.reportTitle} Preview` : "Generate Report"}
        </h2>
        {showPDF && (
          <Button onClick={() => setShowPDF(false)} variant="outlined">
            Back to Editor
          </Button>
        )}
      </div>

      {!showPDF ? (
        <Formik
          initialValues={{ reportTitle: reportData.title || "", template: "", comments: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, isValid, dirty }) => (
            <Form className="space-y-4">
              <FormInput name="reportTitle" label="Report Title" required />
              <FormAutocomplete
                name="template"
                label="Select Template"
                suggestions={templateOptions}
                disabled={loading}
                required
              />
              <TemplateSync getDescriptionByTitle={getDescriptionByTitle} />
              <CKEditorField name="comments" label="Comments" required />
              <div className="flex gap-4 pt-2">
                <Button type="button" onClick={() => setModalOpen(true)} variant="outlined">
                  Save as Template
                </Button>
                <Button type="submit" disabled={!isValid || !dirty || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      Generating...
                    </>
                  ) : "Generate Report"}
                </Button>
              </div>
              <InputModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                comments={values.comments}
                onSave={(title, comments) => {
                  saveAsNewTemplate(comments, title);
                  setModalOpen(false);
                }}
              />
            </Form>
          )}
        </Formik>
      ) : (
        <PDFViewerComponent
          patient={{
            name: patient.name || "N/A",
            id: patient.centerPatientNumber ? patient.centerPatientNumber.toString().padStart(4, "0") : "N/A",
            referredBy: radiologist.name || "N/A",
            age: patient.age || "N/A",
            gender: patient.gender || "N/A",
            signature: base64Images.signature,
          }}
          centre={{
            name: centre.name || "N/A",
            address: centre.address || "N/A",
            website: centre.website || "",
            contacts: centre.contacts || [],
            logo: base64Images.logo,
            logoVisible: true,
          }}
          report={{
            title: pdfData?.reportTitle || reportData.title,
            xRayType: pdfData?.xRayType || reportData.xRayType,
          }}
          templateData={pdfData?.comments || ""}
          footerItems={Array.isArray(centre.centerScopes) ? centre.centerScopes : []}
        />
      )}
    </div>
  );
};

export default GenerateReport;
