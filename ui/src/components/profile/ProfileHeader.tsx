import React from "react";

interface ProfileHeaderProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
  loading?: boolean;
}

export default function ProfileHeader({ isEditing, onEdit, onSave, onCancel, onReset, loading = false }: ProfileHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h1>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={onSave}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50">
              Hủy
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <button onClick={onEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Chỉnh sửa
            </button>
            <button onClick={onReset} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Reset Demo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
