import { useState, useEffect } from "react";
import { ReportService } from "../services/Reports.service";
import { convertImageToBase64 } from "../utils/imageConvertBase64";
import centerLogo from "../assets/images/centreImage.png";

export default function useReport(reportId, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reportId) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    ReportService.getReport(reportId)
      .then(async (res) => {
        console.log("API /reports/:id response:", res);
        if (!isMounted) return;

        // Start image conversion
        setImageLoading(true);
        const images = {};

        try {
          // Convert signature (use radiologist.signatureUrl if patient.signature is missing)
          const signatureUrl =
            res?.patient?.signature || res?.radiologist?.signatureUrl;
          console.log("Signature URL:", signatureUrl);
          if (signatureUrl) {
            try {
              const base64Signature = await convertImageToBase64(signatureUrl);
              console.log(
                "Signature converted to base64:",
                base64Signature.substring(0, 50) + "..."
              );
              images.signature = base64Signature;
            } catch (error) {
              console.error(
                "Failed to load signature image:",
                error.message,
                error.stack
              );
              images.signature = null; // Keep null to avoid fallback
            }
          } else {
            console.log("No signature URL available");
            images.signature = null;
          }

          // Convert logo
          if (res?.center?.logo) {
            try {
              const base64Logo = await convertImageToBase64(res.center.logo);
              console.log(
                "Logo converted to base64:",
                base64Logo.substring(0, 50) + "..."
              );
              images.logo = base64Logo;
            } catch (error) {
              console.error(
                "Failed to load logo image:",
                error.message,
                error.stack
              );
              images.logo = centerLogo;
            }
          } else {
            console.log("No center logo available, using fallback");
            images.logo = centerLogo;
          }

          // Update data with processed images
          setData({
            ...res,
            patient: {
              ...res.patient,
              signature: images.signature,
            },
            center: {
              ...res.center,
              logo: images.logo,
            },
          });
        } catch (error) {
          console.error("Error processing images:", error.message, error.stack);
          setData({
            ...res,
            patient: {
              ...res.patient,
              signature: null,
            },
            center: {
              ...res.center,
              logo: centerLogo,
            },
          });
        } finally {
          if (isMounted) setImageLoading(false);
        }
      })
      .catch((err) => {
        console.error("Report fetch error:", err.message, err.stack);
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [reportId]);

  return { data, loading: loading || imageLoading, error };
}
