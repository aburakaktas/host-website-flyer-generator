import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { readFileSync } from 'fs';
import { join } from 'path';
import React from 'react';

export async function POST(request: NextRequest) {
  try {
    console.log('PDF generation request received');
    
    const { image, qr } = await request.json();

    if (!image || !qr) {
      console.error('Missing image or QR code data');
      return NextResponse.json({ error: 'Missing image or QR code data' }, { status: 400 });
    }

    console.log('Image and QR data received');
    
    // Test if we can import the required modules
    let renderToBuffer;
    try {
      const pdfModule = await import('@react-pdf/renderer');
      renderToBuffer = pdfModule.renderToBuffer;
      console.log('Successfully imported @react-pdf/renderer');
    } catch (importError) {
      console.error('Failed to import @react-pdf/renderer:', importError);
      return NextResponse.json({ error: 'PDF renderer not available' }, { status: 500 });
    }

    let PdfFlyer;
    try {
      const componentModule = await import('../../PdfFlyer');
      PdfFlyer = componentModule.PdfFlyer;
      console.log('Successfully imported PdfFlyer');
    } catch (importError) {
      console.error('Failed to import PdfFlyer:', importError);
      return NextResponse.json({ error: 'PDF component not available' }, { status: 500 });
    }

    // Convert assets to base64 data URLs for PDF generation
    console.log('Reading asset files...');
    const logoPath = join(process.cwd(), 'public', 'holidu-logo.png');
    const bgShapePath = join(process.cwd(), 'public', 'bg-shape.png');
    
    let holiduLogoUrl, bgShapeUrl;
    try {
      const logoBuffer = readFileSync(logoPath);
      const bgShapeBuffer = readFileSync(bgShapePath);
      
      holiduLogoUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      bgShapeUrl = `data:image/png;base64,${bgShapeBuffer.toString('base64')}`;
    } catch (fileError) {
      console.error('Failed to read asset files:', fileError);
      return NextResponse.json({ error: 'Asset files not found' }, { status: 500 });
    }

    console.log('Generating PDF with react-pdf...');
    
    // Generate PDF buffer
    const pdfElement = React.createElement(PdfFlyer, {
      image,
      qr,
      holiduLogo: holiduLogoUrl,
      bgShape: bgShapeUrl
    });
    
    const pdfBuffer = await renderToBuffer(pdfElement as any);

    console.log('PDF generated successfully');
    
    // Return PDF directly as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="property-flyer.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error in PDF generation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to generate PDF: ${errorMessage}` }, { status: 500 });
  }
} 