import React from "react";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  phase?: string;
}

interface MessageProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageProps> = ({ message }) => {
  const formatMessage = (content: string) => {
    return content.split("\\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split("\\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}>
        <div className="text-sm">{formatMessage(message.content)}</div>
        <div className={`text-xs mt-1 ${message.isUser ? "text-blue-100" : "text-gray-500"}`}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};
