import React from "react";

interface ScholarPointsCardProps {
  points: number;
}

export default function ScholarPointsCard({ points }: ScholarPointsCardProps) {
  return (
    <div className="mt-4 rounded-2xl p-6 text-center border-2 border-black">
      <div className="text-6xl font-bold text-blue-600 mb-2">{points}</div>
      <div className="text-xl font-semibold text-gray-800">Scholar Point</div>
      <div className="text-sm text-gray-600 mt-2">Điểm tích lũy từ việc hoàn thành hồ sơ và các hoạt động</div>
    </div>
  );
}
