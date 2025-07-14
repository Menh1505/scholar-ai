"use client";
import React, { useState, useEffect } from "react";

interface DocumentItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  completed: boolean;
  completedAt?: Date;
  fileName?: string;
  note?: string;
}

interface DocumentSection {
  title: string;
  description: string;
  items: DocumentItem[];
}

export default function LegalPage() {
  const [documentSections, setDocumentSections] = useState<DocumentSection[]>([]);
  const [loading, setLoading] = useState(true);

  // Load legal documents from API
  useEffect(() => {
    const loadLegalDocuments = async () => {
      try {
        const response = await fetch("/api/legal-documents");
        if (response.ok) {
          const data = await response.json();
          const legalDocuments = data.legalDocuments || [];

          // Group documents by section
          const groupedDocuments = groupDocumentsBySection(legalDocuments);
          setDocumentSections(groupedDocuments);
        }
      } catch (error) {
        console.error("Error loading legal documents:", error);
        // Fallback to default structure
        setDocumentSections(getDefaultDocumentSections());
      } finally {
        setLoading(false);
      }
    };

    loadLegalDocuments();
  }, []);

  const groupDocumentsBySection = (documents: DocumentItem[]): DocumentSection[] => {
    const academicDocs = documents.filter((doc) => ["transcript", "english-cert"].includes(doc.id));

    const personalDocs = documents.filter((doc) => ["passport"].includes(doc.id));

    const applicationDocs = documents.filter((doc) => ["sop", "lor"].includes(doc.id));

    const financialDocs = documents.filter((doc) => ["bank-statement"].includes(doc.id));

    const visaDocs = documents.filter((doc) => ["i20-form"].includes(doc.id));

    return [
      {
        title: "Hồ sơ học tập & năng lực",
        description: "Các tài liệu chứng minh năng lực học tập và trình độ của bạn",
        items: academicDocs.length > 0 ? academicDocs : getDefaultAcademicDocs(),
      },
      {
        title: "Hồ sơ cá nhân",
        description: "Các giấy tờ tùy thân và chứng minh nhân thân",
        items: personalDocs.length > 0 ? personalDocs : getDefaultPersonalDocs(),
      },
      {
        title: "Hồ sơ đăng ký",
        description: "Các tài liệu cần thiết cho đơn đăng ký vào trường",
        items: applicationDocs.length > 0 ? applicationDocs : getDefaultApplicationDocs(),
      },
      {
        title: "Hồ sơ tài chính",
        description: "Các tài liệu chứng minh khả năng tài chính",
        items: financialDocs.length > 0 ? financialDocs : getDefaultFinancialDocs(),
      },
      {
        title: "Hồ sơ Visa",
        description: "Các tài liệu và thủ tục xin visa du học",
        items: visaDocs.length > 0 ? visaDocs : getDefaultVisaDocs(),
      },
    ];
  };

  const getDefaultAcademicDocs = (): DocumentItem[] => [
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
      description: "TOEFL iBT ≥ 71–100, IELTS ≥ 6.0–7.5",
      required: true,
      completed: false,
    },
  ];

  const getDefaultPersonalDocs = (): DocumentItem[] => [
    {
      id: "passport",
      name: "Hộ chiếu",
      description: "Còn hạn ≥ 6 tháng sau ngày dự kiến nhập cảnh",
      required: true,
      completed: false,
    },
  ];

  const getDefaultApplicationDocs = (): DocumentItem[] => [
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
  ];

  const getDefaultFinancialDocs = (): DocumentItem[] => [
    {
      id: "bank-statement",
      name: "Sổ tiết kiệm ngân hàng",
      description: "Số dư đủ chi trả ít nhất 1 năm học phí + sinh hoạt",
      required: true,
      completed: false,
    },
  ];

  const getDefaultVisaDocs = (): DocumentItem[] => [
    {
      id: "i20-form",
      name: "Form I-20",
      description: "Trường cấp sau khi được nhận và xác minh tài chính",
      required: true,
      completed: false,
    },
  ];

  const getDefaultDocumentSections = (): DocumentSection[] => [
    {
      title: "Hồ sơ học tập & năng lực",
      description: "Các tài liệu chứng minh năng lực học tập và trình độ của bạn",
      items: getDefaultAcademicDocs(),
    },
    {
      title: "Hồ sơ cá nhân",
      description: "Các giấy tờ tùy thân và chứng minh nhân thân",
      items: getDefaultPersonalDocs(),
    },
    {
      title: "Hồ sơ đăng ký",
      description: "Các tài liệu cần thiết cho đơn đăng ký vào trường",
      items: getDefaultApplicationDocs(),
    },
    {
      title: "Hồ sơ tài chính",
      description: "Các tài liệu chứng minh khả năng tài chính",
      items: getDefaultFinancialDocs(),
    },
    {
      title: "Hồ sơ Visa",
      description: "Các tài liệu và thủ tục xin visa du học",
      items: getDefaultVisaDocs(),
    },
  ];

  const getStatusIcon = (completed: boolean, required: boolean) => {
    if (completed) {
      return (
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    } else if (required) {
      return (
        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Legal Documents</h1>
        <p className="text-gray-600">Quản lý và theo dõi tiến độ chuẩn bị hồ sơ pháp lý cho du học Mỹ</p>
      </div>

      <div className="space-y-8">
        {documentSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{section.description}</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">{getStatusIcon(item.completed, item.required)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        {item.required && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Bắt buộc</span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>

                      {item.completed && item.fileName && (
                        <div className="mt-2 flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-sm text-green-600 font-medium">Đã tải lên: {item.fileName}</span>
                        </div>
                      )}

                      {item.completedAt && (
                        <div className="mt-1 text-xs text-gray-500">Hoàn thành: {new Date(item.completedAt).toLocaleDateString("vi-VN")}</div>
                      )}

                      {item.note && <div className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">{item.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Tổng quan tiến độ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {documentSections.reduce((acc, section) => acc + section.items.filter((item) => item.completed).length, 0)}
            </div>
            <div className="text-sm text-gray-600">Đã hoàn thành</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {documentSections.reduce((acc, section) => acc + section.items.filter((item) => item.required && !item.completed).length, 0)}
            </div>
            <div className="text-sm text-gray-600">Còn thiếu (bắt buộc)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{documentSections.reduce((acc, section) => acc + section.items.length, 0)}</div>
            <div className="text-sm text-gray-600">Tổng cộng</div>
          </div>
        </div>
      </div>
    </div>
  );
}
