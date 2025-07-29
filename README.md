# 🎓 Scholar AI - Smart Study Abroad with AI

Your all-in-one AI assistant for the entire study abroad journey

## ✨ Key Features

### 🤖 AI Chat Agent with Markdown Support
- **Smart Conversation**: Context-aware, personalized interactions
- **Markdown Formatting**: Full markdown support in messages
- **Custom Icons**: Auto replace `[✓]` → ✅, `[tip]` → 💡
- **Phase Management**: Agent tracks conversation phases

### 🎯 End-to-End Study Abroad Guidance
- **University Selection**: Recommendations based on profile and budget
- **Major Selection**: Based on interests and career goals
- **Document Checklist**: Internationally compliant document guidance
- **Timeline Manager**: Track your progress and deadlines

### 💰 Financial Planning Tools
- **Study Fee Calculator**: Tuition, insurance, materials
- **Living Cost Calculator**: Housing, food, transport
- **Multi-Currency Support**: CAD, USD, EUR
- **Real-Time Calculation**: Instant cost updates

### ✨ AI Assistant (Chatbot) – Context-Aware & Intelligent
- 🧠 **Personalized Context**: AI knows your profile and document status
- 🚫 **No Redundant Questions**: AI doesn't ask what it already knows
- 🎯 **Smart Suggestions**: Personalized based on your case
- 📊 **Progress-Based UI**: Interface adapts to your phase
- 🔗 **Conversational Flow**: Seamless and contextual

### 📋 Profile Management
- Editable personal info
- Beautiful UI to track Scholar Points
- Visualized study roadmap
- Real-time profile update capability

### 📑 Legal Document Checker
- Full checklist for F-1 visa (19 items)
- Animated progress tracking
- Step-by-step guidance for each document
- Quick actions + pro tips

## 🧠 Context Personalization (NEW!)

Scholar AI now remembers and understands your personal data for better assistance.

### 🧩 Smart Context Injection

```javascript
{
  userProfile: {
    fullname: "Nguyen Dinh Khoa",
    nationality: "Vietnam",
    scholarPoints: 1231,
    // ...
  },
  documentStatus: [
    { name: "IELTS", completed: true },
    { name: "Passport", completed: true },
    { name: "SOP", completed: false },
    // ...
  ]
}
```

### 🎯 Personalized Experience:
- No repeat questions (e.g. AI knows you already submitted IELTS)
- Smart suggestions depending on your status
- Greeting messages like: *"Hi Khoa! You've completed 3/7 documents. Let's work on the rest!"*
- Prioritized task guidance based on importance

### 📊 Dynamic UI:
- Sidebar shows real-time progress
- Suggested questions evolve with your journey
- Next steps always customized

### 🔍 Test Examples:

```bash
# Test 1
User: "How do I prepare for the IELTS?"
AI: "Looks like you already have your IELTS certificate! Let's review your score..."

# Test 2
User: "What should I do next?"
AI: "You should prioritize completing your SOP and LOR based on your current status."
```

## 🛠️ Project Setup

### System Requirements
- Node.js 18+
- npm or bun
- OpenAI API key

### Installation

```bash
# Clone the repo
git clone <repository-url>
cd scholar-ai/ui

# Install dependencies
npm install
# or
bun install
```

### Setup Environment Variables

```bash
cp .env.local.example .env.local
# Then add your OpenAI key manually
```

### Start Development Server

```bash
npm run dev
# or
bun dev
```

### Access Locally
```
http://localhost:3000
```

## 📁 Project Structure

```bash
src/
├── app/
│   ├── api/                # OpenAI chat endpoint
│   ├── (dashboard)/
│   │   ├── agent/          # Chatbot page
│   │   ├── profile/        # User info
│   │   ├── legal/          # Document section
├── components/
│   ├── layout/             # Navigation & Sidebar
│   └── ui/                 # Reusable UI parts
└── lib/                    # Utilities
```

## 🎯 Usage

### AI Assistant
1. Go to Agent page
2. Ask a question or pick a suggestion
3. Receive clear and helpful responses

**Example prompts:**
- "How to apply for an F-1 visa?"
- "Which US university suits IT majors?"
- "What's the estimated cost of studying abroad?"

### Profile Management
1. Visit Profile page
2. Click Edit to update your details
3. Track points and study plan visually

### Legal Document Checker
1. Go to Legal page
2. Tick completed items
3. Monitor your progress
4. Use quick tips and helper buttons

## 🔧 Config & Environments

### OpenAI System Prompt
```javascript
- Suggest suitable universities
- Generate personalized study plans
- Guide on F-1 visa process
- Validate legal documents
- Provide budget and scholarship tips
```

### Environment Variables
```bash
OPENAI_API_KEY=your_key_here
MONGO_URI=your_mongodb_connection_string
```

## 🚧 Roadmap

### Phase 1 (MVP - Current)
- ✅ AI Chatbot with OpenAI
- ✅ Profile manager
- ✅ Legal document checklist
- ✅ Basic navigation and UI

### Phase 2 (Coming Soon)
- [ ] RAG search system for universities
- [ ] Email reminders
- [ ] PDF export
- [ ] In-depth analytics
- [ ] Connect to university APIs

### Phase 3 (Future Vision)
- [ ] Mobile application
- [ ] Multi-language interface
- [ ] AI university matching
- [ ] Smart scholarship finder
- [ ] Community features

## 💻 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-3.5-turbo
- **Database**: MongoDB (planned)
- **Icons**: Lucide React
- **Package Manager**: Bun / npm

## 📝 Notes

- Currently in MVP stage
- Requires OpenAI key to work
- Fully responsive UI
- All UI content available in Vietnamese

## 🤝 Contribution Guide

1. Fork this repo
2. Create a new branch
3. Make changes and commit
4. Push and submit PR

## 📄 License

MIT License