import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ReportCommentService } from "../services/reportComment.service";

const useChat = () => {
  const { id } = useParams();
  const reportId = id || useParams().reportId;

  if (!reportId)
    throw new Error("Report ID is required for chat functionality.");

  const radiologistId = useSelector((state) => state.auth.user.id);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const validationSchema = Yup.object({
    content: Yup.string()
      .required("Message cannot be empty")
      .min(1, "Type something..."),
  });

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await ReportCommentService.fetchComments(reportId);
      setMessages(data.reverse()); // Reverse to show latest messages at the bottom
    } catch (err) {
      toast.error("Failed to load chat messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const payload = {
      reportId,
      content: newMessage.trim(),
      radiologistId,
    };

    if (!radiologistId) {
      toast.error("Missing Radiologist ID.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await ReportCommentService.postComment(payload);
      setMessages((prev) => [
        ...prev,
        { ...response, radiologist: { name: "You" } },
      ]);
      setNewMessage("");
    } catch (err) {
      toast.error("Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [reportId]);

  return {
    messages,
    newMessage,
    setNewMessage,
    handleSend,
    validationSchema,
    loading,
    submitting,
  };
};

export default useChat;
