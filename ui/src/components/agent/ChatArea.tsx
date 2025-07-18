import React from "react";
import { MessagesArea } from "./MessagesArea";
import { ChatInput } from "./ChatInput";
import { Message } from "./MessageBubble";
import { AgentSession } from "@/types/agent";

interface ChatAreaProps {
  currentSession: AgentSession | null;
  messages: Message[];
  isTyping: boolean;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  loading: boolean;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  currentSession,
  messages,
  isTyping,
  inputMessage,
  setInputMessage,
  onSendMessage,
  loading,
  textareaRef,
}) => {
  return (
    <div className="flex-1 flex flex-col">
      <MessagesArea messages={messages} isTyping={isTyping} />

      <ChatInput inputMessage={inputMessage} setInputMessage={setInputMessage} onSendMessage={onSendMessage} loading={loading} textareaRef={textareaRef} />
    </div>
  );
};
