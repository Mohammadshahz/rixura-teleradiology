// src/services/Invoice.service.js
import axiosInstance from "../utils/axios-instance";
import { errorHandler } from "../utils/error-handler";
import { invoicesUrl, invoiceUrl, invoiceSummaryUrl } from "../utils/urls";

const listInvoices = (params) =>
  axiosInstance
    .get(invoicesUrl, { params })
    .then(res => res.data)
    .catch(errorHandler);

const getSummary = (params) =>
  axiosInstance
    .get(invoiceSummaryUrl, { params })
    .then(res => res.data)
    .catch(errorHandler);

const fetchPreviewData = (params) =>
  axiosInstance
    .get(invoicesUrl, { params })
    .then(res => res.data?.data || [])
    .catch(() => []);

export const InvoiceService = {
  listInvoices,
  getSummary,
  fetchPreviewData,
};
