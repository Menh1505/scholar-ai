import React from "react";

export const WelcomeMessage: React.FC = () => {
  return (
    <div className="text-center py-2">
      <div className="max-w-lg mx-auto">
        <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Xin chào, tôi là <strong>Scholar AI!</strong>
        </h3>
        <p className="text-gray-700 mb-4">
          Mình được thiết kế để <strong>hướng dẫn bạn từng bước trong hành trình du học</strong>, kể cả khi bạn chưa biết bắt đầu từ đâu. Vai trò của mình là
          đồng hành cùng bạn từ lúc lên ý tưởng đến khi hoàn tất hồ sơ và chuẩn bị sang Mỹ.
        </p>

        <h3 className="font-semibold text-gray-800 mt-4 mb-2">🧠 Mình có thể giúp bạn:</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>Tư vấn chọn ngành học phù hợp với năng lực và sở thích.</li>
          <li>Gợi ý trường học và bang tại Mỹ phù hợp với mục tiêu và ngân sách.</li>
          <li>Phân tích chi phí học tập và sinh hoạt.</li>
          <li>Xây dựng và quản lý danh sách giấy tờ cần chuẩn bị.</li>
          <li>Theo dõi tiến trình và hướng dẫn cách chuẩn bị từng loại giấy tờ.</li>
        </ul>

        <h3 className="font-semibold text-gray-800 mb-2">💬 Cách trò chuyện với mình:</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>“Mình muốn học ngành kỹ thuật ở Mỹ thì nên chọn trường nào?”</li>
          <li>“Chi phí học cử nhân tại California khoảng bao nhiêu?”</li>
          <li>“Mình chưa có chứng chỉ tiếng Anh thì có học được không?”</li>
          <li>“Mình đã có I-20 rồi, cần chuẩn bị giấy tờ gì tiếp theo?”</li>
        </ul>

        <p className="text-gray-700 italic">
          👉 Dù bạn chưa biết gì, mình vẫn sẽ hỏi và hỗ trợ từng bước. Hãy bắt đầu bằng cách nói:{" "}
          <strong>“Mình muốn đi du học nhưng chưa biết bắt đầu từ đâu”</strong> hoặc
          <strong>“Mình muốn học ngành [tên ngành], hãy giúp mình chọn trường phù hợp!”</strong>
        </p>
      </div>
    </div>
  );
};
