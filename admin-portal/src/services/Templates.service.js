import { errorHandler } from "../utils/error-handler";
import { templatesUrl } from "../utils/urls";
import axiosInstance from "../utils/axios-instance";

//Get all templates
const getAll = async () => {
  return axiosInstance
    .get(templatesUrl)
    .then((res) => res.data)
    .catch(errorHandler);
};

// GET single templates by ID
const getById = async (id) => {
  return axiosInstance
    .get(`${templatesUrl}/${id}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

// GET single templates by ID
const getByRadiologistId = async (id) => {
  return axiosInstance
    .get(`${templatesUrl}/${id}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

// POST template
const create = async (body) => {
  return axiosInstance
    .post(templatesUrl, body)
    .then((res) => res.data)
    .catch(errorHandler);
};

// PUT (update) template
const update = async (id, body) => {
  return axiosInstance
    .put(`${templatesUrl}/${id}`, body)
    .then((res) => res.data)
    .catch(errorHandler);
};

// DELETE template
const remove = async (id) => {
  return axiosInstance
    .delete(`${templatesUrl}/${id}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

export const TemplatesService = {
  getAll,
  getById,
  getByRadiologistId,
  create,
  update,
  remove,
};
