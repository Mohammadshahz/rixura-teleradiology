// src/services/Feedback.service.js
import { errorHandler } from "../utils/error-handler";
import { feedbacksUrl } from "../utils/urls";
import axiosInstance from "../utils/axios-instance";


const sendFeedback = (payload) =>
  axiosInstance
    .post(feedbacksUrl, { ...payload})
    .then(res => res.data)
    .catch(errorHandler);

const getAllFeedback = () =>
  axiosInstance
    .get(feedbacksUrl)
    .then(res => res.data)
    .catch(errorHandler);

export const FeedbackService = {
  sendFeedback,
  getAllFeedback,
};
