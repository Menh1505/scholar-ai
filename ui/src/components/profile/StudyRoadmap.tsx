import React from "react";
import Fieldset from "@/components/Fieldset";
import { User } from "@/types/user";

interface StudyRoadmapProps {
  user: User;
}

export default function StudyRoadmap({ user }: StudyRoadmapProps) {
  const roadmapSteps = [
    {
      id: 1,
      title: "Hoàn thành thông tin cá nhân",
      description: "Cập nhật thông tin cơ bản và liên lạc",
      completed: true,
      status: "Hoàn thành",
      statusColor: "text-green-600 bg-green-50",
    },
    {
      id: 2,
      title: "Cập nhật thông tin hộ chiếu",
      description: "Nhập số hộ chiếu và ngày hết hạn",
      completed: Boolean(user.passportCode),
      status: user.passportCode ? "Hoàn thành" : "Đang thực hiện",
      statusColor: user.passportCode ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50",
    },
    {
      id: 3,
      title: "Chuẩn bị hồ sơ pháp lý",
      description: "Hoàn thành checklist tài liệu visa F-1",
      completed: false,
      status: "Chờ thực hiện",
      statusColor: "text-gray-600 bg-gray-50",
    },
    {
      id: 4,
      title: "Nộp đơn xin học",
      description: "Apply to universities",
      completed: false,
      status: "Chờ thực hiện",
      statusColor: "text-gray-600 bg-gray-50",
    },
    {
      id: 5,
      title: "Xin visa",
      description: "Phỏng vấn và nhận visa F-1",
      completed: false,
      status: "Chờ thực hiện",
      statusColor: "text-gray-600 bg-gray-50",
    },
  ];

  return (
    <div className="mt-6">
      <Fieldset title="Lộ trình du học của bạn" className="min-h-64">
        <div className="space-y-4">
          {roadmapSteps.map((step) => (
            <div key={step.id} className={`flex items-center space-x-3 ${!step.completed && step.id > 2 ? "opacity-60" : ""}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  step.completed ? "bg-green-500" : step.id === 2 ? "bg-blue-500" : "bg-gray-400"
                }`}>
                {step.completed ? "✓" : step.id}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${step.statusColor}`}>{step.status}</span>
            </div>
          ))}
        </div>
      </Fieldset>
    </div>
  );
}
