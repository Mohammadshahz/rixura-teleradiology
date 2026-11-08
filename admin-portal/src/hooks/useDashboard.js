import { useState, useEffect } from "react";
import { DashboardService } from "../services/Dashboard.service";

const useDashboard = () => {
  const [activeFilter, setActiveFilter] = useState("DAILY");

  const [dashboardData, setDashboardData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [reportsData, setReportsData] = useState(null);

  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);

  const [error, setError] = useState(null);

  const fetchDashboard = async (filter) => {
    setLoadingDashboard(true);
    try {
      const data = await DashboardService.getDashboardData(filter);
      setDashboardData(data);
    } catch (err) {
      setError("Failed to fetch dashboard data");
    } finally {
      setLoadingDashboard(false);
    }
  };

  const fetchRevenue = async (filter) => {
    setLoadingRevenue(true);
    try {
      const data = await DashboardService.getRevenueData(filter);
      setRevenueData(data);
    } catch (err) {
      setError("Failed to fetch revenue data");
    } finally {
      setLoadingRevenue(false);
    }
  };

  const fetchReports = async (filter) => {
    setLoadingReports(true);
    try {
      const data = await DashboardService.getReportsData(filter);
      setReportsData(data);
    } catch (err) {
      setError("Failed to fetch reports data");
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchDashboard(activeFilter);
    fetchRevenue(activeFilter);
    fetchReports(activeFilter);
  }, [activeFilter]);

  const handleFilterChange = (filter) => {
    if (filter !== activeFilter) {
      setActiveFilter(filter);
    }
  };

  return {
    activeFilter,
    handleFilterChange,
    error,
    dashboardData,
    revenueData,
    reportsData,
    loadingDashboard,
    loadingRevenue,
    loadingReports,
  };
};

export default useDashboard;
