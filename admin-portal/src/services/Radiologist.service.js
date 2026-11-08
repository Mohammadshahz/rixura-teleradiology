import { errorHandler } from "../utils/error-handler";
import { userUrl } from "../utils/urls";
import axiosInstance from "../utils/axios-instance";

//Get all radiologists
const getAll = async (params) => {
  return (
    axiosInstance
      // .get(userUrl, { params: { role: "RADIOLOGIST", status: "ACTIVE" } })
      .get(userUrl, { params })
      .then((res) => res.data)
      .catch(errorHandler)
  );
};

// GET single radiologist by ID
const getById = async (id) => {
  return axiosInstance
    .get(`${userUrl}/${id}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

// POST radiologist
const create = async (body) => {
  return axiosInstance
    .post(userUrl, body)
    .then((res) => res.data)
    .catch(errorHandler);
};

// PATCH (update) radiologist
const update = async (id, body) => {
  return axiosInstance
    .patch(`${userUrl}/${id}`, body)
    .then((res) => res.data)
    .catch(errorHandler);
};

// DELETE radiologist
const remove = async (id) => {
  return axiosInstance
    .delete(`${userUrl}/${id}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

export const RadiologistService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
