import React from "react";

import "./Message.css";

import ReactEmoji from "react-emoji";
import { SERVER_ADDRESS } from "../../constants/config";

const Message = ({ message: { body, user, type }, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }
  let imageSrc = SERVER_ADDRESS + "/" + body;
  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimmedName}</p>
      <div className="messageBox backgroundBlue">
        {type === "image" ? (
          <img
            onClick={(e) => window.open(imageSrc)}
            className="messageImage"
            src={imageSrc}
          />
        ) : (
          <p className="messageText colorWhite">{body}</p>
        )}
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        {type === "image" ? (
          <img
            onClick={(e) => window.open(imageSrc)}
            className="messageImage"
            src={imageSrc}
          />
        ) : (
          <p className="messageText colorDark">{body}</p>
        )}
      </div>
      <p className="sentText pl-10 ">{user}</p>
    </div>
  );
};

export default Message;
