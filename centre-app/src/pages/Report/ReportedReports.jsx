import React, { useEffect, useMemo, useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Button from "../../components/layout-ui/Buttons";
import PDFViewerComponent from "../../components/pdf/PDFViewer";
import useReport from "../../hooks/useReport";
import ServerPaginationDataGrid from "../../components/layout-ui/Tables/ServerPaginationDataGrid";
import { reportUrl } from "../../utils/urls";
import StatusChip from "../../components/layout-ui/Chip/Chip";
import { useSelector } from "react-redux";
import radiologistSignature from "../../assets/images/radiologistSign.png";
import centerLogo from "../../assets/images/centreImage.png";
import { convertImageToBase64 } from "../../utils/imageConvertBase64";

const ReportedReports = ({ gridRef, xrayType, reportType, search }) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const {
    data: selectedReport,
    loading: reportLoading,
    error: reportError,
  } = useReport(selectedReportId);
  const navigate = useNavigate();
  const centerId = useSelector((state) => state.auth.centerId);
  const [base64Images, setBase64Images] = useState({
    signature: null,
    logo: null,
    isLoading: true,
  });

  const columns = [
    {
      headerName: "Patient Details",
      minWidth: 300,
      filter: "agTextColumnFilter",
      cellRenderer: (params) => {
        const { patient, reportType } = params.data;
        if (!patient) return "—";
        return (
          <div className="flex flex-col gap-0">
            <p className="text-gray-light text-sm font-medium dark:text-gray-dark">
              #{patient.centerPatientNumber}
            </p>
            <p className="text-slate-800 text-lg font-medium dark:text-slate-200">
              {patient.name}
            </p>
            <p className="flex items-center gap-2 text-slate-800 text-base dark:text-slate-200">
              <span>
                {patient.age}, {patient.gender || "Others"}
              </span>
              {reportType === "CRITICAL" && <StatusChip value={reportType} />}
            </p>
          </div>
        );
      },
    },
    {
      headerName: "Complaint",
      field: "complaint",
      minWidth: 200,
      cellRenderer: (params) => {
        const text = params.data.complaint;
        return (
          <p className="text-lg truncate max-w-[180px] pt-4" title={text}>
            {text}
          </p>
        );
      },
    },
    {
      headerName: "Mode/Type",
      field: "xRayType",
      cellRenderer: (params) => (
        <p className="text-lg pt-4">{params.data.xRayType}</p>
      ),
    },
    {
      headerName: "Radiologist",
      field: "radiologist",
      cellRenderer: (params) => (
        <p className="text-lg pt-4">
          {params.data.radiologist?.name ?? (
            <span className="italic text-gray-dark">Unassigned</span>
          )}
        </p>
      ),
    },
    {
      headerName: "Date/Time",
      field: "createdAt",
      cellRenderer: (params) => {
        const date = new Date(params.data.createdAt);
        return <p className="text-base pt-4">{date.toLocaleString()}</p>;
      },
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 230,
      resizable: false,
      cellRenderer: (params) => (
        <div className="flex items-center space-x-2 pt-4">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/diacom-viewer/${params.data.id}`);
            }}
            size="sm"
            startIcon={<EyeIcon className="w-5 h-5" />}
          >
            View
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedReportId(params.data.id);
              setViewModalOpen(true);
            }}
            size="sm"
          >
            View Report
          </Button>
        </div>
      ),
    },
  ];

  const query = useMemo(
    () => ({
      status: "REPORTED",
      centerId,
      ...(search ? { radiologistName: search } : {}),
      ...(xrayType ? { xRayType: xrayType } : {}),
      ...(reportType ? { reportType: reportType } : {}),
    }),
    [search, xrayType, reportType]
  );

  useEffect(() => {
    const loadImages = async () => {
      setBase64Images((prev) => ({ ...prev, isLoading: true }));
      const images = {};

      try {
        // Signature
        if (selectedReport?.radiologist?.signatureUrl) {
          console.log('Loading signature from URL:', selectedReport.radiologist.signatureUrl);
          try {
            const base64Signature = await convertImageToBase64(
              selectedReport.radiologist.signatureUrl
            );
            images.signature = base64Signature;
            console.log('Signature loaded successfully, length:', base64Signature?.length);
          } catch (error) {
            console.error("Failed to load signature image", error);
            console.log('Using fallback signature image');
            images.signature = radiologistSignature;
          }
        } else {
          console.log('No signature URL provided, using fallback');
          images.signature = radiologistSignature;
        }

        // Logo
        if (selectedReport?.center?.logoUrl) {
          console.log('Loading logo from URL:', selectedReport.center.logoUrl);
          try {
            const base64Logo = await convertImageToBase64(
              selectedReport.center.logoUrl
            );
            images.logo = base64Logo;
            console.log('Logo loaded successfully, length:', base64Logo?.length);
          } catch (error) {
            console.error("Failed to load logo image", error);
            console.log('Using fallback logo image');
            images.logo = centerLogo;
          }
        } else {
          console.log('No logo URL provided, using fallback');
          images.logo = centerLogo;
        }

        console.log('All images loaded, setting state');
        setBase64Images({
          signature: images.signature,
          logo: images.logo,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error loading images:", error);
        setBase64Images({
          signature: radiologistSignature,
          logo: centerLogo,
          isLoading: false,
        });
      }
    };

    loadImages();
  }, [selectedReport]);

  return (
    <div>
      <ServerPaginationDataGrid
        ref={gridRef}
        name="reported-reports"
        rowHeight={80}
        columns={columns}
        height="calc(100vh - 5.1rem)"
        url={reportUrl}
        query={query}
      />

      {/* Modal for viewing report PDF */}
      {viewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => {
            setViewModalOpen(false);
            setSelectedReportId(null);
          }}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-4 max-w-4xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => {
                setViewModalOpen(false);
                setSelectedReportId(null);
              }}
            >
              ✕
            </button>
            {reportLoading || base64Images.isLoading ? (
              <div className="flex flex-col items-center justify-center p-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-700 font-medium text-lg">
                  {reportLoading ? 'Loading report...' : 'Loading images...'}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {reportLoading ? 'Fetching report data' : 'Converting images for PDF'}
                </p>
              </div>
            ) : reportError ? (
              <div className="p-8 text-red-600 text-center">
                Error loading report.
              </div>
            ) : selectedReport ? (
              (() => {
                console.log("PDF Modal Data:", {
                  patient: selectedReport.patient,
                  centre: selectedReport.center,
                  report: selectedReport.title,
                  templateData: selectedReport.reportGeneratedContent,
                  footerItems: selectedReport.center.centerScopes,
                });
                return (
                  <PDFViewerComponent
                    patient={{
                      ...selectedReport.patient,
                      centerPatientNumber: selectedReport?.patient
                        ?.centerPatientNumber
                        ? String(
                            selectedReport.patient.centerPatientNumber
                          ).padStart(4, "0")
                        : "N/A",
                        signature: base64Images.signature,
                        referredBy: selectedReport?.radiologist?.name,
                    }}
                    centre={{
                      ...selectedReport.center,
                      logo: base64Images.logo,
                      logoVisible: true,
                    }}
                    report={{
                      title: selectedReport.title,
                      xRayType:
                        selectedReport.xRayType ||
                        selectedReport.reportType ||
                        "",
                    }}
                    templateData={selectedReport.reportGeneratedContent}
                    footerItems={selectedReport.center.centerScopes}
                  />
                );
              })()
            ) : (
              <div className="p-8 text-center">No report found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedReports;
