import React from "react";
import { unified } from "unified";
import parse from "remark-parse";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  paragraph: { marginBottom: 5 },
  heading1: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  heading2: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  heading3: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  heading4: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  heading5: { fontSize: 14, fontWeight: "bold", marginBottom: 2 },
  heading6: { fontSize: 12, fontWeight: "bold", marginBottom: 2 },
  list: { marginLeft: 20, marginBottom: 5 },
  listItem: {
    marginBottom: 2,
    flexDirection: "row", // Align bullet and text horizontally
  },
  bullet: {
    marginRight: 5, // Add space between bullet and text
  },
  blockquote: {
    marginLeft: 20,
    borderLeftWidth: 2,
    paddingLeft: 10,
    marginBottom: 5,
  },
  code: {
    fontFamily: "Courier",
    fontSize: 10,
    backgroundColor: "#f5f5f5",
    padding: 5,
    marginBottom: 5,
  },
  inlineCode: {
    fontFamily: "Courier",
    fontSize: 10,
    backgroundColor: "#f5f5f5",
    padding: 2,
  },
});

const parseMarkdown = (markdown, fontFamily = "Helvetica") => {
  const tree = unified().use(parse).parse(markdown);

  const renderNode = (node) => {
    switch (node.type) {
      case "text":
        return <Text style={{ fontFamily }}>{node.value}</Text>;
      case "paragraph":
        return (
          <View style={styles.paragraph}>
            {node.children.map((child, index) => (
              <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
            ))}
          </View>
        );
      case "strong":
        return (
          <Text style={[styles.bold, { fontFamily }]}>
            {node.children.map((child, index) => (
              <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
            ))}
          </Text>
        );
      case "emphasis":
        return (
          <Text style={[styles.italic, { fontFamily }]}>
            {node.children.map((child, index) => (
              <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
            ))}
          </Text>
        );
      case "heading":
        const styleKey = `heading${node.depth}`;
        return (
          <View style={styles[styleKey]}>
            <Text style={{ fontFamily }}>
              {node.children.map((child, index) => (
                <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
              ))}
            </Text>
          </View>
        );
      case "list":
        return (
          <View style={styles.list}>
            {node.children.map((child, index) => (
              <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
            ))}
          </View>
        );
      case "listItem":
        return (
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={{ fontFamily }}>
              {node.children.map((child, index) => (
                <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
              ))}
            </Text>
          </View>
        );
      case "blockquote":
        return (
          <View style={styles.blockquote}>
            {node.children.map((child, index) => (
              <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
            ))}
          </View>
        );
      case "code":
        return (
          <View style={styles.code}>
            <Text style={{ fontFamily: "Courier" }}>{node.value}</Text>
          </View>
        );
      case "inlineCode":
        return (
          <Text style={[styles.inlineCode, { fontFamily: "Courier" }]}>
            {node.value}
          </Text>
        );
      case "break":
        return <Text>{"\n"}</Text>;
      default:
        return null;
    }
  };

  return tree.children.map((node, index) => (
    <React.Fragment key={index}>{renderNode(node)}</React.Fragment>
  ));
};

export default parseMarkdown;
