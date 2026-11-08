import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Button from "../Button";

const FeedbackModal = ({ show, onClose, onSubmit }) => {
  const [feedbackText, setFeedbackText] = useState("");

  // Optional: Clear feedback text when modal opens/closes
  useEffect(() => {
    if (!show) {
      setFeedbackText("");
    }
  }, [show]);

  const handleSendFeedback = () => {
    if (onSubmit) {
      onSubmit(feedbackText);
    }
    setFeedbackText("");
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black text-black dark:text-white rounded-xl shadow-lg w-[90%] md:w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray hover:text-gray-light2 dark:text-gray dark:hover:text-white"
          onClick={onClose}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold mb-4">Submit Feedback</h2>
        <textarea
          rows="6"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          className="w-full border border-gray dark:border-gray bg-white dark:bg-gray-dark text-black dark:text-white rounded-md p-2 text-sm"
          placeholder="Write your feedback here..."
        />
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSendFeedback}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
