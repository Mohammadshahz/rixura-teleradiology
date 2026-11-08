import { useEffect, useState } from "react";
import { FeedbackService } from "../services/Feedback.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useFeedback = ({ id }) => {
  const [feedbackDetail, setFeedbackDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await FeedbackService.getById(id);
      setFeedbackDetail(response);
    } catch (err) {
      setError(err);
      toast.error("Fail to fetch Feedback data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchById(id);
    }
  }, [id]);
  return { feedbackDetail, fetchById, loading, error };
};

export default useFeedback;
