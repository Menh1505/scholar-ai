"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAgentStore } from "@/stores/useAgentStore";
import { useUserStore } from "@/stores/useUserStore";
import { ChatArea } from "@/components/agent/ChatArea";
import { SuggestedQuestions } from "@/components/agent/SuggestedQuestions";
import { Message } from "@/components/agent/MessageBubble";
import toast from "react-hot-toast";

export default function AgentPage() {
  const { user } = useUserStore();
  const { sendMessage, getUserSession, getMessageHistory, currentSession, messageHistory, loading, error, clearError } = useAgentStore();

  console.log("AgentPage render", { user, currentSession, messageHistory, loading, error });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getUserSession();
    getMessageHistory();
  }, [getUserSession, getMessageHistory]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError(); // Auto clear error after showing toast
    }
  }, [error, clearError]);

  // Load message history only once when page loads
  useEffect(() => {
    if (messageHistory?.messages && !historyLoaded) {
      const formattedMessages: Message[] = messageHistory.messages.map((msg, index) => ({
        id: `${index}-${msg.role}`,
        content: msg.content,
        isUser: msg.role === "user",
        timestamp: msg.timestamp,
      }));
      setMessages(formattedMessages);
      setHistoryLoaded(true);
    }
  }, [messageHistory, historyLoaded]);

  const handleSendMessage = async () => {
    console.log("handleSendMessage called", { inputMessage });

    if (!inputMessage.trim()) {
      console.log("Early return - missing message", { inputMessage: inputMessage.trim() });
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

      // Show error toast
      toast.error("Failed to send message. Please try again.");

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
