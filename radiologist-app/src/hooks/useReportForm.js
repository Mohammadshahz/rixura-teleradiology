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


  return {
    reportTypes,
    xrayTypes,
  };
};
export default useReportForm;
