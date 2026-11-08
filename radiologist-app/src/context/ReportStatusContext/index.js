import { createContext, useContext, useState } from "react";

const ReportStatusContext = createContext();

export const useReportStatusContext = () => useContext(ReportStatusContext);

export const ReportStatusProvider = ({ children }) => {
  const [reportGenerated, setReportGenerated] = useState(false);

  return (
    <ReportStatusContext.Provider value={{ reportGenerated, setReportGenerated }}>
      {children}
    </ReportStatusContext.Provider>
  );
};
