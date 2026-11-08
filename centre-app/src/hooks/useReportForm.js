import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ReportService } from "../services/Reports.service";
import { UserService } from "../services/Users.service";
import { PatientService } from "../services/Patient.Service";
import { useSelector } from "react-redux";

const useReportForm = (edit = false) => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const centreId = useSelector((state) => state.auth.centerId);

  const [isActive, setIsActive] = useState(false);
  const [patients, setPatients] = useState([]);
  const [radiologists, setRadiologists] = useState([]); // ✅ from API
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    title: "",
    patientName: "",
    complaint: "",
    xrayType: "",
    chooseRadiologist: "",
    reportFile: [],
  });

  const xrayTypes = [
    { label: "CT Scan", id: "CT-SCAN" },
    { label: "Xray", id: "XRAY" },
    { label: "MRI", id: "MRI" },
  ];

  const reportTypes = [
    { label: "Normal", id: "NORMAL" },
    { label: "Critical", id: "CRITICAL" },
  ];

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    patientName: Yup.string().required("Patient name is required"),
    complaint: Yup.string().required("Complaint is required"),
    xrayType: Yup.string().required("Report type is required"),
    reportFile: edit
      ? Yup.array()
      : Yup.array().min(1, "At least one report file is required"), // Enable when needed
  });

  // Fetch patients and report if editing
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const [patientRes, radiologistRes] = await Promise.all([
   PatientService.getPatientsByCenter(centreId),
          UserService.getRadiologists(),
        ]);

        setPatients(
          (patientRes?.data || patientRes || []).map((p) => ({
            label: `${p.name} (+91${p.phoneNumber}) | #${p.centerPatientNumber.toString().padStart(4, "0")}`,
            id: p.id,
          }))
        );

        setRadiologists(radiologistRes);

        if (edit && reportId) {
          const data = await ReportService.getReport(reportId);
          setInitialValues({
            title: data.title || "",
            patientName: data.patientId || "",
            complaint: data.complaint || "",
            xrayType: data.xRayType || "",
            chooseRadiologist: data.radiologistId || "",
            reportFile: [],
            reportUrls: data.reportUrls || [], // Add this if you need to handle report files
          });
          setIsActive(data.reportType === "CRITICAL");
        }
      } catch (err) {
        console.error("Error loading form data", err);
        toast.error("Failed to load form data.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [edit, reportId]);

  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  const handleSubmit = (values) => {
    setSubmitting(true); // Start submit loading

    const submitData = {
      centerId: centreId,
      title: values.title,
      patientId: values.patientName,
      xRayType: values.xrayType,
      complaint: values.complaint,
      reportType: isActive ? "CRITICAL" : "NORMAL",
      radiologistId: values.chooseRadiologist || null,
      status: values.chooseRadiologist ? "ACCEPTED" : "IDLE",
    };

    const formData = new FormData();
    // Object.entries(submitData).forEach(([key, value]) => {
    //   if (value !== null && value !== undefined) {
    //     formData.append(key, value);
    //   }
    // });
    formData.append("centerId", submitData.centerId);
    formData.append("title", submitData.title);
    formData.append("patientId", submitData.patientId);
    formData.append("xRayType", submitData.xRayType);
    formData.append("complaint", submitData.complaint);
    formData.append("reportType", submitData.reportType);
    if (submitData.radiologistId)
      formData.append("radiologistId", submitData.radiologistId || "");
    formData.append("status", submitData.status);

    if (edit) {
      values.reportUrls.length
        ? values.reportUrls.forEach((url) => {
            formData.append("reportUrls[]", url);
          })
        : formData.append("reportUrls[]", []);
    }

    // Uncomment if file upload is required
    if (values.reportFile?.length) {
      values.reportFile.forEach((file, index) => {
        formData.append("files", file);
      });
    }

    const request = edit
      ? ReportService.editReport(reportId, formData)
      : ReportService.addReport(formData);

    request
      .then(() => {
        toast.success(`Report ${edit ? "updated" : "added"} successfully`);
        navigate("/");
      })
      .catch(() => {
        toast.error("Failed to submit report");
      })
      .finally(() => {
        setSubmitting(false); // ✅ End submit loading
      });
  };

  return {
    initialValues,
    validationSchema,
    handleSubmit,
    radiologists, // ✅ used in Autocomplete
    patients,
    reportTypes,
    xrayTypes,
    isActive,
    handleToggle,
    loading, // ✅ for loading state
    submitting, // ✅ for submit loading state
  };
};
export default useReportForm;
