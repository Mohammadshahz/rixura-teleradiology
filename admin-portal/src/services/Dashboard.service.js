import axiosInstance from "../utils/axios-instance";
import { errorHandler } from "../utils/error-handler";
import { dashboardUrl, revenueGraphUrl, reportsGraphUrl } from "../utils/urls";

//Get all dashboard data
const getAll = async (filter) => {
  try {
    const [dashboardData, revenueData, reportsData] = await Promise.all([
      axiosInstance.get(`${dashboardUrl}?timePeriod=${filter}`),
      axiosInstance.get(`${revenueGraphUrl}?timePeriod=${filter}`),
      axiosInstance.get(`${reportsGraphUrl}?timePeriod=${filter}`),
    ]);

    return {
      dashboard: dashboardData.data,
      revenue: revenueData.data,
      reports: reportsData.data,
    };
  } catch (error) {
    errorHandler(error);
    return null;
  }
};

// GET dashboard data
const getDashboardData = async (filter) => {
  return axiosInstance
    .get(`${dashboardUrl}?timePeriod=${filter}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

// GET revenue graph data
const getRevenueData = async (filter) => {
  return axiosInstance
    .get(`${revenueGraphUrl}?timePeriod=${filter}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

// GET reports graph data
const getReportsData = async (filter) => {
  return axiosInstance
    .get(`${reportsGraphUrl}?timePeriod=${filter}`)
    .then((res) => res.data)
    .catch(errorHandler);
};

export const DashboardService = {
  getDashboardData,
  getRevenueData,
  getReportsData,
  getAll,
};
