import DashboardCard from "../../components/layout-ui/Card/DashboardCard";
import RevenueLineChart from "../../components/layout-ui/Charts/RevenueLineChart";
import ReportLineChart from "../../components/layout-ui/Charts/ReportLineChart";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Button from "../../components/layout-ui/Button";
import { useNavigate } from "react-router-dom";
import useDashboard from "../../hooks/useDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    activeFilter,
    handleFilterChange,
    dashboardData,
    revenueData,
    reportsData,
    loadingDashboard,
    loadingReports,
    loadingRevenue,
  } = useDashboard();

  return (
    <main className="flex flex-col gap-4">
      {/* Header Section */}
      <section className="flex flex-col lg:flex-row justify-between lg:items-center p-1 gap-4 ">
        <div className="">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm">Welcome to the dashboard!</p>
        </div>
        <div className="flex gap-2 items-center">
          {/* <label htmlFor="">Filter by</label> */}
          {["DAILY", "MONTHLY", "QUARTERLY", "YEARLY"].map((type) => (
            <Button
              key={type}
              variant={activeFilter === type ? "contained" : "outlined"}
              onClick={() => handleFilterChange(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </section>
      {/* Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-1">
        {/*Cards Detail*/}
        <DashboardCard
          title="Total Revenue"
          total={dashboardData?.card_data.current.total_revenue}
          previous={dashboardData?.card_data.previous.total_revenue}
        />
        <DashboardCard
          title="Total Radiologists"
          total={dashboardData?.card_data.current.total_radiologists}
          previous={dashboardData?.card_data.previous.total_radiologists}
        />
        <DashboardCard
          title="Total Centers"
          total={dashboardData?.card_data.current.total_centers}
          previous={dashboardData?.card_data.previous.total_centers}
        />
        <DashboardCard
          title="Total Expenditure"
          total={dashboardData?.card_data.current.total_expenditures}
          previous={dashboardData?.card_data.previous.total_expenditures}
        />
      </section>
      <section className="xl:flex p-1 gap-4">
        <div className="w-full xl:w-2/3 p-4 border-slate-300 border rounded-lg shadow-md xl:mb-0 mb-4">
          <h1 className="text-xl font-medium">Total Revenue</h1>
          {/*Graph data for Revenue*/}
          <RevenueLineChart revenue={revenueData} loading={loadingRevenue} />
        </div>
        <div className="flex w-full xl:w-1/3 gap-4">
          <div className="flex flex-col justify-evenly gap-4 w-full rounded-lg shadow-md px-4 py-8 border-slate-300 border">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold">
                {dashboardData?.total_reports?.current?.total || 0}
              </h1>
              <h3 className="text-sm">Total Reports</h3>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold">
                {dashboardData?.total_reports?.current?.reported_reports || 0}
              </h1>
              <h3 className="text-sm">Total Reports Reported</h3>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold">
                {dashboardData?.total_reports?.current?.reverted_reports || 0}
              </h1>
              <h3 className="text-sm">Total Report Reverted</h3>
            </div>
          </div>
          <div className="flex flex-col justify-evenly gap-4 w-full rounded-lg shadow-md px-4 py-8 border-slate-300 border">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold">
                {dashboardData?.total_reports?.current?.accepted_reports || 0}
              </h1>
              <h3 className="text-sm">Total Report Accepted</h3>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold">
                {dashboardData?.total_reports?.current?.completed_reports || 0}
              </h1>
              <h3 className="text-sm">Total Report Completed</h3>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold">
                {dashboardData?.total_reports?.current?.idle_reports || 0}
              </h1>
              <h3 className="text-sm">Total Report Idle</h3>
            </div>
          </div>
        </div>
      </section>
      <section className="xl:flex p-1 gap-4">
        <div className="w-full xl:w-2/3 p-4 border-slate-300 border rounded-lg shadow-md mb-4 xl:mb-0">
          <h1 className="text-xl font-medium">Total Reports</h1>
          {/*Graph data for Reports*/}
          <ReportLineChart reports={reportsData} loading={loadingReports} />
        </div>
        <div className="w-full xl:w-1/3 p-4 border-slate-300 border rounded-lg shadow-md">
          <div className="py-2 border-b border-slate-300">
            <h1 className="text-xl font-semibold text-center">Most Reported</h1>
          </div>
          <div className="flex flex-col justify-between gap-2 py-2 min-h-[270px]">
            {/* List of most reported radiologists */}
            <div className="grid grid-cols-1 gap-2">
              {dashboardData?.most_top_reported_radiologists?.map(
                (radiologist, index) => (
                  <div className="flex" key={index}>
                    <UserCircleIcon className=" h-16 rounded-lg text-gray-400" />
                    <div className="flex flex-col justify-center ml-4">
                      <h2 className="text-md font-semibold">
                        {radiologist.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Reported {radiologist.reportCount || 0} times
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
            <Button
              variant="outlined"
              className=""
              onClick={() => navigate("/reports")}
            >
              View All Reports
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};
export default Dashboard;
