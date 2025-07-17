'use client';
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import holiduLogoPng from '../assets/holidu-logo.png';
import bgShapePng from '../assets/bg-shape.png';

interface FlyerData {
  image: string;
  qr: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [flyer, setFlyer] = useState<FlyerData | null>(null);
  const [shareLoading, setShareLoading] = useState(false);

  const validateUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFlyer(null);
    if (!validateUrl(url)) {
      setError('Please enter a valid URL.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/flyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not generate flyer.');
        setLoading(false);
        return;
      }
      setFlyer(data);
    } catch {
      setError('Could not generate flyer.');
    } finally {
      setLoading(false);
    }
  };

  // PDF download handler
  const handleDownloadPDF = async () => {
    const flyerEl = document.getElementById('flyer-preview');
    if (!flyerEl) return;
    const canvas = await html2canvas(flyerEl, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
    pdf.save('property-flyer.pdf');
  };

  // JPG download handler
  const handleDownloadJPG = async () => {
    const flyerEl = document.getElementById('flyer-preview');
    if (!flyerEl) return;
    const canvas = await html2canvas(flyerEl, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'property-flyer.jpg';
    link.click();
  };

  // Share handler - downloads PDF directly
  const handleShare = async () => {
    if (!flyer) return;
    
    setShareLoading(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: flyer.image,
          qr: flyer.qr
        })
      });

      if (response.ok) {
        // Get the PDF blob
        const pdfBlob = await response.blob();
        
        // Create a temporary URL for the blob
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        // Create a temporary link to download the PDF
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'property-flyer.pdf';
        link.click();
        
        // Clean up the temporary URL
        URL.revokeObjectURL(pdfUrl);
        
        // Show success feedback
        alert('PDF downloaded successfully! You can now share this file with others.');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check your connection and try again.');
    } finally {
      setShareLoading(false);
    }
  };



  // Inline SVGs for PDF compatibility
  function HoliduLogoSVG() {
    return (
      <svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style={{ display: 'block' }} viewBox="0 0 162 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Vector">
          <path d="M32.452 18.8653C31.2165 20.2552 29.2431 20.5566 28.0591 19.5519C26.8751 18.5472 26.9093 16.6047 28.1449 15.2148C29.3804 13.825 31.3538 13.5235 32.5378 14.5283C33.7218 15.533 33.6874 17.4755 32.452 18.8653Z" fill="#00809D"/>
          <path d="M18.2761 24.0495V16.5398C18.2761 16.4504 18.2585 16.3619 18.2243 16.2793C18.1901 16.1967 18.1399 16.1217 18.0767 16.0585C18.0135 15.9953 17.9385 15.9452 17.8559 15.911C17.7734 15.8768 17.6849 15.8592 17.5955 15.8592H14.1498C14.0605 15.8592 13.972 15.8768 13.8894 15.911C13.8068 15.9452 13.7318 15.9953 13.6686 16.0585C13.6054 16.1217 13.5553 16.1967 13.5211 16.2793C13.4868 16.3619 13.4692 16.4504 13.4692 16.5398V24.0478C15.0694 24.1635 16.6758 24.1641 18.2761 24.0495Z" fill="#00809D"/>
          <path d="M35.1581 20.3491C35.2179 20.3932 35.2681 20.4491 35.3054 20.5134L35.8781 21.5054C35.945 21.6201 35.9767 21.752 35.9693 21.8847C35.9619 22.0173 35.9156 22.1448 35.8363 22.2514C34.9189 23.4661 33.868 24.5738 32.7032 25.5538V38.2619C32.7032 38.3513 32.6856 38.4398 32.6514 38.5223C32.6172 38.6049 32.5671 38.6799 32.5039 38.7431C32.4407 38.8063 32.3657 38.8565 32.2831 38.8907C32.2005 38.9249 32.112 38.9425 32.0226 38.9425H28.577C28.3965 38.9425 28.2234 38.8708 28.0958 38.7431C27.9681 38.6155 27.8964 38.4424 27.8964 38.2619V28.5592C24.8756 29.8985 21.5717 30.4736 18.276 30.2338V38.262C18.276 38.3514 18.2584 38.4399 18.2242 38.5224C18.19 38.605 18.1399 38.68 18.0767 38.7433C18.0135 38.8065 17.9385 38.8566 17.8559 38.8908C17.7733 38.925 17.6848 38.9426 17.5954 38.9426H14.1498C13.9693 38.9426 13.7962 38.8709 13.6685 38.7433C13.5409 38.6156 13.4692 38.4425 13.4692 38.262V29.2983C12.2666 28.9068 11.1036 28.4026 9.99579 27.7924C9.91618 27.7486 9.8461 27.6895 9.78965 27.6183C9.7332 27.5471 9.69151 27.4654 9.66702 27.378C9.64253 27.2905 9.63573 27.199 9.64702 27.1089C9.65832 27.0188 9.68748 26.9318 9.73279 26.8531L10.2572 25.9448C10.3258 25.8266 10.4284 25.7318 10.5516 25.6727C10.6748 25.6136 10.813 25.593 10.9481 25.6135C19.1921 26.842 27.5983 24.9611 34.5327 20.3365C34.5943 20.2948 34.6637 20.2663 34.7368 20.2527C34.8099 20.239 34.885 20.2405 34.9575 20.2571C35.0299 20.2737 35.0982 20.305 35.1581 20.3491Z" fill="#00809D"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M26.6133 0.984156L42.6541 10.2452C44.8932 11.5379 46.177 13.6866 46.1765 16.1402L46.1708 40.1068C46.1825 41.4224 45.8005 42.7115 45.0739 43.8084C44.3473 44.9052 43.3094 45.7598 42.0934 46.2622C30.3646 51.2458 15.7984 51.2457 4.08116 46.2631C2.86572 45.7604 1.8283 44.9058 1.10212 43.8091C0.375945 42.7124 -0.0058372 41.4237 0.00580256 40.1085L1.46493e-07 16.1402C-0.000500738 13.6864 1.28348 11.5379 3.52249 10.2452L19.5631 0.984156C21.8362 -0.327882 24.3399 -0.328222 26.6133 0.984156ZM42.6656 42.2146C43.0794 41.5902 43.2942 40.855 43.2815 40.106L43.2871 16.1395C43.2874 14.7054 42.5691 13.5323 41.2094 12.7473L25.1686 3.48635C23.7687 2.67803 22.4072 2.67824 21.0078 3.48635L4.96714 12.7473C3.60746 13.5323 2.88896 14.7054 2.88928 16.1395L2.8951 40.1078C2.88235 40.8566 3.09695 41.5915 3.51055 42.2158C3.92416 42.84 4.51734 43.3241 5.21179 43.6043C16.233 48.2911 29.9322 48.2902 40.9634 43.6031C41.6582 43.3231 42.2517 42.839 42.6656 42.2146Z" fill="#00809D"/>
          <path d="M74.3036 18.2799V34.5085C74.3036 34.6817 74.2348 34.8478 74.1123 34.9703C73.9898 35.0928 73.8237 35.1616 73.6505 35.1616H70.8986C70.7254 35.1616 70.5593 35.0928 70.4368 34.9703C70.3143 34.8478 70.2455 34.6817 70.2455 34.5085V27.9725H61.779V34.5085C61.779 34.6817 61.7102 34.8478 61.5877 34.9703C61.4653 35.0928 61.2991 35.1616 61.1259 35.1616H58.3741C58.2008 35.1616 58.0347 35.0928 57.9122 34.9703C57.7898 34.8478 57.7209 34.6817 57.7209 34.5085V18.2799C57.7209 18.1067 57.7898 17.9406 57.9122 17.8181C58.0347 17.6956 58.2008 17.6268 58.3741 17.6268H61.1259C61.2991 17.6268 61.4653 17.6956 61.5877 17.8181C61.7102 17.9406 61.779 18.1067 61.779 18.2799V24.5405H70.2455V18.2799C70.2455 18.1067 70.3143 17.9406 70.4368 17.8181C70.5593 17.6956 70.7254 17.6268 70.8986 17.6268H73.6505C73.8237 17.6268 73.9898 17.6956 74.1123 17.8181C74.2348 17.9406 74.3036 18.1067 74.3036 18.2799Z" fill="#00809D"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M87.0023 17.3264C81.4663 17.3264 77.4082 21.1839 77.4082 26.3941C77.4082 31.6044 81.4663 35.4624 87.0023 35.4624C92.5129 35.4624 96.5965 31.6298 96.5965 26.3941C96.5965 21.159 92.5129 17.3264 87.0023 17.3264ZM87.0023 20.7833C90.1334 20.7833 92.488 23.0625 92.488 26.3941C92.488 29.7258 90.1334 32.0055 87.0023 32.0055C83.8708 32.0055 81.5162 29.7257 81.5162 26.3941C81.5162 23.0625 83.8708 20.7833 87.0023 20.7833Z" fill="#00809D"/>
          <path d="M100.356 17.6268H103.108C103.281 17.6268 103.448 17.6956 103.57 17.8181C103.693 17.9406 103.761 18.1067 103.761 18.2799V31.8549H112.735C112.909 31.8549 113.075 31.9237 113.197 32.0462C113.32 32.1686 113.389 32.3348 113.389 32.508V34.5084C113.389 34.6816 113.32 34.8477 113.197 34.9702C113.075 35.0927 112.909 35.1615 112.735 35.1615H100.356C100.183 35.1615 100.017 35.0927 99.8947 34.9702C99.7722 34.8477 99.7034 34.6816 99.7034 34.5084V18.2799C99.7034 18.1067 99.7722 17.9406 99.8947 17.8181C100.017 17.6956 100.183 17.6268 100.356 17.6268Z" fill="#00809D"/>
          <path d="M119.691 17.6268H116.939C116.766 17.6268 116.6 17.6956 116.477 17.8181C116.355 17.9406 116.286 18.1067 116.286 18.2799V34.5085C116.286 34.6817 116.355 34.8478 116.477 34.9703C116.6 35.0928 116.766 35.1616 116.939 35.1616H119.691C119.864 35.1616 120.03 35.0928 120.153 34.9703C120.275 34.8478 120.344 34.6817 120.344 34.5085V18.2799C120.344 18.1067 120.275 17.9406 120.153 17.8181C120.03 17.6956 119.864 17.6268 119.691 17.6268Z" fill="#00809D"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M124.404 18.2799C124.404 18.1067 124.473 17.9406 124.595 17.8181C124.718 17.6956 124.884 17.6268 125.057 17.6268H132.463C138.2 17.6268 141.936 21.0837 141.936 26.3942C141.936 31.7047 138.2 35.1615 132.463 35.1615H125.057C124.884 35.1615 124.718 35.0927 124.595 34.9702C124.473 34.8477 124.404 34.6816 124.404 34.5084V18.2799ZM132.295 31.8299C135.777 31.8299 137.859 29.7507 137.859 26.3941C137.859 23.0376 135.777 20.9584 132.295 20.9584H128.462V31.8299H132.295Z" fill="#00809D"/>
          <path d="M145.04 18.2799V27.4465C145.04 32.6068 148.347 35.4624 153.332 35.4624C158.316 35.4624 161.623 32.6068 161.623 27.4465V18.2799C161.623 18.1942 161.606 18.1092 161.573 18.03C161.54 17.9508 161.492 17.8788 161.432 17.8181C161.371 17.7575 161.299 17.7094 161.22 17.6765C161.141 17.6437 161.056 17.6268 160.97 17.6268H158.268C158.095 17.6268 157.929 17.6956 157.807 17.8181C157.684 17.9406 157.615 18.1067 157.615 18.2799V27.2958C157.615 30.6274 155.837 32.0055 153.357 32.0055C150.902 32.0055 149.098 30.6274 149.098 27.2958V18.2799C149.098 18.1067 149.03 17.9406 148.907 17.8181C148.785 17.6956 148.618 17.6268 148.445 17.6268H145.693C145.52 17.6268 145.354 17.6956 145.232 17.8181C145.109 17.9406 145.04 18.1067 145.04 18.2799Z" fill="#00809D"/>
        </g>
      </svg>
    );
  }

  function CheckmarkSVG() {
    return (
      <svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style={{ display: 'block' }} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.6 11.8L6.45 9.65C6.26667 9.46667 6.03333 9.375 5.75 9.375C5.46667 9.375 5.23333 9.46667 5.05 9.65C4.86667 9.83333 4.775 10.0667 4.775 10.35C4.775 10.6333 4.86667 10.8667 5.05 11.05L7.9 13.9C8.1 14.1 8.33333 14.2 8.6 14.2C8.86667 14.2 9.1 14.1 9.3 13.9L14.95 8.25C15.1333 8.06667 15.225 7.83333 15.225 7.55C15.225 7.26667 15.1333 7.03333 14.95 6.85C14.7667 6.66667 14.5333 6.575 14.25 6.575C13.9667 6.575 13.7333 6.66667 13.55 6.85L8.6 11.8ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="#038400"/>
      </svg>
    );
  }



  function DownloadSVG() {
    return (
      <svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style={{ display: 'block' }} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M9 0C9.55229 0 10 0.447715 10 1V10.216L14.8217 5.7652C15.2275 5.39059 15.8602 5.4159 16.2348 5.82172C16.6094 6.22754 16.5841 6.8602 16.1783 7.2348L9.67828 13.2348C9.29522 13.5884 8.70478 13.5884 8.32172 13.2348L1.82172 7.2348C1.4159 6.8602 1.39059 6.22754 1.7652 5.82172C2.1398 5.4159 2.77246 5.39059 3.17828 5.7652L8 10.216V1C8 0.447715 8.44772 0 9 0ZM1 12C1.55228 12 2 12.4477 2 13V17H16V13C16 12.4477 16.4477 12 17 12C17.5523 12 18 12.4477 18 13V18C18 18.5523 17.5523 19 17 19H1C0.447715 19 0 18.5523 0 18V13C0 12.4477 0.447715 12 1 12Z" fill="#2B2926"/>
      </svg>
    );
  }

  function ShareSVG() {
    return (
      <svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style={{ display: 'block' }} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 14C14.2 14 13.5 14.3 13 14.8L7.9 11.8C7.95 11.5 8 11.3 8 11C8 10.7 7.95 10.5 7.9 10.2L13 7.2C13.5 7.7 14.2 8 15 8C16.7 8 18 6.7 18 5C18 3.3 16.7 2 15 2C13.3 2 12 3.3 12 5C12 5.3 12.05 5.5 12.1 5.8L7 8.8C6.5 8.3 5.8 8 5 8C3.3 8 2 9.3 2 11C2 12.7 3.3 14 5 14C5.8 14 6.5 13.7 7 13.2L12.1 16.2C12.05 16.5 12 16.7 12 17C12 18.7 13.3 20 15 20C16.7 20 18 18.7 18 17C18 15.3 16.7 14 15 14Z" fill="#2B2926"/>
      </svg>
    );
  }



  // Remove pxToMm helper and revert Flyer to px units
  function Flyer({ image, qr }: { image: string; qr: string }) {
    return (
      <div id="flyer-preview" className="relative bg-white overflow-hidden" style={{ width: 794, height: 1123, borderRadius: 30 }}>
        <div id="flyer-print-wrapper" style={{ width: 794, height: 1123, position: 'relative' }}>
          {/* Property image (top) */}
          <div
            className="absolute bg-center bg-cover bg-no-repeat rounded property-image-screen"
            style={{ left: 66, top: 66, width: 662, height: 443, backgroundImage: `url('${image}')` }}
          />
          {/* Property image (print only fallback) */}
          <img
            src={image}
            alt="Property Main"
            className="property-image-print"
            style={{ display: 'none', left: 66, top: 66, width: 662, height: 443, position: 'absolute', objectFit: 'cover', borderRadius: 15 }}
          />
          {/* Left section (bottom) */}
          <div
            className="absolute flex flex-col gap-[60px] items-start justify-start"
            style={{ left: 66, top: 570, width: 346 }}
          >
            {/* Headline and subtext */}
            <div className="flex flex-col gap-[28px] items-start w-full">
              <div className="flex flex-col gap-[14px] w-full">
                <div className="text-[49px] font-bold font-satoshi text-[#00809D] leading-[51px] w-full">Love this place?</div>
                <div className="text-[49px] font-bold font-satoshi text-[#45423E] leading-[51px] w-full">Secure the best price</div>
              </div>
              <div className="text-[12px] font-inter text-black w-full leading-[16px]">
                Booking sites charge commission, we don&apos;t. Scan the QR Code to book next year&apos;s stay on our official website and <span className="font-bold">save up to 15%.</span>
              </div>
            </div>
            {/* Holidu logo (PNG) */}
            <div className="relative" style={{ width: 161.62, height: 50 }}>
              <img src={holiduLogoPng.src} alt="Holidu Logo" className="block max-w-none w-full h-full" />
            </div>
          </div>
          {/* Right section (bottom) */}
          <div className="absolute" style={{ left: 537, top: 573 }}>
            {/* Background shape behind QR (PNG) */}
            <div className="absolute" style={{ left: 0, top: 0, width: 188, height: 426 }}>
              <img src={bgShapePng.src} alt="Background Shape" className="block max-w-none w-full h-full" />
            </div>
            {/* QR code container */}
            <div className="absolute bg-white flex flex-row items-center justify-start rounded-[4px] p-[12px]" style={{ left: 34, top: 156, width: 119 }}>
              <div className="aspect-square min-w-[98px] min-h-[98px] flex items-center justify-center">
                <img src={qr} alt="QR Code" className="w-[98px] h-[98px]" />
              </div>
            </div>
            {/* Caption below QR */}
            <div className="absolute font-black font-satoshi text-white text-[18px] text-center scan-rate-text" style={{ left: 92, top: 314, width: 137, transform: 'translateX(-50%)' }}>
              Scan for the best rate
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f5f3] min-h-screen w-full flex items-center justify-center py-[60px]">
      <div className="flex flex-col gap-8 items-center justify-start w-[500px]">
        <div className="flex flex-col gap-6 items-center w-[500px]">
          <div className="flex flex-col gap-6 items-center w-[282px]">
            <div className="h-[50px] w-[161.62px]">
              <HoliduLogoSVG />
            </div>
            <div className="font-satoshi font-bold text-[24px] leading-[32px] text-black text-center w-full">
              Host website flyer maker
            </div>
          </div>
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl w-full flex flex-col items-center justify-center p-6 gap-6">
            <div className="flex flex-col items-start w-full gap-2">
              <div className="font-inter text-[16px] text-[#2B2926] leading-[24px] tracking-[-0.176px] pb-2">Host website link</div>
              <div className="relative w-full">
                <input
                  id="property-url"
                  type="text"
                  placeholder="Enter link here"
                  className="w-full bg-white rounded-md px-3 py-3 text-[16px] text-[#2B2926] placeholder-[#AFAAA5] border border-[#AFAAA5] focus:outline-[#00809D] font-inter tracking-[-0.176px] leading-[24px]"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  disabled={loading}
                  autoComplete="off"
                  style={{ minHeight: 48 }}
                />
                <div className="pointer-events-none absolute inset-0 border border-[#AFAAA5] rounded-md" />
              </div>
              {error && <span className="text-red-600 text-xs mt-1">{error}</span>}
            </div>
            <div className="bg-[#00809D] rounded-lg w-full flex flex-row items-center justify-center px-6 py-3">
              <button
                type="submit"
                disabled={loading}
                className={`font-inter font-semibold text-white text-[16px] leading-[24px] tracking-[-0.176px] ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Generating...' : 'Generate flyer'}
              </button>
            </div>
          </form>
          {flyer && (
            <div className="mt-8 flex flex-col items-center">
              {/* Success message and buttons */}
              <div className="flex flex-col items-center gap-4 mb-8">
                {/* Success message */}
                <div className="bg-[rgba(3,132,0,0.05)] flex flex-row gap-[9px] items-center px-3 py-2 rounded-lg">
                  <span className="inline-flex items-center justify-center w-6 h-6">
                    <CheckmarkSVG />
                  </span>
                  <span className="font-inter text-[#038400] text-[16px] leading-6 tracking-[-0.176px]">Flyer successfully generated</span>
                </div>
                {/* Buttons */}
                <div className="flex flex-row gap-8 items-center">
                  {/* Download PDF button */}
                  <button onClick={handleDownloadPDF} className="flex flex-row gap-2 items-center group">
                    <span className="inline-flex items-center justify-center w-6 h-6">
                      <DownloadSVG />
                    </span>
                    <span className="font-inter text-black text-[16px] underline group-hover:text-[#00809D]">Save as PDF</span>
                  </button>
                  {/* Download JPG button */}
                  <button onClick={handleDownloadJPG} className="flex flex-row gap-2 items-center group">
                    <span className="inline-flex items-center justify-center w-6 h-6">
                      <DownloadSVG />
                    </span>
                    <span className="font-inter text-black text-[16px] underline group-hover:text-[#00809D]">Download JPG</span>
                  </button>
                  {/* Share button */}
                  <button 
                    onClick={handleShare} 
                    disabled={shareLoading}
                    className="flex flex-row gap-2 items-center group"
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6">
                      <ShareSVG />
                    </span>
                    <span className={`font-inter text-black text-[16px] underline group-hover:text-[#00809D] ${shareLoading ? 'opacity-60' : ''}`}>
                      {shareLoading ? 'Generating...' : 'Share PDF'}
                    </span>
                  </button>
                </div>
              </div>
              <Flyer image={flyer.image} qr={flyer.qr} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
