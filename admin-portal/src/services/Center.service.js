import axiosInstance from "../utils/axios-instance";
import { errorHandler } from "../utils/error-handler";
import { addCenterUrl, centerUrl, userUrl } from "../utils/urls";

// GET all centers
const getAll = async (limit = 100) => {
  return axiosInstance
    .get(`${centerUrl}?limit=${limit}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

// GET center and user by ID
const getCenterAndUserById = async (centerId, userId) => {
  try {
    const centerRes = await axiosInstance.get(`${centerUrl}/${centerId}`);
    const userRes = await axiosInstance.get(`${userUrl}/${userId}`);
    return {
      center: centerRes.data,
      user: userRes.data,
    };
  } catch (error) {
    errorHandler(error);
  }
};

// POST create center
const create = async (body) => {
  return axiosInstance
    .post(addCenterUrl, body)
    .then((res) => res.body)
    .catch(errorHandler);
};

// PUT update center
const updateCenter = async (id, body) => {
  return axiosInstance
    .put(`${centerUrl}/${id}`, body)
    .then((res) => res.body)
    .catch(errorHandler);
};

// PATCH update center's user
const updateCenterUser = async (id, body) => {
  return axiosInstance
    .patch(`${userUrl}/${id}`, body)
    .then((res) => res.body)
    .catch(errorHandler);
};

// DELETE center
const remove = async (id) => {
  return axiosInstance
    .delete(`${centerUrl}/${id}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

export const CenterService = {
  getAll,
  getCenterAndUserById,
  create,
  updateCenter,
  updateCenterUser,
  remove,
};
