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
    <div>
      <label className="block text-sm font-medium text-green-600 mb-1">{label}:</label>
      {isEditing ? (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-gray-900">{value || placeholder || "Chưa cập nhật"}</p>
      )}
    </div>
  );
}
