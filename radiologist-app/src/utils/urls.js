const baseUrl = process.env.REACT_APP_BASE_URL;
// Authentication URLs
const authBaseUrl = `${baseUrl}/auth`;
export const loginUrl = `${authBaseUrl}/login`;
export const registerUrl = `${authBaseUrl}/register`;

export const profileUrl = `${baseUrl}/profile`;

export const reportUrl = `${baseUrl}/reports`;

export const reportFileUrl = `${reportUrl}/bulk-upload`; // For file upload/download

const reportChangeUrl = (reportId, userId) =>
  `${reportUrl}/${reportId}/user/${userId}`;

export const reportStatusUrl = (reportId, userId) =>
  `${reportChangeUrl(reportId, userId)}/status`;

export const reportRadiologistStatusUrl = (reportId) =>
  `${reportUrl}/${reportId}/update-radiologist-status`;

export const generateReportUrl = (reportId, userId) =>
  `${reportChangeUrl(reportId, userId)}/generate-content`; // For generating report

export const usersUrl = `${baseUrl}/users`;

const patientBaseUrl = `${baseUrl}/patients`;
export const patientsUrl = patientBaseUrl; // GET all, POST create
export const patientUrl = (id) => `${patientBaseUrl}/${id}`; // GET/PUT/DELETE one
export const patientCenterUrl = (centerId) =>
  `${patientBaseUrl}/center/${centerId}`; // GET/PUT/DELETE one

const feedbackBaseUrl = `${baseUrl}/feedback`;
export const feedbacksUrl = feedbackBaseUrl; // GET all, POST new
export const feedbackUrl = (id) => `${feedbackBaseUrl}/${id}`; // GET/PATCH/DELETE single

export const reportCommentBaseUrl = `${baseUrl}/report-comments`;
export const reportCommentsUrl = (reportId) =>
  `${reportCommentBaseUrl}/report/${reportId}`; // GET all comments for a report

export const templateBaseUrl = `${baseUrl}/templates`;
export const templatesCustomUrl = (radiologistId) =>
  `${templateBaseUrl}/radiologist/${radiologistId}`; // GET all custom templates

const invoiceBaseUrl = `${baseUrl}/invoices`;
export const invoicesUrl = invoiceBaseUrl; // GET all, POST create
export const invoiceUrl = (id) => `${invoiceBaseUrl}/${id}`; // GET/UPDATE/DELETE one
export const invoiceSummaryUrl = `${invoiceBaseUrl}/summary`; // GET summary stats
