// src/components/FeedbackModal.jsx
import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Button from "../Button";
import { useSendFeedback } from "../../../hooks/useFeeback"

const FeedbackModal = ({ show, onClose }) => {
  const [feedbackText, setFeedbackText] = useState("");
  const { send, isSubmitting } = useSendFeedback();

  useEffect(() => {
    if (!show) setFeedbackText("");
  }, [show]);

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) return;

    send(feedbackText)
      .then(() => {
        onClose();           
      })
      .catch(() => {

      });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black text-black dark:text-white rounded-xl shadow-lg w-[90%] md:w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold mb-4">Feedback / Raise issues</h2>
        <textarea
          rows="6"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          className="w-full border rounded-md p-2 text-sm dark:bg-black"
          placeholder="Write your feedback or raise your issues here..."
          disabled={isSubmitting}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <Button color="primary" variant="outlined" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSendFeedback} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
