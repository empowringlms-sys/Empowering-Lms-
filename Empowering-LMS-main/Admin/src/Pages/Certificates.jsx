import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import badgeImg from '../assets/badge.webp';

export default function Certificates() {
  const certificateRef = useRef(null);
  const containerRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [scale, setScale] = useState(1);

  // Constants for fixed dimensions
  const BASE_WIDTH = 1200;
  const BASE_HEIGHT = 800;

  // Handle scaling on resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.offsetWidth;
        // Calculate scale, maxing out at 1 (don't scale up beyond 100% on huge screens to prevent pixelation)
        // We allow it to be 1 if parent is wider than base
        const newScale = parentWidth < BASE_WIDTH ? parentWidth / BASE_WIDTH : 1;
        setScale(newScale);
      }
    };

    // Initial calculation
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      // Create a temporary hidden container for the PDF generation
      // We essentially recreate the DOM structure with inline styles for maximum fidelity
      const tempDiv = document.createElement('div');
      tempDiv.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 1200px;
        height: 800px;
        background: #ffffff;
        padding: 40px;
        box-sizing: border-box;
        z-index: 9999;
        font-family: 'Times New Roman', serif;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      `;

      // Mirror the exact structure of the visible certificate
      // Note: We duplicate the inner HTML to ensure the PDF looks exactly like the screen
      tempDiv.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          border: 2px solid #1e3a8a;
          padding: 5px;
          box-sizing: border-box;
          position: relative;
        ">
          <div style="
            width: 100%;
            height: 100%;
            border: 4px double #1e3a8a;
            padding: 40px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: #ffffff;
            position: relative;
          ">
            
            <!-- Corner Accents -->
            <div style="position: absolute; top: 10px; left: 10px; width: 40px; height: 40px; border-top: 4px solid #b45309; border-left: 4px solid #b45309;"></div>
            <div style="position: absolute; top: 10px; right: 10px; width: 40px; height: 40px; border-top: 4px solid #b45309; border-right: 4px solid #b45309;"></div>
            <div style="position: absolute; bottom: 10px; left: 10px; width: 40px; height: 40px; border-bottom: 4px solid #b45309; border-left: 4px solid #b45309;"></div>
            <div style="position: absolute; bottom: 10px; right: 10px; width: 40px; height: 40px; border-bottom: 4px solid #b45309; border-right: 4px solid #b45309;"></div>

            <!-- Badge -->
            <div style="position: absolute; top: 20px; left: 20px; z-index: 20;">
              <img src="${badgeImg}" width="120" alt="Certificate Badge" />
            </div>

            <!-- Header -->
            <div style="margin-bottom: 40px;">
              <h1 style="
                color: #1e3a8a;
                font-family: 'Arial', sans-serif;
                font-size: 48px;
                font-weight: bold;
                letter-spacing: 8px;
                margin: 0;
                text-transform: uppercase;
              ">Certificate</h1>
              <p style="
                color: #b45309;
                font-family: 'Arial', sans-serif;
                font-size: 18px;
                letter-spacing: 4px;
                text-transform: uppercase;
                margin-top: 10px;
                margin-bottom: 0;
              ">of Completion</p>
            </div>

            <!-- Body -->
            <p style="
              font-family: 'Times New Roman', serif;
              font-size: 24px;
              font-style: italic;
              color: #4b5563;
              margin: 0 0 20px 0;
            ">This is to certify that</p>

            <h2 style="
              font-family: 'Georgia', serif;
              font-size: 64px;
              color: #111827;
              margin: 10px 0 30px 0;
              font-weight: bold;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 10px;
              min-width: 600px;
            ">Ahmad Shah</h2>

            <p style="
              font-family: 'Times New Roman', serif;
              font-size: 22px;
              color: #4b5563;
              margin: 0 0 10px 0;
            ">has successfully completed the course</p>

            <h3 style="
              font-family: 'Arial', sans-serif;
              font-size: 36px;
              color: #1e3a8a;
              font-weight: bold;
              margin: 10px 0 30px 0;
            ">Learning Management System</h3>

            <!-- Date -->
            <div style="margin-top: 60px;">
              <p style="
                font-family: 'Arial', sans-serif;
                font-size: 16px;
                color: #6b7280;
                margin: 0;
              ">Awarded on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

          </div>
        </div>
      `;

      document.body.appendChild(tempDiv);

      // Generate canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        width: 1200,
        height: 800,
      });

      document.body.removeChild(tempDiv);

      // Convert to PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Certificate-Ahmad-Shah.pdf');

    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Certificate download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 py-8 px-4">
      {/* DOWNLOAD BUTTON */}
      <div className="mb-8">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="px-8 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Certificate</span>
            </>
          )}
        </button>
      </div>

      {/* VISIBLE CERTIFICATE - SCALABLE WRAPPER */}
      <div
        ref={containerRef}
        className="w-full max-w-[1200px] overflow-hidden"
        style={{ height: scale * BASE_HEIGHT }} // Adjust container height dynamically
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${BASE_WIDTH}px`,
            height: `${BASE_HEIGHT}px`,
          }}
          className="relative bg-white shadow-2xl origin-top-left"
        >
          {/* THE CERTIFICATE CONTENT - FIXED PIXELS */}
          <div className="w-full h-full p-10 border-2 border-[#1e3a8a] box-border">
            <div className="w-full h-full border-[6px] border-double border-[#1e3a8a] p-10 flex flex-col items-center justify-center text-center relative bg-white box-border">

              {/* Corner Accents - Fixed size 40px */}
              <div className="absolute top-2.5 left-2.5 w-10 h-10 border-t-4 border-l-4 border-[#b45309]"></div>
              <div className="absolute top-2.5 right-2.5 w-10 h-10 border-t-4 border-r-4 border-[#b45309]"></div>
              <div className="absolute bottom-2.5 left-2.5 w-10 h-10 border-b-4 border-l-4 border-[#b45309]"></div>
              <div className="absolute bottom-2.5 right-2.5 w-10 h-10 border-b-4 border-r-4 border-[#b45309]"></div>

              {/* Badge */}
              <div className="absolute top-6 left-6 z-10">
                <img src={badgeImg} alt="Certificate Badge" className="w-32" />
              </div>

              {/* Header */}
              <div className="mb-10">
                <h1 className="text-[48px] font-bold text-[#1e3a8a] tracking-[0.2em] font-sans uppercase m-0 leading-tight">
                  Certificate
                </h1>
                <p className="text-[#b45309] text-[18px] tracking-[0.2em] uppercase mt-2.5 font-sans m-0">
                  of Completion
                </p>
              </div>

              {/* Content */}
              <p className="font-serif italic text-gray-500 text-[24px] mb-5 m-0">
                This is to certify that
              </p>

              <h2 className="font-serif text-[64px] font-bold text-gray-900 mb-7 border-b border-gray-200 pb-2.5 px-8 min-w-[600px] m-0">
                Ahmad Shah
              </h2>

              <p className="font-serif text-gray-600 text-[22px] mb-2.5 m-0">
                has successfully completed the course of
              </p>

              <h3 className="text-[36px] font-bold text-[#1e3a8a] my-7 font-sans m-0">
                Full Stack Web Development
              </h3>

              {/* <div className="max-w-[800px] mx-auto">
                <p className="text-gray-500 text-[16px] leading-[1.6] font-sans m-0">
                  In recognition of exceptional dedication, outstanding performance,
                  and remarkable commitment to excellence demonstrated throughout the program.
                </p>
              </div> */}

              {/* Date Footer */}
              <div className="mt-[60px] text-center">
                <p className="text-gray-500 text-[16px] font-sans m-0">
                  Awarded on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}