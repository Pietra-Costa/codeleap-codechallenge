// mentionStyle.js
const mentionStyle = {
  control: {
    backgroundColor: "white",
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
      backgroundColor: "white",
      border: "1px solid rgba(0,0,0,0.15)",
      fontSize: 16,
    },
    item: {
      padding: "5px 15px",
      borderBottom: "1px solid #ddd",
      "&focused": {
        backgroundColor: "#e2e8f0",
      },
    },
  },
};

export default mentionStyle;
