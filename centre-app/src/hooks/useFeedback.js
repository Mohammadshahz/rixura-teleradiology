// src/hooks/useSendFeedback.ts
import { useState } from "react";
import { toast } from "react-toastify";
import { FeedbackService } from "../services/Feeback.Service";
import { useSelector } from "react-redux";

export const useSendFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId =useSelector((state)=>state.auth.user.id)

  const send = (description) => {
    setIsSubmitting(true);
    return FeedbackService.sendFeedback({ description,userId  })
      .then(() => {
        toast.success("Thanks for your feedback!");
      })
      .catch((err) => {
        console.error("Feedback error:", err);
        toast.error(err?.message || "Could not send feedback");
        throw err;
      })
      .finally(() => setIsSubmitting(false));
  };

  return { send, isSubmitting };
};
