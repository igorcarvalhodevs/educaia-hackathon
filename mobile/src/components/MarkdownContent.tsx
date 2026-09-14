import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  content: string;
};

export function MarkdownContent({
  content,
}: Props) {
  const lines = content.split("\n");

  return (
    <View style={styles.container}>
      {lines.map((rawLine, index) => {
        const line = rawLine.trim();

        if (!line) {
          return (
            <View
              key={index}
              style={styles.space}
            />
          );
        }

        if (
          line === "---" ||
          line === "***" ||
          line === "___"
        ) {
          return (
            <View
              key={index}
              style={styles.divider}
            />
          );
        }

        if (line.startsWith("### ")) {
          return (
            <Text
              key={index}
              style={styles.heading3}
            >
              {renderInline(
                line.replace(
                  /^###\s+/,
                  ""
                )
              )}
            </Text>
          );
        }

        if (line.startsWith("## ")) {
          return (
            <Text
              key={index}
              style={styles.heading2}
            >
              {renderInline(
                line.replace(
                  /^##\s+/,
                  ""
                )
              )}
            </Text>
          );
        }

        if (line.startsWith("# ")) {
          return (
            <Text
              key={index}
              style={styles.heading1}
            >
              {renderInline(
                line.replace(
                  /^#\s+/,
                  ""
                )
              )}
            </Text>
          );
        }

        if (
          line.startsWith("- ") ||
          line.startsWith("* ")
        ) {
          return (
            <View
              key={index}
              style={styles.listRow}
            >
              <Text style={styles.bullet}>
                •
              </Text>

              <Text style={styles.listText}>
                {renderInline(
                  line.replace(
                    /^[-*]\s+/,
                    ""
                  )
                )}
              </Text>
            </View>
          );
        }

        const numberedMatch =
          line.match(
            /^(\d+)\.\s+(.*)$/
          );

        if (numberedMatch) {
          return (
            <View
              key={index}
              style={styles.listRow}
            >
              <Text style={styles.number}>
                {numberedMatch[1]}.
              </Text>

              <Text style={styles.listText}>
                {renderInline(
                  numberedMatch[2]
                )}
              </Text>
            </View>
          );
        }

        return (
          <Text
            key={index}
            style={styles.paragraph}
          >
            {renderInline(line)}
          </Text>
        );
      })}
    </View>
  );
}

function renderInline(
  text: string
) {
  const parts = text.split(
    /(\*\*.*?\*\*|\*.*?\*|__.*?__|_.*?_)/g
  );

  return parts.map(
    (part, index) => {
      if (
        part.startsWith("**") &&
        part.endsWith("**") &&
        part.length > 4
      ) {
        return (
          <Text
            key={index}
            style={styles.bold}
          >
            {part.slice(2, -2)}
          </Text>
        );
      }

      if (
        part.startsWith("__") &&
        part.endsWith("__") &&
        part.length > 4
      ) {
        return (
          <Text
            key={index}
            style={styles.bold}
          >
            {part.slice(2, -2)}
          </Text>
        );
      }

      if (
        part.startsWith("*") &&
        part.endsWith("*") &&
        part.length > 2
      ) {
        return (
          <Text
            key={index}
            style={styles.italic}
          >
            {part.slice(1, -1)}
          </Text>
        );
      }

      if (
        part.startsWith("_") &&
        part.endsWith("_") &&
        part.length > 2
      ) {
        return (
          <Text
            key={index}
            style={styles.italic}
          >
            {part.slice(1, -1)}
          </Text>
        );
      }

      return part;
    }
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  heading1: {
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 31,
    marginTop: 8,
    marginBottom: 14,
    color: "#111827",
  },

  heading2: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 27,
    marginTop: 18,
    marginBottom: 10,
    color: "#111827",
  },

  heading3: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
    marginTop: 14,
    marginBottom: 8,
    color: "#111827",
  },

  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: "#374151",
    marginBottom: 7,
  },

  bold: {
    fontWeight: "700",
    color: "#111827",
  },

  italic: {
    fontStyle: "italic",
  },

  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingRight: 6,
  },

  bullet: {
    width: 22,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "700",
    color: "#111827",
  },

  number: {
    minWidth: 28,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "700",
    color: "#111827",
  },

  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 23,
    color: "#374151",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 18,
  },

  space: {
    height: 7,
  },
});