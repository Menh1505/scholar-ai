"use client";
import React, { useState, useRef } from "react";

interface FileUploadProps {
  onFileAnalyzed: (analysis: any) => void;
  onError: (error: string) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileAnalyzed, onError, isUploading, setIsUploading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SUPPORTED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "text/plain"];

  const handleFileSelect = (file: File) => {
    if (!SUPPORTED_TYPES.includes(file.type)) {
      onError("Chỉ hỗ trợ file PDF, DOCX, DOC, và TXT");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      onError("File quá lớn. Kích thước tối đa là 10MB");
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-document", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onFileAnalyzed({
          ...data,
          originalFile: file,
        });
      } else {
        onError(data.error || "Có lỗi xảy ra khi xử lý file");
      }
    } catch (error) {
      console.error("Upload error:", error);
      onError("Có lỗi xảy ra khi tải file lên");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}>
        <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept=".pdf,.docx,.doc,.txt" className="hidden" />

        {isUploading ? (
          <div className="space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Đang phân tích tài liệu...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-700 font-medium">Kéo thả file vào đây hoặc click để chọn</p>
              <p className="text-sm text-gray-500 mt-1">Hỗ trợ: PDF, DOCX, DOC, TXT (tối đa 10MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
