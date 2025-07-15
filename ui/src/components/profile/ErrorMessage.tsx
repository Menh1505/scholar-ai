import React from "react";

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({ message = "Không thể tải thông tin người dùng" }: ErrorMessageProps) {
  return (
    <div className="bg-[#DBD9FB] p-4 max-w-6xl mx-auto">
      <div className="text-center text-gray-600">
        <p>{message}</p>
      </div>
    </div>
  );
}
