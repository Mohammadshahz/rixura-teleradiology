import { useState } from "react";
import { ContactService } from "../services/Contact.Service";
import { toast } from "react-toastify";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  userType: string;
  message: string;
  requestType?: "QUERY" | "DEMO";
}

export const useSubmitForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitContact = async (values: FormValues): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        fullname: values.name,
        email: values.email,
        phone_number: values.phone,
        contactType: values.userType.toUpperCase() as "CENTER" | "RADIOLOGIST",
        requestType: values.requestType || "QUERY",
        message: values.message,
      };

      await ContactService.submitContactForm(payload);
      toast.success("Message sent successfully!");
      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitContact,
    loading,
    error,
  };
};
