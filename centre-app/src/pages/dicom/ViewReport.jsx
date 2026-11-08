import React, { useEffect, useState } from "react";
import Button from "../../components/layout-ui/Buttons";
import centerLogo from "../../assets/images/centreImage.png";
import radiologistSignature from "../../assets/images/radiologistSign.png";
import { convertImageToBase64 } from "../../utils/imageConvertBase64";

import PDFViewerComponent from "../../components/pdf/PDFViewer";

const ViewReport = ({ reportData }) => {
  const [base64Images, setBase64Images] = useState({
    signature: null,
    logo: null,
    isLoading: true
  });

  const pid = reportData?.patient?.centerPatientNumber ? String(reportData.patient.centerPatientNumber).padStart(4, "0") : "N/A";

  useEffect(() => {
    const loadImages = async () => {
      setBase64Images(prev => ({ ...prev, isLoading: true }));
      const images = {};

      try {
        // Signature
        if (reportData?.radiologist?.signatureUrl) {
          try {
            const base64Signature = await convertImageToBase64(reportData.radiologist.signatureUrl);
            images.signature = base64Signature;
          } catch (error) {
            console.error("Failed to load signature image", error);
            images.signature = radiologistSignature;
          }
        } else {
          images.signature = radiologistSignature;
        }

        // Logo
        if (reportData?.center?.logoUrl) {
          try {
            const base64Logo = await convertImageToBase64(reportData.center.logoUrl);
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
  }, [reportData]);

  const cleanHtml = (html) => html || "No additional comments provided.";

  const templateData = cleanHtml(reportData?.reportGeneratedContent);

  const footerData = Array.isArray(reportData?.center?.centerScopes)
    ? reportData.center.centerScopes
    : [];

  const [showPDF, setShowPDF] = useState(false);
  const togglePDFView = () => {
    if (base64Images.isLoading) {
      alert("Please wait, images are still loading...");
      return;
    }
    setShowPDF(prev => !prev);
  };

  return (
    <div className="p-4 flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">
          {reportData.xRayType} Report{" "}
          <span className="text-gray-500 font-normal">
            ({reportData.patient?.name})
          </span>
        </h2>
        <Button
          type="button"
          variant="contained"
          color={"primary"}
          size="md"
          rounded="md"
          onClick={togglePDFView}
        >
          {showPDF ? "Close Report" : "View Report"}
        </Button>
      </div>

      {showPDF && (
        <div className="flex-1 w-full h-full flex flex-col">
          <div className="flex-1 overflow-auto custom-scrollbar" style={{ minHeight: 'calc(100vh - 150px)' }}>
            <PDFViewerComponent
              patient={{
                name: reportData.patient?.name,
                centerPatientNumber: pid,
                referredBy: reportData.radiologist?.name,
                age: reportData.patient?.age,
                gender: reportData.patient?.gender,
                signature: base64Images.signature
              }}
              centre={{
                name: reportData.center?.name,
                address: reportData.center?.address,
                website: reportData.center?.website,
                email: reportData.center?.email,
                contacts: reportData.center?.phoneNumbers,
                logo: base64Images.logo,
                logoVisible: true
              }}
              report={{
                title: reportData.title,
                xRayType: reportData.xRayType
              }}
              templateData={templateData}
              footerItems={footerData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReport;
