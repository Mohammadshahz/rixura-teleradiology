const DashboardCard = ({ title, total, previous }) => {
  const percentage = previous ? ((total - previous) / previous) * 100 : 0; // Calculate percentage change if previous value is provided
  const percentageColor = percentage > 0 ? "text-green-500" : "text-red-500";
  const percentageSign = percentage > 0 ? "↝" : "↜";
  const displayPercentage = Math.floor(Math.abs(percentage));
  return (
    <div className="flex flex-col gap-2 w-full rounded-lg shadow-md p-4 border-slate-300 border">
      <h2 className="text-md font-medium">{title}</h2>
      <h1 className="text-3xl font-bold">{total}</h1>
      <p className="text-sm">
        <span className={percentageColor}>
          {percentageSign}
          {displayPercentage}%{" "}
        </span>{" "}
        from last 7 days
      </p>
    </div>
  );
};

export default DashboardCard;
