"use client";
import React, { useState } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

interface SuggestedQuestion {
  id: number;
  text: string;
  active?: boolean;
}

function Agent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "ai",
      timestamp: "10:30 AM",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const suggestedQuestions: SuggestedQuestion[] = [
    { id: 1, text: "How to get passport", active: true },
    { id: 2, text: "What is scholar point", active: false },
    { id: 3, text: "How to use website", active: false },
  ];

  const mockResponses = [
    "Great question! Let me help you with that.",
    "Here's what I found about your inquiry:",
    "Based on the information available, I can provide you with the following guidance:",
    "That's an interesting question. Let me break it down for you:",
    "I'd be happy to assist you with this. Here's what you need to know:",
  ];

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newUserMessage: Message = {
        id: messages.length + 1,
        text: inputMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setInputMessage("");

      // Simulate AI response after a short delay
      setTimeout(() => {
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        const aiResponse: Message = {
          id: messages.length + 2,
          text: randomResponse,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleSuggestedQuestion = (questionText: string) => {
    setInputMessage(questionText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header with Search */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">AI Assistant</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-64 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-800 border border-gray-200"
                }`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-200" : "text-gray-500"}`}>{message.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Message"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage} className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar with Suggested Questions */}
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Suggested Questions</h2>
        <div className="space-y-3">
          {suggestedQuestions.map((question) => (
            <button
              key={question.id}
              onClick={() => handleSuggestedQuestion(question.text)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                question.active ? "bg-purple-600 text-white border-purple-600" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm">{question.text}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Additional Help Section */}
        <div className="mt-8">
          <h3 className="text-md font-semibold text-gray-800 mb-3">How can I help you?</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Ask about passport requirements</p>
            <p>• Learn about scholar points system</p>
            <p>• Get guidance on website usage</p>
            <p>• Inquire about study programs</p>
            <p>• Request financial planning help</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Agent;
