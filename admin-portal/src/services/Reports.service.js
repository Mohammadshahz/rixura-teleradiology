import { errorHandler } from "../utils/error-handler";
import { reportFileUrl, reportStatusUrl, reportUrl } from "../utils/urls";
import axiosInstance from "../utils/axios-instance";

// POST: Add a new report
const addReport = async (formData) => {
  return axiosInstance
    .post(reportFileUrl, formData)
    .then((res) =>{
        return res.data})
    .catch(errorHandler);
};

// PUT: Edit an existing report
const editReport = async (reportId, formData) => {
  return axiosInstance
    .patch(`${reportUrl}/${reportId}`, formData)
    .then((res) => res.data)
    .catch(errorHandler);
};

// PATCH: Update report status with userId
const updateReportStatus = async (reportId, userId, statusData) => {
  return axiosInstance
    .patch(reportStatusUrl(reportId, userId), statusData)
    .then((res) => res.data)
    .catch(errorHandler);
};

// GET: Fetch a report
const getReport = async (reportId) => {
  return axiosInstance
    .get(`${reportUrl}/${reportId}`)
    .then((res) => {
        return res.data})
    .catch(errorHandler);
};

// DELETE: Delete a report
const deleteReport = async (reportId) => {
  return axiosInstance
    .delete(`${reportUrl}/${reportId}`)
    .then((res) => res.data)
    .catch(errorHandler);
};


export const ReportService = {
  addReport,
  editReport,
  updateReportStatus,
  getReport,
  deleteReport,
};
