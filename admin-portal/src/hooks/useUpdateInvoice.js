import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { InvoiceService } from "../services/Invoice.service";

const useUpdateInvoice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const updateInvoiceStatus = useCallback(async (id, status) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await InvoiceService.updateInvoice(id, { status });
      setData(response.data);
      toast.success("Invoice status updated successfully!");
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update invoice status";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateInvoiceStatus, loading, error, data };
};

export default useUpdateInvoice;