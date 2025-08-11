import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet
} from '@react-pdf/renderer';

// Using fallback fonts for compatibility

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    width: '210mm',
    height: '297mm',
    padding: 0,
    position: 'relative',
  },
  flyerImage: {
    position: 'absolute',
    left: 50,
    top: 50,
    width: 495,
    height: 331,
    objectFit: 'cover',
    borderRadius: 12,
  },
  leftSection: {
    position: 'absolute',
    left: 50,
    top: 431,
    width: 259,
    flexDirection: 'column',
    gap: 47,
  },
  headline: {
    fontSize: 48,
    fontWeight: 700,
    fontFamily: 'Helvetica-Bold',
    color: '#00809D',
    lineHeight: 1.04,
  },
  subheadline: {
    fontSize: 48,
    fontWeight: 700,
    fontFamily: 'Helvetica-Bold',
    color: '#45423E',
    lineHeight: 1.04,
  },
  subtext: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#000',
    lineHeight: 1.33,
    marginTop: 18,
  },
  holiduLogo: {
    height: 24,
    width: 78,
    marginTop: 47,
  },
  rightSection: {
    position: 'absolute',
    left: 405.195,
    top: 434.025,
    width: 142,
    height: 322,
  },
  bgShape: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 142,
    height: 322,
  },
  qrContainer: {
    position: 'absolute',
    left: 26,
    top: 118,
    width: 89.7,
    backgroundColor: '#fff',
    borderRadius: 3.4,
    padding: 6.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrImage: {
    width: 74,
    height: 74,
  },
  scanText: {
    position: 'absolute',
    left: 70.8,
    top: 238,
    width: 105.8,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    fontWeight: 900,
    fontSize: 18,
    color: '#fff',
    transform: 'translateX(-50%)',
  },
});

interface PdfFlyerProps {
  image: string; // property image URL (should be data URL or public URL)
  qr: string;    // QR code image URL (should be data URL or public URL)
  holiduLogo: string; // logo image URL
  bgShape: string;    // background shape image URL
}

export const PdfFlyer: React.FC<PdfFlyerProps> = ({ image, qr, holiduLogo, bgShape }) =>
  React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page },
      React.createElement(Image, { src: image, style: styles.flyerImage }),
      React.createElement(View, { style: styles.leftSection },
        React.createElement(View, null,
          React.createElement(Text, { style: styles.headline }, 'Love this place?'),
          React.createElement(Text, { style: styles.subheadline }, 'Secure the best price'),
          React.createElement(Text, { style: styles.subtext },
            "Booking sites charge commission, we don't. Scan the QR Code to book next year's stay on our official website and ",
            React.createElement(Text, { style: { fontWeight: 700 } }, 'save up to 15%.')
          )
        ),
        React.createElement(Image, { src: holiduLogo, style: styles.holiduLogo })
      ),
      React.createElement(View, { style: styles.rightSection },
        React.createElement(Image, { src: bgShape, style: styles.bgShape }),
        React.createElement(View, { style: styles.qrContainer },
          React.createElement(Image, { src: qr, style: styles.qrImage })
        ),
        React.createElement(Text, { style: styles.scanText }, 'Scan for the best rate')
      )
    )
  ); 