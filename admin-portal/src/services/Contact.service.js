import { contactUrl } from "../utils/urls";
import { errorHandler } from "../utils/error-handler";
import axiosInstance from "../utils/axios-instance";

//GET contacts
const getAll = () => {
  return axiosInstance
    .get(contactUrl)
    .then((res) => res.data)
    .catch(errorHandler);
};

//GET contact unread count
const getCount = () => {
  return axiosInstance
    .get(`${contactUrl}/unread-count`)
    .then((res) => res.data)
    .catch(errorHandler);
};

//GET contact by id
const getById = (id) => {
  return axiosInstance
    .get(`${contactUrl}/${id}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

//DELETE contact by id
const remove = (id) => {
  return axiosInstance
    .delete(`${contactUrl}/${id}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

//PATCH mark contact read
const updateReadById = (id) => {
  return axiosInstance
    .patch(`${contactUrl}/${id}/mark-as-read`)
    .then((res) => res.data)
    .catch(errorHandler);
};

export const ContactService = {
  getAll,
  getCount,
  getById,
  remove,
  updateReadById,
};
