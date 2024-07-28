import React from "react";
import PropTypes from "prop-types";

const Message = ({ text, isUser }) => {
  return (
    <div
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        backgroundColor: isUser ? "#DCF8C6" : "#FFF",
        border: "1px solid #CCC",
        borderRadius: "10px",
        padding: "10px",
        margin: "5px 0",
      }}
    >
      {text}
    </div>
  );
};

Message.propTypes = {
  text: PropTypes.string,
  isUser: PropTypes.bool,
};

export default Message;
