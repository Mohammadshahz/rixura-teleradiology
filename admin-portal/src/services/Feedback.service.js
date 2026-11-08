import { feedbackUrl } from "../utils/urls";
import { errorHandler } from "../utils/error-handler";
import axiosInstance from "../utils/axios-instance";

//GET feedbacks
const getAll = () => {
  return axiosInstance
    .get(feedbackUrl)
    .then((res) => res.data)
    .catch(errorHandler);
};

//GET feedback by id
const getById = (id) => {
  return axiosInstance
    .get(`${feedbackUrl}/${id}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

//DELETE feedback by id
const remove = (id) => {
  return axiosInstance
    .delete(`${feedbackUrl}/${id}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

export const FeedbackService = {
  getAll,
  getById,
  remove,
};
