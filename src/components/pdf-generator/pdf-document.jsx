import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import styles from './style-sheet';

const PDFDocument = ({ data, font, positions }) => {
  // Filter out holidays
  const filteredData = data.filter((entry) => entry.Task !== 'HOLIDAY');
  const holidays = data.filter((entry) => entry.Task === 'HOLIDAY');

  return (
    <Document>
      {/* Render pages for non-holiday tasks */}
      {filteredData.map((entry, index) => (
        <Page key={index} size="A4" style={styles.page}>
          <View style={{ ...styles.header, ...positions.header }}>
            <Text style={{ fontFamily: font }}>Day: {entry.Day || ''}</Text>
            <Text style={{ fontFamily: font }}>Date: {entry.Date || ''}</Text>
          </View>

          <View style={{ ...styles.content, ...positions.content }}>
            <Text style={{ fontFamily: font }}>{entry.Task || ''}</Text>
          </View>

          <View style={{ ...styles.footer, ...positions.footer }}>
            <View style={styles.footerRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: font, ...styles.footerText }}>Checked by:</Text>
                <View style={styles.line} />
              </View>
              <View style={{ flex: 1, marginLeft: 20 }}>
                <Text style={{ fontFamily: font, ...styles.footerText }}>Date:</Text>
                <View style={styles.line} />
              </View>
            </View>

            <View style={styles.footerRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: font, ...styles.footerText }}>Verified by:</Text>
                <View style={styles.line} />
              </View>
              <View style={{ flex: 1, marginLeft: 20 }}>
                <Text style={{ fontFamily: font, ...styles.footerText }}>Date:</Text>
                <View style={styles.line} />
              </View>
            </View>
          </View>
        </Page>
      ))}

      {/* Render a page for holidays */}
      {holidays.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.content}>
            <Text style={{ fontFamily: font, fontSize: 16, fontWeight: 'bold' }}>Holidays</Text>
            <ul>
              {holidays.map((holiday, index) => (
                <li key={index}>
                  <Text style={{ fontFamily: font }}>{holiday.Date || ''}</Text>
                </li>
              ))}
            </ul>
          </View>
        </Page>
      )}
    </Document>
  );
};

export default PDFDocument;