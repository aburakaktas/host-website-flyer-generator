import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
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

    // Generate a unique filename
    const filename = `flyer-${randomUUID()}.pdf`;
    const publicDir = join(process.cwd(), 'public', 'generated-pdfs');
    
    // Ensure the directory exists
    if (!existsSync(publicDir)) {
      console.log('Creating generated-pdfs directory');
      mkdirSync(publicDir, { recursive: true });
    }

    const filePath = join(publicDir, filename);

    // Convert assets to base64 data URLs for PDF generation
    console.log('Reading asset files...');
    const logoPath = join(process.cwd(), 'public', 'holidu-logo.png');
    const bgShapePath = join(process.cwd(), 'public', 'bg-shape.png');
    
    if (!existsSync(logoPath)) {
      throw new Error(`Logo file not found at: ${logoPath}`);
    }
    if (!existsSync(bgShapePath)) {
      throw new Error(`Background shape file not found at: ${bgShapePath}`);
    }
    
    const logoBuffer = readFileSync(logoPath);
    const bgShapeBuffer = readFileSync(bgShapePath);
    
    const holiduLogoUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    const bgShapeUrl = `data:image/png;base64,${bgShapeBuffer.toString('base64')}`;

    console.log('Generating PDF with react-pdf...');
    
    // Generate PDF buffer
    const pdfElement = React.createElement(PdfFlyer, {
      image,
      qr,
      holiduLogo: holiduLogoUrl,
      bgShape: bgShapeUrl
    });
    
    const pdfBuffer = await renderToBuffer(pdfElement as any);

    console.log('Writing PDF to file system...');
    // Write the PDF file to the public directory
    writeFileSync(filePath, pdfBuffer);

    // Return the public URL
    const publicUrl = `/generated-pdfs/${filename}`;
    
    console.log(`PDF generated successfully: ${publicUrl}`);
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename 
    });

  } catch (error) {
    console.error('Error in PDF generation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to generate PDF: ${errorMessage}` }, { status: 500 });
  }
} 