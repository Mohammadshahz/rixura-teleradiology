// src/components/layout-ui/Modals/InvoiceModal.jsx
import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Button from "../Buttons";
import DropdownFilter from "../Buttons/DropdownFilter";
import axiosInstance from "../../../utils/axios-instance";
import {
  invoicesUrl,
  invoiceSummaryUrl,
  usersUrl,
} from "../../../utils/urls";
import { generateInvoicePdf } from "../../../utils/generateInvoicePdf";

const getLastMomentOfMonth = (year, month) => {
  const lastDay = new Date(Date.UTC(year, month, 0)); // Correct UTC last day of the month
  lastDay.setUTCHours(23, 59, 59, 999);               // Set time in UTC
  return lastDay.toISOString();                       // Return accurate UTC ISO
};
const getFirstMomentOfMonth = (year, month) => {
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  firstDay.setUTCHours(0, 0, 0, 0);
  return firstDay.toISOString();
};


const InvoiceModal = ({ show, onClose, userId }) => {
  // Month/year dropdown data
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    { label: "January", value: 1 }, { label: "February", value: 2 },
    { label: "March", value: 3 }, { label: "April", value: 4 },
    { label: "May", value: 5 }, { label: "June", value: 6 },
    { label: "July", value: 7 }, { label: "August", value: 8 },
    { label: "September", value: 9 }, { label: "October", value: 10 },
    { label: "November", value: 11 }, { label: "December", value: 12 },
  ];

  // UI state
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("PAID");
  const [loading, setLoading] = useState(false);

  // Reset on close
  useEffect(() => {
    if (!show) {
      setMonth("");
      setYear("");
      setStatus("PAID");
      setLoading(false);
    }
  }, [show]);

  if (!show) return null;

  const handleDownload = async () => {
    if (!(month && year)) return;
    setLoading(true);

const startDate = getFirstMomentOfMonth(year, month);
const endDate   = getLastMomentOfMonth(year, month);


    try {
      // fetch invoices, summary, and user in parallel
      const [invRes, sumRes, userRes] = await Promise.all([
        axiosInstance.get(invoicesUrl, {
          params: { userId, startDate, endDate, status,pagination: false, },
        }),
        axiosInstance.get(invoiceSummaryUrl, {
          params: { userId, startDate, endDate, status },
        }),
        axiosInstance.get(`${usersUrl}/${userId}`),
      ]);


      const items = invRes.data.data || [];
      const summary = sumRes.data;
      const user = userRes.data;

      items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      // split address into lines (by comma)
      const addressLines = user.address
        ? user.address.split(",").map((l) => l.trim())
        : [];

      await generateInvoicePdf({
        items,
        summary,
        startDate,
        endDate,
        status,
        companyName: "Rixura Services LLP",
        logoPlaceholderText: "Rixura Logo",
        billToName: user.name,           // fetched from /users/:id
        addressLines: user.address?.split('\n') || [],
      });
    } catch (e) {
      console.error("PDF generation error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-black text-black dark:text-white rounded-xl shadow-lg w-11/12 md:w-96 p-6">
        <button
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Download Invoice
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Month &amp; Year
            </label>

            <div className="flex gap-2">
              <select
                className="
                w-1/2
                border border-gray-300
                rounded
                px-2 py-1
                bg-white text-gray-900 placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-primary
                dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600
              "
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Month</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                className="
                w-1/2
                border border-gray-300
                rounded
                px-2 py-1
                bg-white text-gray-900 placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-primary
                dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600
              "
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <DropdownFilter
              label="Status"
              options={[
                { label: "Paid", value: "PAID" },
                { label: "Unpaid", value: "PENDING" },
              ]}
              value={status}
              onChange={setStatus}
              noDefault
              buttonProps={{ size: "md" }}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <Button
            variant="outlined"
            onClick={onClose}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={loading || !(month && year)}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white"
          >
            {loading ? "Generating…" : "Download PDF"}
          </Button>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
            <span className="text-white text-lg">Loading…</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceModal;
