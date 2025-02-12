import { StyleSheet, Font } from "@react-pdf/renderer";
import LibreBaskervilleItalic from "/src/assets/fonts/LibreBaskerville-Italic.ttf";

Font.register({
  family: "Libre Baskerville",
  src: LibreBaskervilleItalic,
  fontStyle: "italic",
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  contentWrapper: {
    margin: 10,
    border: "1 solid black",
    height: "93%",
    position: "relative", 
  },
  contentPage: {
    padding: 30,
    backgroundColor: "#ffffff",
    height: "100%", 
    position: "relative", 
  },
  coverPage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "60px 40px",
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    fontFamily: "Libre Baskerville",
    fontStyle: "italic",
  },
  detailsContainer: {
    width: "100%",
    marginTop: 20,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  label: {
    width: 120,
    fontSize: 12,
  },
  value: {
    flex: 1,
    fontSize: 12,
    borderBottom: "1pt solid black",
    paddingBottom: 2,
  },
  logo: {
    width: 150,
    marginBottom: 20,
  },
  facultyText: {
    fontSize: 16,
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    fontSize: 12,
  },
  content: {
    flex: 1,
    marginBottom: 100, 
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  footerText: {
    fontSize: 10,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginTop: 5,
  },
});

export default styles;
