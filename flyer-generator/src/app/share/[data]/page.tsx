'use client';
import React, { useEffect, useState } from 'react';

interface SharePageProps {
  params: Promise<{
    data: string;
  }>;
}

export default function SharePage({ params }: SharePageProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generatePDF = async () => {
      try {
        // Resolve the params promise
        const resolvedParams = await params;
        
        // Decode the data from URL
        const decodedData = JSON.parse(decodeURIComponent(resolvedParams.data));
        
        // Generate PDF
        const response = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(decodedData)
        });

        if (response.ok) {
          const pdfBlob = await response.blob();
          const url = URL.createObjectURL(pdfBlob);
          setPdfUrl(url);
        } else {
          throw new Error('Failed to generate PDF');
        }
      } catch (err) {
        setError('Failed to load PDF');
        console.error('Error generating PDF:', err);
      } finally {
        setLoading(false);
      }
    };

    generatePDF();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00809D] mx-auto mb-4"></div>
          <p className="text-[#2B2926] font-inter">Generating your flyer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f5f3] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-inter mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#00809D] text-white px-4 py-2 rounded-lg font-inter"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f3] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold font-satoshi text-[#2B2926] mb-2">
            Property Flyer
          </h1>
                     <p className="text-[#AFAAA5] font-inter">
             Right-click and select &quot;Print&quot; to print this flyer
           </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-4">
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              width="100%"
              height="800px"
              style={{ border: 'none' }}
              title="Property Flyer PDF"
            />
          )}
        </div>
        
        <div className="text-center mt-6">
          <button
            onClick={() => window.print()}
            className="bg-[#00809D] text-white px-6 py-3 rounded-lg font-inter font-semibold mr-4"
          >
            Print Flyer
          </button>
          <button
            onClick={() => {
              if (pdfUrl) {
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = 'property-flyer.pdf';
                link.click();
              }
            }}
            className="bg-white text-[#00809D] border border-[#00809D] px-6 py-3 rounded-lg font-inter font-semibold"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
} 