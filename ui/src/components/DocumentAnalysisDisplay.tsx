"use client";
import React, { useState } from "react";

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

interface DocumentAnalysisDisplayProps {
  result: DocumentAnalysisResult;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

const DocumentAnalysisDisplay: React.FC<DocumentAnalysisDisplayProps> = ({ result, onConfirm, onCancel, isProcessing }) => {
  const { analysis, fileName } = result;
  const [showDetails, setShowDetails] = useState(false);

  const getStatusIcon = () => {
    if (analysis.isValid) {
      return (
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    }
  };

  const getStatusColor = () => {
    if (analysis.isValid) {
      return "text-green-700 bg-green-50 border-green-200";
    } else {
      return "text-red-700 bg-red-50 border-red-200";
    }
  };

  const getConfidenceColor = () => {
    if (analysis.confidence >= 80) return "text-green-600";
    if (analysis.confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start space-x-3">
        {getStatusIcon()}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Kết quả phân tích: {fileName}</h3>
          <p className="text-sm text-gray-600">
            Loại tài liệu: <span className="font-medium">{analysis.documentType}</span>
          </p>
        </div>
      </div>

      {/* Status */}
      <div className={`p-3 rounded-lg border ${getStatusColor()}`}>
        <div className="flex items-center justify-between">
          <span className="font-medium">{analysis.isValid ? "✅ Tài liệu hợp lệ" : "❌ Tài liệu cần cải thiện"}</span>
          <span className={`text-sm font-medium ${getConfidenceColor()}`}>Độ tin cậy: {analysis.confidence}%</span>
        </div>
      </div>

      {/* Missing Requirements */}
      {analysis.missingRequirements.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">⚠️ Yêu cầu còn thiếu:</h4>
          <ul className="space-y-1">
            {analysis.missingRequirements.map((req, index) => (
              <li key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                • {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">💡 Gợi ý cải thiện:</h4>
          <ul className="space-y-1">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                • {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-3 border-t">
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50">
          Hủy
        </button>

        {analysis.isValid && (
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center">
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </>
            ) : (
              "✅ Xác nhận và thêm vào danh sách"
            )}
          </button>
        )}
      </div>

      {/* Details Toggle */}
      <button onClick={() => setShowDetails(!showDetails)} className="w-full text-left text-sm text-gray-600 hover:text-gray-800 transition-colors">
        {showDetails ? "▼ Ẩn chi tiết" : "▶ Xem chi tiết"}
      </button>

      {/* Details */}
      {showDetails && (
        <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2">
          <div>
            <strong>Kích thước file:</strong> {(result.originalFile.size / 1024).toFixed(1)} KB
          </div>
          <div>
            <strong>Loại file:</strong> {result.originalFile.type}
          </div>
          <div>
            <strong>Thời gian phân tích:</strong> {new Date().toLocaleString("vi-VN")}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentAnalysisDisplay;
