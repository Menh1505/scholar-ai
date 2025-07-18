import React, { useRef, useEffect } from "react";
import { MessageBubble, Message } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { WelcomeMessage } from "./WelcomeMessage";

interface MessagesAreaProps {
  messages: Message[];
  isTyping: boolean;
}

export const MessagesArea: React.FC<MessagesAreaProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? <WelcomeMessage /> : messages.map((message) => <MessageBubble key={message.id} message={message} />)}

      {isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};
