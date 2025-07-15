import React from "react";

interface ProfileInputProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "date";
  placeholder?: string;
}

export default function ProfileInput({ label, value, isEditing, onChange, type = "text", placeholder }: ProfileInputProps) {
  return (
    <div className="flex items-center space-x-3">
      <label className="text-sm font-medium text-green-600 min-w-[120px]">{label}:</label>
      {isEditing ? (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-gray-900 flex-1">{value || placeholder || "Chưa cập nhật"}</p>
      )}
    </div>
  );
}
