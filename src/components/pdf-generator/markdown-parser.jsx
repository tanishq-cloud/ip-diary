import React from "react";
import { unified } from "unified";
import parse from "remark-parse";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  paragraph: { marginBottom: 5 },
  heading1: { fontSize: 24, marginBottom: 10 },
  heading2: { fontSize: 20, marginBottom: 8 },
  heading3: { fontSize: 18, marginBottom: 6 },
  heading4: { fontSize: 16, marginBottom: 4 },
  heading5: { fontSize: 14, marginBottom: 2 },
  heading6: { fontSize: 12, marginBottom: 2 },
  list: { marginLeft: 20, marginBottom: 5 },
  listItem: {
    marginBottom: 2,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bullet: {
    marginRight: 5,
    minWidth: 15,
  },
  listContent: {
    flex: 1,
  },
  blockquote: {
    marginLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: "#ccc",
    paddingLeft: 10,
    marginBottom: 5,
  },
  code: {
    fontSize: 10,
    backgroundColor: "#f5f5f5",
    padding: 5,
    marginBottom: 5,
  },
  inlineCode: {
    fontSize: 10,
    backgroundColor: "#f5f5f5",
    padding: 2,
  },
});

const parseMarkdown = (markdown) => {
  const fonts = {
    regular: "Helvetica",
    bold: "Helvetica-Bold",
    italic: "Helvetica-Oblique",
    boldItalic: "Helvetica-BoldOblique",
    code: "Courier",
    // TODO: Add fontFamily
    // family: "Helvetica",
  };

  const tree = unified().use(parse).parse(markdown);

  const getFontStyle = (isBold = false, isItalic = false) => {
    if (fonts.family) {
      return {
        fontFamily: fonts.family,
        fontWeight: isBold ? "bold" : "normal",
        fontStyle: isItalic ? "italic" : "normal",
      };
    } else {
      if (isBold && isItalic) {
        return { fontFamily: fonts.boldItalic };
      } else if (isBold) {
        return { fontFamily: fonts.bold };
      } else if (isItalic) {
        return { fontFamily: fonts.italic };
      } else {
        return { fontFamily: fonts.regular };
      }
    }
  };

  const renderInlineContent = (nodes) => {
    return nodes.map((node, index) => {
      switch (node.type) {
        case "text":
          return node.value;

        case "strong":
          return (
            <Text key={index} style={getFontStyle(true, false)}>
              {renderInlineContent(node.children)}
            </Text>
          );

        case "emphasis":
          return (
            <Text key={index} style={getFontStyle(false, true)}>
              {renderInlineContent(node.children)}
            </Text>
          );

        case "inlineCode":
          return (
            <Text
              key={index}
              style={[styles.inlineCode, { fontFamily: fonts.code }]}
            >
              {node.value}
            </Text>
          );

        case "break":
          return "\n";

        default:
          return "";
      }
    });
  };

  const renderNode = (node, listIndex = null) => {
    switch (node.type) {
      case "paragraph":
        return (
          <View style={styles.paragraph}>
            <Text style={getFontStyle()}>
              {renderInlineContent(node.children)}
            </Text>
          </View>
        );

      case "heading":
        const styleKey = `heading${node.depth}`;
        return (
          <View style={styles[styleKey]}>
            <Text style={getFontStyle(true, false)}>
              {renderInlineContent(node.children)}
            </Text>
          </View>
        );

      case "list":
        return (
          <View style={styles.list}>
            {node.children.map((child, index) =>
              renderNode(child, node.ordered ? index + 1 : null),
            )}
          </View>
        );

      case "listItem":
        const bullet = listIndex !== null ? `${listIndex}.` : "•";

        const listItemContent = node.children.map((child, index) => {
          if (child.type === "paragraph") {
            return (
              <Text key={index} style={getFontStyle()}>
                {renderInlineContent(child.children)}
              </Text>
            );
          } else {
            return renderNode(child);
          }
        });

        return (
          <View style={styles.listItem}>
            <Text style={[styles.bullet, getFontStyle()]}>{bullet}</Text>
            <View style={styles.listContent}>{listItemContent}</View>
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
            <Text style={{ fontFamily: fonts.code }}>{node.value}</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return tree.children.map((node, index) => (
    <React.Fragment key={index}>{renderNode(node)}</React.Fragment>
  ));
};

export default parseMarkdown;
