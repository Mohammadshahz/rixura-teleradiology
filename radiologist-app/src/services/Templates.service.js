import { errorHandler } from "../utils/error-handler"; // Make sure this path is correct
import { templateBaseUrl, templatesCustomUrl } from "../utils/urls";
import axiosInstance from "../utils/axios-instance";

// GET: Fetch all templates (can be extended with query if needed)
const getTemplates = async (query = {}) => {
  return axiosInstance
    .get(templateBaseUrl, { params: query })
    .then((res) => res.data)
    .catch(errorHandler);
};

const getTemplateById = async (id) => {
  return axiosInstance
    .get(`${templateBaseUrl}/${id}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

const getTemplatesByRadiologist = async (radiologistId) => {
  return axiosInstance
    .get(`${templatesCustomUrl(radiologistId)}`)
    .then((res) => {
      return res.data;
    })
    .catch(errorHandler);
};

// POST: Create a new template
const addTemplate = async (templateData) => {
  return axiosInstance
    .post(templateBaseUrl, templateData)
    .then((res) => res.data.data)
    .catch(errorHandler);
};

const updateTemplate = async (id, templateData) => {
  return axiosInstance
    .put(`${templateBaseUrl}/${id}`, templateData)
    .then((res) => res.data.data)
    .catch(errorHandler);
};

export const TemplateService = {
  getTemplates,
  getTemplateById,
  addTemplate,
  getTemplatesByRadiologist,
  updateTemplate,
};
