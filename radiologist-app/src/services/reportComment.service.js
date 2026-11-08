import { errorHandler } from "../utils/error-handler";
import { reportCommentBaseUrl, reportCommentsUrl } from "../utils/urls";
import axiosInstance from "../utils/axios-instance";

const fetchComments = async (reportId) => {
  return axiosInstance
    .get(reportCommentsUrl(reportId))
    .then((res) => res.data)
    .catch(errorHandler);
};

const postComment = async (body) => {
  return axiosInstance
    .post(reportCommentBaseUrl, body)
    .then((res) => res.data)
    .catch(errorHandler);
};

export const ReportCommentService = {
  fetchComments,
  postComment,
};
