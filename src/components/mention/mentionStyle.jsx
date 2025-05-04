const mentionStyle = {
  control: {
    backgroundColor: "transparent",
    fontSize: 16,
    fontWeight: "normal",
    padding: "10px",
    borderRadius: "8px",
    outline: "none",
    transition: "all 0.2s",
    minHeight: "100px",
  },
  highlighter: {
    overflow: "hidden",
  },
  input: {
    margin: 0,
    padding: "10px",
    width: "100%",
    outline: "none",
  },
  suggestions: {
    list: {
      backgroundColor: "#7695ec",
      border: "1px solid rgba(0,0,0,0.15)",
      fontSize: 14,
      maxHeight: "200px",
      overflowY: "auto",
    },
    item: {
      padding: "5px 15px",
      borderBottom: "1px solid #ddd",
      "&focused": {
        backgroundColor: " #7695ec",
      },
    },
  },
};

export default mentionStyle;
