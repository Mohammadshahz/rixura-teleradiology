import axiosInstance from "../utils/axios-instance";
import { centerUserUrl, resetPasswordUrl, userUrl } from "../utils/urls";
import { errorHandler } from "../utils/error-handler";

// Get admin profile
const getProfile = (id) => {
  return axiosInstance
    .get(userUrl + `/${id}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

// PUT admin profile
const updateProfile = (id, payload) => {
  return axiosInstance
    .put(userUrl + `/${id}`, payload)
    .then((res) => res.data)
    .catch(errorHandler);
};

// POST reset password
const resetPassword = (payload) => {
  return axiosInstance
    .post(resetPasswordUrl, payload)
    .then((res) => res.data)
    .catch(errorHandler);
};

const getCenterUser = (id) => {
  return axiosInstance
    .get(centerUserUrl + `/${id}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

export const ProfileService = {
  getProfile,
  updateProfile,
  resetPassword,
  getCenterUser,
};
