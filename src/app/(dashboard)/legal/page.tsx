"use client";
import React, { useState } from "react";

interface DocumentItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  completed: boolean;
  note?: string;
}

interface DocumentSection {
  title: string;
  description: string;
  items: DocumentItem[];
}

function LegalPage() {
  const [documentSections, setDocumentSections] = useState<DocumentSection[]>([
    {
      title: "Hồ sơ học tập & năng lực",
      description: "Các tài liệu chứng minh năng lực học tập và trình độ của bạn",
      items: [
        {
          id: "transcript",
          name: "Bằng cấp, bảng điểm",
          description: "Cấp 3, đại học (dịch thuật công chứng)",
          required: true,
          completed: false,
        },
        {
          id: "english-cert",
          name: "Chứng chỉ tiếng Anh",
          description: "TOEFL iBT ≥ 71–100, IELTS ≥ 6.0–7.5, hoặc Duolingo nếu chấp nhận",
          required: true,
          completed: false,
        },
        {
          id: "sat-act",
          name: "SAT / ACT",
          description: "Với bậc Cử nhân (tuỳ trường yêu cầu)",
          required: false,
          completed: false,
        },
        {
          id: "gre-gmat",
          name: "GRE / GMAT",
          description: "Với bậc Thạc sĩ/MBA (tuỳ ngành)",
          required: false,
          completed: false,
        },
        {
          id: "portfolio",
          name: "Portfolio",
          description: "Ngành Thiết kế, Kiến trúc, Nghệ thuật",
          required: false,
          completed: false,
        },
        {
          id: "sop",
          name: "SOP (Statement of Purpose)",
          description: "Tự luận mục tiêu học tập",
          required: true,
          completed: false,
        },
        {
          id: "lor",
          name: "LOR (Letter of Recommendation)",
          description: "1–3 thư giới thiệu từ giáo viên/cấp trên",
          required: true,
          completed: false,
        },
        {
          id: "cv-resume",
          name: "CV/Resume",
          description: "Bậc sau đại học",
          required: false,
          completed: false,
        },
      ],
    },
    {
      title: "Giấy tờ nhân thân & nhập cảnh",
      description: "Các giấy tờ cần thiết cho việc xin visa và nhập cảnh Mỹ",
      items: [
        {
          id: "passport",
          name: "Hộ chiếu",
          description: "Còn hạn ≥ 6 tháng sau ngày dự kiến nhập cảnh",
          required: true,
          completed: false,
        },
        {
          id: "visa-photo",
          name: "Ảnh thẻ chuẩn visa Mỹ",
          description: "5x5 cm, nền trắng, chụp trong vòng 6 tháng",
          required: true,
          completed: false,
        },
        {
          id: "admission-letter",
          name: "Thư mời nhập học",
          description: "Offer letter / Admission letter từ trường",
          required: true,
          completed: false,
        },
        {
          id: "i20-form",
          name: "Form I-20",
          description: "Trường cấp sau khi được nhận và xác minh tài chính",
          required: true,
          completed: false,
        },
        {
          id: "ds160",
          name: "DS-160 Confirmation",
          description: "Mẫu xin visa điện tử, điền online",
          required: true,
          completed: false,
        },
        {
          id: "sevis-fee",
          name: "Biên lai nộp phí SEVIS",
          description: "Lệ phí hệ thống sinh viên quốc tế ($350 F-1)",
          required: true,
          completed: false,
        },
        {
          id: "interview-confirmation",
          name: "Xác nhận lịch hẹn phỏng vấn",
          description: "Từ trang web của Đại sứ quán/Lãnh sự quán Mỹ",
          required: true,
          completed: false,
        },
      ],
    },
    {
      title: "Chứng minh tài chính",
      description: "Các tài liệu chứng minh khả năng chi trả học phí và sinh hoạt",
      items: [
        {
          id: "bank-statement",
          name: "Sổ tiết kiệm ngân hàng",
          description: "Số dư đủ chi trả ít nhất 1 năm học phí + sinh hoạt (~$45k–80k)",
          required: true,
          completed: false,
        },
        {
          id: "bank-balance",
          name: "Giấy xác nhận số dư",
          description: "Từ ngân hàng, có dấu xác nhận",
          required: true,
          completed: false,
        },
        {
          id: "income-proof",
          name: "Giấy tờ chứng minh thu nhập",
          description: "Bảng lương, hợp đồng lao động của người bảo trợ",
          required: true,
          completed: false,
        },
        {
          id: "sponsorship-letter",
          name: "Giấy xác nhận bảo lãnh",
          description: "Nếu người thân tài trợ thì cần giấy cam kết hỗ trợ tài chính",
          required: false,
          completed: false,
        },
      ],
    },
  ]);

  const toggleDocumentComplete = (sectionIndex: number, itemId: string) => {
    setDocumentSections((prev) =>
      prev.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              items: section.items.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)),
            }
          : section
      )
    );
  };

  const getSectionProgress = (section: DocumentSection) => {
    const totalRequired = section.items.filter((item) => item.required).length;
    const completedRequired = section.items.filter((item) => item.required && item.completed).length;
    return { completed: completedRequired, total: totalRequired };
  };

  const getOverallProgress = () => {
    const allRequired = documentSections.flatMap((section) => section.items.filter((item) => item.required));
    const completedRequired = allRequired.filter((item) => item.completed);
    return { completed: completedRequired.length, total: allRequired.length };
  };

  const overallProgress = getOverallProgress();

  return (
    <div className="p-6 w-full mx-auto">
      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checklist Hồ Sơ Du Học</h1>
            <p className="text-gray-600 mt-1">Kiểm tra và chuẩn bị đầy đủ tài liệu cho visa F-1</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {overallProgress.completed}/{overallProgress.total}
            </div>
            <div className="text-sm text-gray-600">Tài liệu bắt buộc</div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(overallProgress.completed / overallProgress.total) * 100}%` }}></div>
        </div>
        <div className="text-sm text-gray-600 mt-1">Tiến độ hoàn thành: {Math.round((overallProgress.completed / overallProgress.total) * 100)}%</div>
      </div>

      <div className="space-y-6">
        {documentSections.map((section, sectionIndex) => {
          const progress = getSectionProgress(section);

          return (
            <div key={sectionIndex} className="border-2 border-gray-200 rounded-2xl bg-white">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                    <p className="text-gray-600 text-sm mt-1">{section.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {progress.completed}/{progress.total}
                    </div>
                    <div className="text-xs text-gray-500">hoàn thành</div>
                  </div>
                </div>

                {/* Section Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <button
                        onClick={() => toggleDocumentComplete(sectionIndex, item.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-green-400"
                        }`}>
                        {item.completed && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-medium ${item.completed ? "text-gray-500 line-through" : "text-gray-900"}`}>{item.name}</h3>
                          {item.required && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Bắt buộc</span>
                          )}
                        </div>
                        <p className={`text-sm ${item.completed ? "text-gray-400" : "text-gray-600"}`}>{item.description}</p>
                        {item.note && <p className="text-xs text-blue-600 mt-1">💡 {item.note}</p>}
                      </div>

                      <div className="flex-shrink-0">
                        {item.completed ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">✓ Hoàn thành</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">Chưa hoàn thành</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">💬 Hỏi AI về tài liệu này</button>
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">📄 Tải checklist PDF</button>
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">📱 Nhắc nhở qua email</button>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Mẹo hữu ích</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Bắt đầu chuẩn bị hồ sơ sớm ít nhất 6-12 tháng trước khi dự kiến nhập học</li>
          <li>• Dịch thuật công chứng tất cả tài liệu tiếng Việt sang tiếng Anh</li>
          <li>• Giữ bản gốc và bản sao của tất cả tài liệu quan trọng</li>
          <li>• Kiểm tra yêu cầu cụ thể của từng trường đại học</li>
          <li>• Tham khảo AI Assistant để được hướng dẫn chi tiết cho từng loại tài liệu</li>
        </ul>
      </div>
    </div>
  );
}

export default LegalPage;
