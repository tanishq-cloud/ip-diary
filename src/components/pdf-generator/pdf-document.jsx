import React from "react";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import styles from "./style-sheet";
import ifhelogo from "/public/ifhe.jpg";

function formatDate(date) {
    const dateObj = new Date(date);

    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
    const year = dateObj.getFullYear();

    
    return `${day}/${month}/${year}`;
}

const PDFDocument = ({ data, font, positions, userDetails }) => {
  const filteredData = data.filter((entry) => entry.Task !== "HOLIDAY");
  const holidays = data.filter((entry) => entry.Task === "HOLIDAY");
  
  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <Text style={styles.title}>Internship Program Diary</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>
                : {userDetails?.name || "_________________"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>ID No.</Text>
              <Text style={styles.value}>
                : {userDetails?.idNo || "_________________"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>IP Station</Text>
              <Text style={styles.value}>
                : {userDetails?.ipStation || "_________________"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Duration</Text>
              <Text style={styles.value}>
                : {formatDate(userDetails?.duration?.from) || "_________"} to{" "}
                {formatDate(userDetails?.duration?.to) || "_________"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Faculty Mentor</Text>
              <Text style={styles.value}>
                : {userDetails?.facultyMentor || "_________________"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Company Mentor</Text>
              <Text style={styles.value}>
                : {userDetails?.companyMentor || "_________________"}
              </Text>
            </View>
          </View>

          {/* Logo will be imported from assets */}
          <Image src={ifhelogo} style={styles.logo} />
          <Text style={styles.facultyText}>
            Faculty of Science & Technology
          </Text>
        </View>
      </Page>

      {/* Content Pages */}
      {filteredData.map((entry, index) => (
        <Page key={index} size="A4" style={styles.page}>
          <View style={styles.contentWrapper}>
            <View style={styles.contentPage}>
              <View style={{ ...styles.header, ...positions.header }}>
                <Text style={{ fontFamily: font }}>Day: {entry.Day || ""}</Text>
                <Text style={{ fontFamily: font }}>
                  Date: {entry.Date || ""}
                </Text>
              </View>

              <View style={{ ...styles.content, ...positions.content }}>
                <Text style={{ fontFamily: font }}>{entry.Task || ""}</Text>
              </View>

              <View style={{ ...styles.footer }}>
                <View style={styles.footerRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: font, ...styles.footerText }}>
                      Checked by:
                    </Text>
                    <View style={styles.line} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 20 }}>
                    <Text style={{ fontFamily: font, ...styles.footerText }}>
                      Date:
                    </Text>
                    <View style={styles.line} />
                  </View>
                </View>

                <View style={styles.footerRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: font, ...styles.footerText }}>
                      Verified by:
                    </Text>
                    <View style={styles.line} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 20 }}>
                    <Text style={{ fontFamily: font, ...styles.footerText }}>
                      Date:
                    </Text>
                    <View style={styles.line} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Page>
      ))}

      {/* Holidays Page */}
      {holidays.length > 0 && (
        <Page size="A4" style={styles.contentPage}>
          <View style={styles.content}>
            <Text
              style={{ fontFamily: font, fontSize: 16, fontWeight: "bold" }}
            >
              Holidays
            </Text>
            <ul>
              {holidays.map((holiday, index) => (
                <li key={index}>
                  <Text style={{ fontFamily: font }}>{holiday.Date || ""}</Text>
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
