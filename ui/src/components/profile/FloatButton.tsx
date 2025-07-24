import React from "react";
import { Check, X } from "lucide-react";

interface FloatButtonProps {
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function FloatButton({ onSave, onCancel, isLoading = false }: FloatButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Save Button */}
      <button
        onClick={onSave}
        disabled={isLoading}
        className={`
          w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 
          text-white shadow-lg hover:shadow-xl transition-all duration-200
          flex items-center justify-center group
          ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
        `}
        title="Lưu thay đổi">
        {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-6 h-6" />}
      </button>

      {/* Cancel Button */}
      <button
        onClick={onCancel}
        disabled={isLoading}
        className={`
          w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 
          text-white shadow-lg hover:shadow-xl transition-all duration-200
          flex items-center justify-center group
          ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
        `}
        title="Hủy thay đổi">
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}
