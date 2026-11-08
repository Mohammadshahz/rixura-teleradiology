import { useEffect, useState } from "react";
import { ContactService } from "../services/Contact.service";
import { toast } from "react-toastify";

const useContact = ({ id }) => {
  const [contactDetail, setContactDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ContactService.getById(id);
      setContactDetail(response);

      if (!response.isRead) {
        await ContactService.updateReadById(id);
      }
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
  return { contactDetail, fetchById, loading, error };
};

export default useContact;
