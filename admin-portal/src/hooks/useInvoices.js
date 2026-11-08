import { useState, useEffect } from "react";
import { InvoiceService } from "../services/Invoice.service";

// Helpers to convert a YYYY‑MM‑DD string to ISO start/end timestamps
const toStartOfDay = (d) => {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt.toISOString();
};
const toEndOfDay = (d) => {
  const dt = new Date(d);
  dt.setHours(23, 59, 59, 999);
  return dt.toISOString();
};

/**
 * Fetches invoice-summary anytime `params` changes.
 * @param {{ userId:string, transactionId?:string, status?:string, startDate?:string, endDate?:string }} params
 */
export function useInvoices(params) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = params.selectedUserId || params.userId;
    // if (!id) return;

    const q = {
      userId: id,
      ...(params.transactionId && { transactionId: params.transactionId }),
      ...(params.status && { status: params.status }),
      ...(params.startDate && { startDate: toStartOfDay(params.startDate) }),
      ...(params.endDate && { endDate: toEndOfDay(params.endDate) }),
    };

    setLoading(true);
    InvoiceService.getSummary(q)
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, [params]);

  return { summary, loading };
}
