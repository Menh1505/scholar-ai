"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useUserData } from "@/hooks/useUserData";
import FileUpload from "@/components/FileUpload";
import DocumentAnalysisDisplay from "@/components/DocumentAnalysisDisplay";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

interface DocumentAnalysisResult {
  success: boolean;
  analysis: {
    documentType: string;
    isValid: boolean;
    missingRequirements: string[];
    suggestions: string[];
    confidence: number;
  };
  fileName: string;
  originalFile: File;
}

function Agent() {
  const { userProfile, documentStatus } = useUserData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // File upload states
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [isProcessingConfirmation, setIsProcessingConfirmation] = useState(false);

  // Helper function to create welcome message
  const createWelcomeMessage = useCallback((profile: any, docStatus: any): Message => {
    const completed = docStatus?.filter((doc: any) => doc.completed).length || 0;
    const total = docStatus?.filter((doc: any) => doc.required).length || 0;

    return {
      id: 1,
      text: `Xin chào ${profile?.fullname || "bạn"}! Tôi là Scholar AI - trợ lý tư vấn du học Mỹ thông minh. 

Tôi thấy bạn đã hoàn thành ${completed}/${total} tài liệu bắt buộc và có ${profile?.scholarPoints || 0} Scholar Points.

Tôi có thể giúp bạn:
• Tìm hiểu thông tin các trường đại học Mỹ
• Lập kế hoạch du học cá nhân hóa
• Hướng dẫn quy trình pháp lý và visa
• Kiểm tra hồ sơ tài liệu còn thiếu
• Tư vấn chi phí và học bổng

Bạn cần hỗ trợ gì hôm nay?`,
      sender: "ai",
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }, []);

  // Load chat history only once on component mount
  useEffect(() => {
    let isMounted = true; // Prevent race conditions

    const loadChatHistory = async () => {
      if (!userProfile) {
        console.log("⏳ Waiting for userProfile to load...");
        return; // Wait for userProfile to be loaded
      }

      console.log("🔄 Loading chat history...");

      try {
        const response = await fetch("/api/chat-history");
        if (response.ok && isMounted) {
          const data = await response.json();
          console.log("✅ Chat history loaded:", data.messages.length, "messages");

          const historyMessages = data.messages.map((msg: any, index: number) => ({
            id: index + 1,
            text: msg.content,
            sender: msg.role === "user" ? "user" : "ai",
            timestamp: new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

          if (historyMessages.length === 0) {
            // Nếu không có lịch sử, tạo tin nhắn chào mừng với thông tin user
            const welcomeMessage = createWelcomeMessage(userProfile, documentStatus);
            setMessages([welcomeMessage]);
          } else {
            setMessages(historyMessages);
          }
        }
      } catch (error) {
        console.error("❌ Error loading chat history:", error);
        if (isMounted) {
          // Fallback to welcome message
          const welcomeMessage = createWelcomeMessage(userProfile, documentStatus);
          setMessages([welcomeMessage]);
        }
      } finally {
        if (isMounted) {
          setLoadingHistory(false);
          console.log("✅ Chat history loading completed");
        }
      }
    };

    if (userProfile) {
      loadChatHistory();
    }

    // Cleanup function
    return () => {
      isMounted = false;
      console.log("🧹 Agent component cleanup");
    };
  }, [userProfile, documentStatus, createWelcomeMessage]); // Phụ thuộc vào userProfile và documentStatus

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

  const [lastSentTime, setLastSentTime] = useState(0);
  const SEND_COOLDOWN = 1000; // 1 second cooldown between messages

  // File upload handlers
  const handleFileUpload = () => {
    setShowFileUpload(true);
    setAnalysisResult(null);
  };

  const handleFileAnalyzed = (result: DocumentAnalysisResult) => {
    setAnalysisResult(result);
    setShowFileUpload(false);

    // Add AI message about the analysis
    const aiMessage: Message = {
      id: Date.now(),
      text: `Tôi đã phân tích tài liệu "${result.fileName}" của bạn:

📄 **Loại tài liệu:** ${result.analysis.documentType}
${result.analysis.isValid ? "✅ **Trạng thái:** Hợp lệ" : "❌ **Trạng thái:** Cần cải thiện"}
🎯 **Độ tin cậy:** ${result.analysis.confidence}%

${
  result.analysis.missingRequirements.length > 0
    ? `⚠️ **Yêu cầu còn thiếu:**\n${result.analysis.missingRequirements.map((req) => `• ${req}`).join("\n")}\n\n`
    : ""
}

${result.analysis.suggestions.length > 0 ? `💡 **Gợi ý cải thiện:**\n${result.analysis.suggestions.map((suggestion) => `• ${suggestion}`).join("\n")}\n\n` : ""}

${
  result.analysis.isValid
    ? "✅ Tài liệu này đáp ứng yêu cầu! Bạn có muốn tôi thêm vào danh sách tài liệu pháp lý của bạn không?"
    : "❌ Tài liệu cần được cải thiện trước khi có thể thêm vào danh sách."
}`,
      sender: "ai",
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleFileUploadError = (error: string) => {
    const errorMessage: Message = {
      id: Date.now(),
      text: `❌ Lỗi khi xử lý tài liệu: ${error}`,
      sender: "ai",
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, errorMessage]);
  };

  const handleConfirmDocument = async () => {
    if (!analysisResult) return;

    setIsProcessingConfirmation(true);

    try {
      const response = await fetch("/api/legal-documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentType: analysisResult.analysis.documentType,
          fileName: analysisResult.fileName,
          analysisId: `analysis_${Date.now()}`,
          confirmed: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const successMessage: Message = {
          id: Date.now(),
          text: `🎉 **Tài liệu đã được thêm thành công!**

"${analysisResult.fileName}" đã được thêm vào danh sách tài liệu pháp lý của bạn và đánh dấu là đã hoàn thành.

Bạn có thể kiểm tra trạng thái tại trang **Legal Documents** trong menu bên trái.`,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, successMessage]);
        setAnalysisResult(null);
      } else {
        throw new Error(data.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error confirming document:", error);
      const errorMessage: Message = {
        id: Date.now(),
        text: `❌ Lỗi khi thêm tài liệu: ${error}`,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessingConfirmation(false);
    }
  };

  const handleCancelDocument = () => {
    setAnalysisResult(null);

    const cancelMessage: Message = {
      id: Date.now(),
      text: "Đã hủy việc thêm tài liệu. Bạn có thể upload tài liệu khác hoặc tiếp tục chat với tôi.",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, cancelMessage]);
  };

  const handleSendMessage = async () => {
    const now = Date.now();

    // Protection against spam sending
    if (now - lastSentTime < SEND_COOLDOWN) {
      console.log("⏳ Cooldown active, ignoring send request");
      return;
    }

    if (!inputMessage.trim() || isLoading) {
      return;
    }

    setLastSentTime(now);
    const newUserMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    console.log("💬 Sending message:", currentMessage.slice(0, 50) + "...");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          userProfile,
          documentStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: data.response,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, aiResponse]);
        console.log("✅ AI response received");
      } else {
        throw new Error(data.error || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error("❌ Error sending message:", err);
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: "Xin lỗi, có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const [isClearing, setIsClearing] = useState(false);

  const clearChatHistory = async () => {
    if (isClearing) {
      console.log("⏳ Clear operation already in progress");
      return;
    }

    const confirm = window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử chat không?");
    if (!confirm) return;

    setIsClearing(true);
    console.log("🗑️ Clearing chat history...");

    try {
      const response = await fetch("/api/chat-history", {
        method: "DELETE",
      });

      if (response.ok) {
        const welcomeMessage = createWelcomeMessage(userProfile, documentStatus);
        setMessages([
          {
            ...welcomeMessage,
            id: Date.now(),
            text: `Xin chào ${userProfile?.fullname || "bạn"}! Tôi là Scholar AI - trợ lý tư vấn du học Mỹ thông minh.

Lịch sử chat đã được xóa. Tôi có thể giúp bạn gì hôm nay?`,
          },
        ]);
        console.log("✅ Chat history cleared successfully");
      } else {
        throw new Error("Failed to clear chat history");
      }
    } catch (error) {
      console.error("❌ Error clearing chat history:", error);
      alert("Có lỗi xảy ra khi xóa lịch sử chat. Vui lòng thử lại.");
    } finally {
      setIsClearing(false);
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
            <div className="flex items-center gap-4">
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
              <button
                onClick={clearChatHistory}
                disabled={isClearing}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  isClearing ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"
                }`}
                title={isClearing ? "Đang xóa..." : "Xóa lịch sử chat"}>
                {isClearing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loadingHistory ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Đang tải lịch sử chat...</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-800 border border-gray-200"
                  }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-200" : "text-gray-500"}`}>{message.timestamp}</p>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border border-gray-200 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <p className="text-sm">AI đang suy nghĩ...</p>
                </div>
              </div>
            </div>
          )}
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
              onClick={handleFileUpload}
              disabled={isLoading || isUploading}
              className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              title="Tải lên tài liệu để phân tích">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              {isUploading ? "Đang tải..." : "Tải file"}
            </button>
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

      {/* File Upload Component - Modal */}
      {showFileUpload && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tải lên tài liệu để phân tích</h3>
            <FileUpload onFileAnalyzed={handleFileAnalyzed} onError={handleFileUploadError} isUploading={isUploading} setIsUploading={setIsUploading} />
            <div className="mt-4">
              <button
                onClick={() => setShowFileUpload(false)}
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Analysis Result - Modal */}
      {analysisResult && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Kết quả phân tích tài liệu</h3>
            <DocumentAnalysisDisplay
              result={analysisResult}
              onConfirm={handleConfirmDocument}
              onCancel={handleCancelDocument}
              isProcessing={isProcessingConfirmation}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Agent;
