const baseUrl = process.env.REACT_APP_BASE_URL;

// Authentication URLs
const authBaseUrl = `${baseUrl}/auth`;
export const loginUrl = `${authBaseUrl}/admin-login`;
export const registerUrl = `${authBaseUrl}/register`;

//Radiologist URLs
export const userUrl = `${baseUrl}/users`;
export const usersUrl = `${baseUrl}/users`;
//Centers URLS
export const centerUrl = `${baseUrl}/centers`;
export const addCenterUrl = `${baseUrl}/centers/with-user`;

//Feedback URLS
export const feedbackUrl = `${baseUrl}/feedback`;

//Templates URLS
export const templatesUrl = `${baseUrl}/templates`;

//Reports URLS
export const reportsUrl = `${baseUrl}/reports`;

//Dashboard URLs
export const dashboardUrl = `${baseUrl}/dashboard`;
export const revenueGraphUrl = `${dashboardUrl}/revenue-graph`;
export const reportsGraphUrl = `${dashboardUrl}/reports-graph`;

//Invoices URLs
const invoiceBaseUrl = `${baseUrl}/invoices`;
export const invoicesUrl = invoiceBaseUrl; // GET all, POST create
export const invoiceUrl = (id) => `${invoiceBaseUrl}/${id}`; // GET/UPDATE/DELETE one
export const invoiceSummaryUrl = `${invoiceBaseUrl}/summary`; // GET summary stats

//Profile URLs
export const resetPasswordUrl = `${authBaseUrl}/direct-reset-password`;
export const centerUserUrl = `${baseUrl}/user-centers/center`;

//Reports URLs
export const reportUrl = `${baseUrl}/reports`;
export const reportFileUrl = `${reportUrl}/bulk-upload`; // For file upload/download
export const reportStatusUrl = (reportId, userId) =>
  `${reportUrl}/${reportId}/user/${userId}/status`;

//Contact URLs
export const contactUrl = `${baseUrl}/contact-us`;

// Report Comments URLs
export const reportCommentBaseUrl = `${baseUrl}/report-comments`;
export const reportCommentsUrl = (reportId) =>
  `${reportCommentBaseUrl}/report/${reportId}`; // GET all comments for a report
