# Agent Module Documentation

## Overview

The Agent module implements an AI-powered chatbot that provides study abroad consultation services for students interested in studying in the United States. The module is built using NestJS and integrates with LangChain for AI processing.

## Features

### 🤖 AI-Powered Consultation

- Contextual conversation management
- Phase-based conversation flow
- Intelligent school and major recommendations
- Document checklist generation

### 📊 Session Management

- Persistent user sessions
- Conversation history tracking
- Progress monitoring
- Analytics and statistics

### 🔧 RESTful API

- Message handling endpoints
- Session management
- History retrieval
- Health checks

## Architecture

### Core Components

1. **AgentController** - HTTP endpoints for client interaction
2. **AgentService** - Business logic and AI processing
3. **AgentSchema** - MongoDB data models
4. **AgentTools** - LangChain tools for external API calls

### Conversation Phases

The agent follows a structured conversation flow:

1. **INTRO** - Initial greeting and capability introduction
2. **COLLECT_INFO** - Gathering academic and personal information
3. **SELECT_SCHOOL** - Providing school/major recommendations
4. **LEGAL_CHECKLIST** - Generating required documents list
5. **PROGRESS_TRACKING** - Monitoring document preparation progress

## API Endpoints

### POST /agent/message

Handle user messages and provide AI responses.

**Request Body:**

```json
{
  "userId": "string",
  "message": "string"
}
```

**Response:**

```json
{
  "response": "string",
  "phase": "intro|collect_info|select_school|legal_checklist|progress_tracking",
  "sessionId": "string",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### GET /agent/session/:userId

Retrieve session information for a user.

**Response:**

```json
{
  "sessionId": "string",
  "userId": "string",
  "phase": "string",
  "selectedSchool": "string",
  "selectedMajor": "string",
  "legalChecklist": [],
  "userInfo": {},
  "isCompleted": false,
  "progressPercentage": 0,
  "analytics": {},
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

### GET /agent/session/:userId/history

Retrieve message history for a user.

**Query Parameters:**

- `limit` (optional): Number of messages to return (default: 50)
- `offset` (optional): Number of messages to skip (default: 0)

**Response:**

```json
{
  "messages": [],
  "total": 0,
  "limit": 50,
  "offset": 0,
  "hasMore": false
}
```

### DELETE /agent/session/:userId

Reset user session.

**Response:**

```json
{
  "message": "Session đã được reset thành công",
  "userId": "string",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### POST /agent/session/:userId/complete

Mark session as completed.

**Response:**

```json
{
  "message": "Session đã hoàn thành thành công",
  "userId": "string",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### GET /agent/health

Health check endpoint.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00Z",
  "service": "agent",
  "version": "1.0.0"
}
```

## Data Models

### AgentSession Schema

```typescript
{
  userId: string;              // Unique user identifier
  phase: Phase;               // Current conversation phase
  selectedSchool?: string;    // User's selected school
  selectedMajor?: string;     // User's selected major
  userInfo: UserInfo;        // Academic and personal information
  legalChecklist: LegalDocument[]; // Required documents
  messages: ChatMessage[];    // Conversation history
  isCompleted: boolean;      // Session completion status
  preferences: object;       // User preferences
  analytics: object;         // Session analytics
}
```

### UserInfo Interface

```typescript
{
  gpa?: number;
  toeflScore?: number;
  ieltsScore?: number;
  satScore?: number;
  desiredMajor?: string;
  budget?: number;
  preferredRegion?: string;
  academicBackground?: string;
  workExperience?: string;
}
```

### LegalDocument Interface

```typescript
{
  name: string;
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  createdAt: Date;
  deadline?: Date;
  notes?: string;
}
```

## LangChain Integration

### Available Tools

1. **getUserInfo** - Retrieve user profile information
2. **createLegalDocument** - Create legal document entries
3. **updateLegalStatus** - Update document completion status
4. **getLegalDocuments** - Retrieve all legal documents
5. **createStudyPlan** - Generate study plans
6. **searchUniversities** - Search for suitable universities

### Tool Usage Examples

```typescript
// Creating a legal document
await createLegalDocument('I-20');

// Updating document status
await updateLegalStatus('doc-123|completed');

// Searching universities
await searchUniversities('Computer Science, $50000 budget, California');
```

## Environment Variables

```bash
# Required
OPENAI_API_KEY=your-openai-api-key
AGENT_SYSTEM_TOKEN=your-system-token

# Optional
API_BASE_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/scholar-ai
```

## Error Handling

The module implements comprehensive error handling:

- **Validation Errors**: Input validation with clear error messages
- **Service Errors**: Graceful handling of external API failures
- **System Errors**: Proper error logging and user-friendly responses

## Testing

### Unit Tests

- Service logic testing
- Controller endpoint testing
- Schema validation testing

### Integration Tests

- End-to-end conversation flow
- Database operations
- External API integration

### Performance Tests

- Concurrent request handling
- Large message history management
- Memory usage optimization

## Usage Examples

### Basic Conversation Flow

```typescript
// 1. Initial greeting
POST /agent/message
{
  "userId": "user123",
  "message": "Xin chào, tôi muốn tư vấn du học Mỹ"
}

// 2. Provide academic info
POST /agent/message
{
  "userId": "user123",
  "message": "Tôi có GPA 3.8, TOEFL 105, muốn học Computer Science"
}

// 3. Select school
POST /agent/message
{
  "userId": "user123",
  "message": "Tôi chọn MIT"
}

// 4. Get legal checklist
POST /agent/message
{
  "userId": "user123",
  "message": "Tôi cần danh sách giấy tờ"
}

// 5. Update progress
POST /agent/message
{
  "userId": "user123",
  "message": "Tôi đã hoàn thành I-20"
}
```

### Session Management

```typescript
// Get session info
GET / agent / session / user123;

// Reset session
DELETE / agent / session / user123;

// Complete session
POST / agent / session / user123 / complete;
```

## Best Practices

1. **Session Management**: Always use unique userIds to maintain session state
2. **Error Handling**: Implement proper error handling on the client side
3. **Rate Limiting**: Consider implementing rate limiting for production use
4. **Monitoring**: Set up monitoring for API usage and performance
5. **Security**: Validate all inputs and sanitize user data

## Deployment

1. Ensure all environment variables are set
2. MongoDB connection is configured
3. External API endpoints are accessible
4. OpenAI API key is valid and has sufficient credits

## Future Enhancements

- Multi-language support
- Voice message handling
- Integration with more university databases
- Advanced analytics dashboard
- Mobile app support
