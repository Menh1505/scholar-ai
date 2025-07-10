# Scholar AI - Hệ thống Tư vấn Du học Thông minh

Đây là một hệ thống chatbot AI thông minh được xây dựng với Next.js, giúp người dùng:

- **Tìm hiểu thông tin trường đại học tại Mỹ**
- **Lập kế hoạch du học cá nhân hóa**
- **Hiểu rõ quy trình pháp lý, chi phí, học bổng, visa**
- **Kiểm tra hồ sơ tài liệu cần chuẩn bị**

## 🚀 Tính năng chính

### 1. AI Assistant (Chatbot) - Context-Aware ✨

- **🧠 Personalized Context**: AI biết thông tin cá nhân và trạng thái hồ sơ
- **🚫 No Redundant Questions**: Không hỏi lại thông tin đã có
- **🎯 Smart Recommendations**: Tư vấn dựa trên tình hình cụ thể
- **📊 Progress-based UI**: Giao diện thay đổi theo tiến độ user
- **🔗 Contextual Conversations**: Cuộc trò chuyện có tính liên tục

### 2. Profile Management

- Quản lý thông tin cá nhân có thể chỉnh sửa
- Theo dõi Scholar Points với UI đẹp mắt
- Lộ trình du học cá nhân hóa
- Cập nhật trạng thái hồ sơ real-time

### 3. Legal Document Checker

- Checklist đầy đủ hồ sơ visa F-1 (19 items)
- Progress tracking interactive với animations
- Hướng dẫn chi tiết cho từng loại giấy tờ
- Quick actions và tips hữu ích

## ✨ Context Personalization (NEW!)

### Tính năng Context-Aware AI:

Scholar AI giờ đây có khả năng **nhớ và hiểu thông tin cá nhân** của user:

#### 🧠 Smart Context Injection:

```javascript
// AI nhận context động từ user:
{
  userProfile: {
    fullname: "Nguyễn Đình Khoa",
    nationality: "Vietnam",
    scholarPoints: 1231,
    // ... other info
  },
  documentStatus: [
    { name: "IELTS", completed: true },
    { name: "Passport", completed: true },
    { name: "SOP", completed: false },
    // ... checklist status
  ]
}
```

#### 🎯 Personalized Experience:

- **No Redundant Questions**: AI không hỏi lại IELTS nếu user đã có
- **Progress-based Suggestions**: Câu hỏi gợi ý thay đổi theo tiến độ
- **Contextual Greetings**: "Xin chào Khoa! Tôi thấy bạn đã hoàn thành 3/7 tài liệu..."
- **Smart Prioritization**: AI ưu tiên tài liệu cần làm tiếp theo

#### 📊 Dynamic UI:

- Sidebar hiển thị progress bar real-time
- Suggested questions thay đổi theo user journey
- Next steps được cá nhân hóa

### Demo Test Cases:

```bash
# Test 1: Hỏi về tài liệu đã có
User: "Tôi cần chuẩn bị IELTS như thế nào?"
AI: "Tôi thấy bạn đã có chứng chỉ tiếng Anh rồi! Hãy kiểm tra điểm số..."

# Test 2: Hỏi về bước tiếp theo
User: "Tôi nên làm gì tiếp theo?"
AI: "Dựa trên hồ sơ hiện tại, bạn cần ưu tiên SOP và LOR..."
```

**👆 Điều này giải quyết vấn đề bạn nêu ra: AI không còn hỏi lại thông tin đã có!**

## 🛠️ Setup Dự án

### Yêu cầu hệ thống

- Node.js 18+
- npm hoặc bun
- OpenAI API key

### Cài đặt

1. **Clone và cài đặt dependencies:**

```bash
# Clone repository
git clone <repository-url>
cd scholar-ai/ui

# Install dependencies
npm install
# or
bun install
```

2. **Setup Environment Variables:**

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local and add your OpenAI API key
# Get API key from: https://platform.openai.com/api-keys
```

3. **Run development server:**

```bash
npm run dev
# or
bun dev
```

4. **Mở trình duyệt:**

```
http://localhost:3000
```

## 📁 Cấu trúc Dự án

```
src/
├── app/
│   ├── api/
│   │   └── chat/              # OpenAI API endpoint
│   ├── (dashboard)/
│   │   ├── agent/             # AI Chatbot page
│   │   ├── profile/           # Profile management
│   │   ├── legal/             # Document checker
│   │   └── ...
├── components/
│   ├── layout/                # Navigation, Sidebar
│   └── ui/                    # Reusable components
└── lib/                       # Utilities
```

## 🎯 Sử dụng

### AI Assistant

1. Vào trang **Agent** từ navigation
2. Nhập câu hỏi hoặc chọn từ danh sách gợi ý
3. Nhận tư vấn chi tiết từ AI

**Ví dụ câu hỏi:**

- "Hướng dẫn xin visa F-1 du học Mỹ"
- "Trường đại học nào phù hợp với ngành IT?"
- "Chi phí du học Mỹ khoảng bao nhiêu?"

### Profile Management

1. Vào trang **Profile**
2. Click **"Chỉnh sửa"** để cập nhật thông tin
3. Theo dõi Scholar Points và lộ trình du học

### Legal Document Checker

1. Vào trang **Legal**
2. Check off các tài liệu đã hoàn thành
3. Theo dõi progress bar
4. Sử dụng các action buttons để được hỗ trợ thêm

## 🔧 Cấu hình

### OpenAI API

Dự án sử dụng GPT-3.5-turbo với system prompt được tối ưu cho tư vấn du học:

```javascript
// Các chức năng AI:
- Tư vấn thông tin trường đại học Mỹ
- Lập kế hoạch du học cá nhân hóa
- Hướng dẫn quy trình pháp lý visa F-1
- Kiểm tra checklist tài liệu
- Tư vấn chi phí và học bổng
```

### Environment Variables

```bash
OPENAI_API_KEY=your_api_key_here
MONGO_URI=your_mongodb_connection_string
```

## 🚧 Roadmap

### Phase 1 (MVP - Hiện tại)

- ✅ AI Chatbot với OpenAI
- ✅ Profile management cơ bản
- ✅ Legal document checklist
- ✅ Navigation và UI

### Phase 2 (Coming Soon)

- [ ] RAG system với database trường đại học
- [ ] Email notifications
- [ ] PDF export cho checklist
- [ ] Advanced profile analytics
- [ ] Integration với university APIs

### Phase 3 (Future)

- [ ] Mobile app
- [ ] Multi-language support
- [ ] AI-powered university matching
- [ ] Scholarship finder
- [ ] Community features

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **AI:** OpenAI GPT-3.5-turbo
- **Database:** MongoDB (planned)
- **Icons:** Lucide React
- **Package Manager:** Bun/npm

## 📝 Notes

- Dự án đang ở giai đoạn MVP
- Cần OpenAI API key để chatbot hoạt động
- UI đã được thiết kế responsive
- Tất cả text interface đã được Việt hóa

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License
