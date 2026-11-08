import { useState, useEffect } from 'react';
import { ReportService } from '../services/Reports.service';

const useReportBeacon = (reportId, fromIdleReports = false) => {
  const [shouldSendBeacon, setShouldSendBeacon] = useState(true);

  const sendReportBeacon = () => {
    if (!reportId) {
      console.error('No reportId provided for beacon');
      return false;
    }

    if (!fromIdleReports) {
      console.log('Beacon not sent: fromIdleReports is false');
      return true; // Return true to indicate no action needed
    }

    const reportData = {
      status: 'IDLE',
      removeRadiologist: true,
    };

    const data = JSON.stringify(reportData);
    console.log('Sending beacon with data:', reportData);

    const blob = new Blob([data], {
      type: 'application/json; charset=UTF-8',
    });

    const url = `${process.env.REACT_APP_BASE_URL}/reports/${reportId}/update-radiologist-status`;
    console.log('Sending report beacon to URL:', url);

    try {
      if (navigator.sendBeacon) {
        const success = navigator.sendBeacon(url, blob);
        console.log('Beacon sent successfully:', success);
        return success;
      } else {
        console.log('Beacon not supported, falling back to fetch');
        return fetch(url, {
          method: 'POST',
          body: blob,
          headers: {
            'Content-Type': 'application/json',
          },
          keepalive: true,
        })
          .then((response) => {
            console.log('Fetch fallback response:', response.status, response.statusText);
            return response.ok;
          })
          .catch((error) => {
            console.error('Fetch fallback error:', error);
            return false;
          });
      }
    } catch (error) {
      console.error('Error sending beacon:', error);
      return false;
    }
  };

  useEffect(() => {
    if (!reportId || !shouldSendBeacon || !fromIdleReports) return;

    const handleBeforeUnload = (event) => {
      const sent = sendReportBeacon();
      console.log('Report beacon sent on page unload:', sent);
      setShouldSendBeacon(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [reportId, shouldSendBeacon, fromIdleReports]);

  const triggerBeacon = () => {
    if (!shouldSendBeacon) return false;
    const success = sendReportBeacon();
    if (success) setShouldSendBeacon(false);
    return success;
  };

  return {
    triggerBeacon,
  };
};

export default useReportBeacon;