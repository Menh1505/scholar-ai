"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAgentStore } from "@/stores/useAgentStore";
import { useUserStore } from "@/stores/useUserStore";
import { ChatArea } from "@/components/agent/ChatArea";
import { SuggestedQuestions } from "@/components/agent/SuggestedQuestions";
import { Message } from "@/components/agent/MessageBubble";

export default function AgentPage() {
  const { user } = useUserStore();
  const { sendMessage, getUserSession, getMessageHistory, currentSession, messageHistory, loading, error, clearError } = useAgentStore();

  console.log("AgentPage render", { user, currentSession, messageHistory, loading, error });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (user?._id) {
      getUserSession(user._id);
      getMessageHistory(user._id);
    }
  }, [user, getUserSession, getMessageHistory]);

  useEffect(() => {
    if (messageHistory?.messages) {
      const formattedMessages: Message[] = messageHistory.messages
        .map((msg) => [
          {
            id: `${msg.id}-user`,
            content: msg.message,
            isUser: true,
            timestamp: msg.timestamp,
            phase: msg.phase,
          },
          {
            id: `${msg.id}-agent`,
            content: msg.response,
            isUser: false,
            timestamp: msg.timestamp,
            phase: msg.phase,
          },
        ])
        .flat();
      setMessages(formattedMessages);
    }
  }, [messageHistory]);

  const handleSendMessage = async () => {
    console.log("handleSendMessage called", { inputMessage, userId: user?._id });

    if (!inputMessage.trim() || !user?._id) {
      console.log("Early return - missing message or user", { inputMessage: inputMessage.trim(), userId: user?._id });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    console.log("Adding user message to state", userMessage);
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      console.log("Calling sendMessage API...");
      const response = await sendMessage({
        userId: user._id,
        message: inputMessage.trim(),
      });

      console.log("Received response from API", response);

      const agentMessage: Message = {
        id: `${Date.now()}-agent`,
        content: response.response,
        isUser: false,
        timestamp: response.timestamp,
        phase: response.phase,
      };

      console.log("Adding agent message to state", agentMessage);
      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        content: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    textareaRef.current?.focus();
  };

  return (
    <div className="h-screen flex">
      <ChatArea
        currentSession={currentSession}
        error={error}
        onClearError={clearError}
        messages={messages}
        isTyping={isTyping}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        onSendMessage={handleSendMessage}
        loading={loading}
        textareaRef={textareaRef}
      />

      <SuggestedQuestions onQuestionSelect={handleSuggestedQuestion} currentSession={currentSession} />
    </div>
  );
}
