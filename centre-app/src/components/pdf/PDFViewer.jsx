import React, { useState, useEffect, useRef, useMemo } from 'react';
import html2pdf from 'html2pdf.js';
import ReportTemplate from './ReportTemplate';
import Button from '../layout-ui/Buttons';

const PDFViewerComponent = ({ patient, centre, radiologist, report, templateData, footerItems }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const pdfContainerRef = useRef(null);
  const hasGeneratedRef = useRef(false);
  
  console.log('PDFViewer templateData:', templateData);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for window resize
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Generate PDF once when component mounts (for desktop only)
  useEffect(() => {
    if (!isMobile && !hasGeneratedRef.current) {
      hasGeneratedRef.current = true;
      // Small delay to ensure images are fully rendered in DOM
      const timer = setTimeout(() => {
        setIsInitializing(false);
        generatePDF();
      }, 300);
      return () => clearTimeout(timer);
    } else if (isMobile) {
      // For mobile, just hide the initializing state
      setIsInitializing(false);
    }
  }, [isMobile]);
  
  useEffect(() => {
    // Cleanup URL object on component unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const generatePDF = async () => {
    if (!pdfContainerRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const element = pdfContainerRef.current;
      
      // Configure html2pdf options
      const options = {
        margin: 10,
        filename: `Report_${patient.name || 'Patient'}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: true,  // Enable logging to debug image loading issues
          letterRendering: true,
          imageTimeout: 5000, // Increase timeout for image loading
          ignoreElements: (element) => {
            // Ignore elements that failed to load
            if (element.tagName === 'IMG' && (!element.complete || element.naturalWidth === 0)) {
              console.warn('Ignoring incomplete image in PDF generation:', element.src);
              return true;
            }
            return false;
          }
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      // Generate PDF
      const pdf = await html2pdf()
        .set(options)
        .from(element)
        .outputPdf('blob');
      
      // Store the PDF blob and create URL
      setPdfBlob(pdf);
      const url = URL.createObjectURL(pdf);
      setPdfUrl(url);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadPDF = () => {
    if (!pdfBlob) {
      generatePDF().then(() => {
        if (pdfBlob && pdfUrl) {
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = `Report_${patient.name || 'Patient'}_${new Date().toISOString().split('T')[0]}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    } else {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `Report_${patient.name || 'Patient'}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const openPDFInBrowser = () => {
    if (!pdfUrl) {
      generatePDF().then(() => {
        if (pdfUrl) {
          window.open(pdfUrl, '_blank');
        }
      });
    } else {
      window.open(pdfUrl, '_blank');
    }
  };

  // For mobile devices
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
          <p className="text-yellow-700 font-medium">PDF preview is not available on mobile devices</p>
          <p className="text-yellow-600 text-sm">Please use one of the options below to view your PDF:</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            type="button"
            fullWidth
            size="md"
            rounded="md"
            disabled={isGenerating}
            onClick={downloadPDF}
          >
            {isGenerating ? 'Preparing Download...' : 'Download PDF'}
          </Button>
          
          <Button
            type="button"
            variant="outlined"
            fullWidth
            size="md"
            rounded="md"
            disabled={isGenerating}
            onClick={openPDFInBrowser}
          >
            {isGenerating ? 'Preparing Preview...' : 'Open in Browser'}
          </Button>
        </div>
        
        {/* Hidden container for PDF generation */}
        <div style={{ display: 'none' }}>
          <div ref={pdfContainerRef}>
            <ReportTemplate
              patient={patient}
              centre={centre}
              report={report}
              templateData={templateData}
              footerItems={footerItems}
            />
          </div>
        </div>
      </div>
    );
  }
  
  // For desktop
  return (
    <div className="flex flex-col space-y-4 pb-8">
<div className="flex flex-row space-x-2 justify-end mt-8 mr-4">
        <Button
          type="button"
          variant="contained"
          color="primary"
          size="md"
          rounded="md"
          disabled={isGenerating}
          onClick={downloadPDF}
        >
          {isGenerating ? 'Preparing Download...' : 'Download PDF'}
        </Button>

        <Button
          type="button"
          variant="outlined"
          size="md"
          rounded="md"
          disabled={isGenerating}
          onClick={openPDFInBrowser}
        >
          {isGenerating ? 'Preparing...' : 'Open in Browser'}
        </Button>
      </div>
      
      <div className="w-full max-w-4xl mx-auto border border-gray-300 rounded" style={{ height: 'calc(100vh - 150px)', maxHeight: 'calc(100vh - 150px)' }}>
        {isInitializing ? (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-700 font-medium">Loading report...</p>
            <p className="text-gray-500 text-sm mt-2">Preparing your document</p>
          </div>
        ) : isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-700 font-medium">Generating PDF preview...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your report</p>
          </div>
        ) : pdfUrl ? (
          <iframe 
            src={pdfUrl} 
            title="PDF Preview" 
            className="w-full h-full"
            style={{ border: 'none' }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <p className="text-gray-700 font-medium">Preparing preview...</p>
            </div>
          </div>
        )}
        
        {/* Hidden container for PDF generation */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div ref={pdfContainerRef}>
            <ReportTemplate
              patient={patient}
              centre={centre}
              report={report}
              templateData={templateData}
              footerItems={footerItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewerComponent;
