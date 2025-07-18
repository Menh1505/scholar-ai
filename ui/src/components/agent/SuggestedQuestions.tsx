import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AgentSession } from "@/types/agent";

const SUGGESTED_QUESTIONS = [
  "Tôi muốn du học tại Nhật Bản, bạn có thể hướng dẫn tôi không?",
  "Các trường đại học tốt nhất ở Canada là gì?",
  "Tôi cần chuẩn bị những gì để xin visa du học?",
  "Chi phí du học tại Úc khoảng bao nhiêu?",
  "Làm thế nào để xin học bổng du học?",
  "Tôi nên chọn ngành học nào phù hợp?",
  "Quy trình xin học tại Mỹ như thế nào?",
  "Tôi cần điểm IELTS/TOEFL bao nhiêu?",
];

interface SuggestedQuestionsProps {
  onQuestionSelect: (question: string) => void;
  currentSession: AgentSession | null;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onQuestionSelect, currentSession }) => {
  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Questions</h3>

      <div className="space-y-2">
        {SUGGESTED_QUESTIONS.map((question, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow border-gray-200" onClick={() => onQuestionSelect(question)}>
            <CardContent className="p-3">
              <p className="text-sm text-gray-700 leading-relaxed">{question}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Session Info */}
      {currentSession && (
        <div className="mt-6 p-3 bg-white rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Session Info</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div>Phase: {currentSession.phase.replace("_", " ")}</div>
            <div>Progress: {currentSession.progressPercentage}%</div>
            {currentSession.selectedSchool && <div>School: {currentSession.selectedSchool}</div>}
            {currentSession.selectedMajor && <div>Major: {currentSession.selectedMajor}</div>}
          </div>
        </div>
      )}
    </div>
  );
};
