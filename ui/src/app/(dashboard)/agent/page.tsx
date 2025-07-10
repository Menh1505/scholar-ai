"use client";
import React, { useState } from "react";
import { useUserData } from "@/hooks/useUserData";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

function Agent() {
  const { userProfile, documentStatus } = useUserData();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Xin chào ${userProfile?.fullname || "bạn"}! Tôi là Scholar AI - trợ lý tư vấn du học Mỹ thông minh. 

Tôi thấy bạn đã hoàn thành ${documentStatus?.filter((doc) => doc.completed).length || 0}/${
        documentStatus?.filter((doc) => doc.required).length || 0
      } tài liệu bắt buộc và có ${userProfile?.scholarPoints || 0} Scholar Points.

Tôi có thể giúp bạn:
• Tìm hiểu thông tin các trường đại học Mỹ
• Lập kế hoạch du học cá nhân hóa
• Hướng dẫn quy trình pháp lý và visa
• Kiểm tra hồ sơ tài liệu còn thiếu
• Tư vấn chi phí và học bổng

Bạn cần hỗ trợ gì hôm nay?`,
      sender: "ai",
      timestamp: "10:30 AM",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getSuggestedQuestions = (): { id: number; text: string; active: boolean }[] => {
    const completed = documentStatus?.filter((doc) => doc.completed).length || 0;
    const total = documentStatus?.filter((doc) => doc.required).length || 0;

    if (completed === 0) {
      // User mới bắt đầu
      return [
        { id: 1, text: "Tôi nên bắt đầu chuẩn bị gì trước tiên?", active: true },
        { id: 2, text: "Lộ trình du học Mỹ từ A-Z", active: false },
        { id: 3, text: "Cần bao nhiêu tiền để du học Mỹ?", active: false },
      ];
    } else if (completed < total) {
      // User đang trong quá trình chuẩn bị
      return [
        { id: 1, text: "Tôi cần hoàn thành tài liệu gì tiếp theo?", active: true },
        { id: 2, text: "Hướng dẫn xin visa F-1 du học Mỹ", active: false },
        { id: 3, text: "Kiểm tra hồ sơ của tôi", active: false },
      ];
    } else {
      // User đã hoàn thành cơ bản
      return [
        { id: 1, text: "Chuẩn bị phỏng vấn visa như thế nào?", active: true },
        { id: 2, text: "Trường đại học nào phù hợp với tôi?", active: false },
        { id: 3, text: "Lên kế hoạch tài chính chi tiết", active: false },
      ];
    }
  };

  const suggestedQuestions = getSuggestedQuestions();

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isLoading) {
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
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputMessage,
            userProfile,
            documentStatus,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          const aiResponse: Message = {
            id: messages.length + 2,
            text: data.response,
            sender: "ai",
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prev) => [...prev, aiResponse]);
        } else {
          throw new Error(data.error || "Có lỗi xảy ra");
        }
      } catch (err) {
        console.error("Error sending message:", err);
        const errorResponse: Message = {
          id: messages.length + 2,
          text: "Xin lỗi, có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.",
          sender: "ai",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, errorResponse]);
      } finally {
        setIsLoading(false);
      }
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
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Scholar AI Assistant</h1>
              <p className="text-sm text-gray-600">Trợ lý tư vấn du học thông minh</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm trong cuộc trò chuyện..."
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
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang gửi...
                </>
              ) : (
                "Gửi"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar with Suggested Questions */}
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Câu hỏi gợi ý</h2>
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
          <h3 className="text-md font-semibold text-gray-800 mb-3">Tình hình hồ sơ của bạn:</h3>
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-800">Tiến độ tài liệu:</span>
              <span className="text-sm font-bold text-blue-900">
                {documentStatus?.filter((doc) => doc.completed).length || 0}/{documentStatus?.filter((doc) => doc.required).length || 0}
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((documentStatus?.filter((doc) => doc.completed).length || 0) / (documentStatus?.filter((doc) => doc.required).length || 1)) * 100
                  }%`,
                }}></div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • Scholar Points: <span className="font-bold text-blue-600">{userProfile?.scholarPoints || 0}</span>
            </p>
            <p>• Quốc tịch: {userProfile?.nationality}</p>
            <p>• Hộ chiếu: {userProfile?.passportCode || "Chưa cập nhật"}</p>
          </div>
        </div>

        {/* Dynamic Help */}
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-800 mb-3">Bước tiếp theo:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            {documentStatus
              ?.filter((doc) => doc.required && !doc.completed)
              .slice(0, 3)
              .map((doc) => <p key={doc.id}>• {doc.name}</p>) || <p>• Hoàn thành tuyệt vời! 🎉</p>}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-md font-semibold text-gray-800 mb-3">Thao tác nhanh:</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors text-sm">
              📋 Kiểm tra hồ sơ của tôi
            </button>
            <button className="w-full text-left p-2 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors text-sm">
              📚 Tìm trường phù hợp
            </button>
            <button className="w-full text-left p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors text-sm">
              💰 Tính toán chi phí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Agent;
