import React from "react";

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "Đang tải..." }: LoadingSpinnerProps) {
  return (
    <div className="bg-[#DBD9FB] p-4 max-w-6xl mx-auto">
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}
