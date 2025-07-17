import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font
} from '@react-pdf/renderer';

// Register fonts for PDF embedding
Font.register({ family: 'Satoshi', src: '/fonts/Satoshi-Regular.ttf' });
Font.register({ family: 'Satoshi', src: '/fonts/Satoshi-Bold.ttf', fontWeight: 700 });
Font.register({ family: 'Satoshi', src: '/fonts/Satoshi-Black.ttf', fontWeight: 900 });
Font.register({ family: 'Inter', src: '/fonts/Inter-Regular.ttf' });
Font.register({ family: 'Inter', src: '/fonts/Inter-Bold.ttf', fontWeight: 700 });

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
    fontFamily: 'Satoshi',
    color: '#00809D',
    lineHeight: 1.04,
  },
  subheadline: {
    fontSize: 48,
    fontWeight: 700,
    fontFamily: 'Satoshi',
    color: '#45423E',
    lineHeight: 1.04,
  },
  subtext: {
    fontSize: 12,
    fontFamily: 'Inter',
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
    fontFamily: 'Satoshi',
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

export const PdfFlyer: React.FC<PdfFlyerProps> = ({ image, qr, holiduLogo, bgShape }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Property image */}
      <Image src={image} style={styles.flyerImage} />
      {/* Left section */}
      <View style={styles.leftSection}>
        <View>
          <Text style={styles.headline}>Love this place?</Text>
          <Text style={styles.subheadline}>Secure the best price</Text>
          <Text style={styles.subtext}>
            Booking sites charge commission, we don&apos;t. Scan the QR Code to book next year&apos;s stay on our official website and <Text style={{ fontWeight: 700, fontFamily: 'Inter' }}>save up to 15%.</Text>
          </Text>
        </View>
        <Image src={holiduLogo} style={styles.holiduLogo} />
      </View>
      {/* Right section */}
      <View style={styles.rightSection}>
        <Image src={bgShape} style={styles.bgShape} />
        <View style={styles.qrContainer}>
          <Image src={qr} style={styles.qrImage} />
        </View>
        <Text style={styles.scanText}>Scan for the best rate</Text>
      </View>
    </Page>
  </Document>
); 