import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import Button from '../layout-ui/Button';
import ReportTemplate from './ReportTemplate';

const NewPDFViewer = ({ patient, centre, report, templateData, footerItems }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const pdfContainerRef = useRef(null);
  
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
  
  // Generate PDF when component mounts
  useEffect(() => {
    generatePDF();
  }, [patient, centre, report, templateData, footerItems]);
  
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
          logging: false,
          letterRendering: true
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
      
      // Store the PDF blob
      setPdfBlob(pdf);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadPDF = () => {
    if (!pdfBlob) {
      generatePDF().then(() => {
        if (pdfBlob) {
          const url = URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Report_${patient.name || 'Patient'}_${new Date().toISOString().split('T')[0]}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    } else {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Report_${patient.name || 'Patient'}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const openPDFInBrowser = () => {
    if (!pdfBlob) {
      generatePDF().then(() => {
        if (pdfBlob) {
          const url = URL.createObjectURL(pdfBlob);
          window.open(url, '_blank');
        }
      });
    } else {
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
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
      <div className="flex flex-row space-x-2 justify-end">
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
          color="secondary"
          size="md"
          rounded="md"
          disabled={isGenerating}
          onClick={openPDFInBrowser}
        >
          {isGenerating ? 'Preparing...' : 'Open in Browser'}
        </Button>
      </div>
      
      <div className="w-full max-w-4xl mx-auto border border-gray-300 rounded p-4 bg-white">
        {isGenerating ? (
          <div className="flex items-center justify-center h-96 bg-gray-100">
            <p className="text-gray-700">Preparing PDF preview...</p>
          </div>
        ) : (
          <div className="pdf-preview-container">
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
        )}
      </div>
    </div>
  );
};

export default NewPDFViewer;
