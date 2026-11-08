import axios from "axios";
import { errorHandler } from "../utils/error-handler";
import { reportCommentBaseUrl, reportCommentsUrl } from "../utils/urls";

const fetchComments = async (reportId) => {
  return axios
    .get(reportCommentsUrl(reportId))
    .then((res) => res.data)
    .catch(errorHandler);
};

const postComment = async (body) => {
  return axios
    .post(reportCommentBaseUrl, body)
    .then((res) => res.data)
    .catch(errorHandler);
};

export const ReportCommentService = {
  fetchComments,
  postComment,
};
