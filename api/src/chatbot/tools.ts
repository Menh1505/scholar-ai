import { DynamicTool } from 'langchain/tools';

const apiUrl = process.env.API_BASE_URL || 'http://localhost:3999';

// Tools for chatbot agent to interact with backend APIs
export const agentTools = [
  // User Management Tools
  new DynamicTool({
    name: 'CreateUser',
    description:
      'Tạo người dùng mới với các thông tin: fullname, email, phone, sex, dateOfBirth, nationality, religion, passportCode, passportExpiryDate, scholarPoints. Input phải là JSON string.',
    func: async (input: string) => {
      try {
        const body = JSON.parse(input);
        const res = await fetch(`${apiUrl}/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        const result = await res.json();
        return JSON.stringify(result);
      } catch (error) {
        return JSON.stringify({
          success: false,
          message: 'Failed to create user',
          error: error.message,
        });
      }
    },
  }),

  new DynamicTool({
    name: 'UpdateUser',
    description:
      'Cập nhật thông tin người dùng theo user ID. Input: JSON string với id và các field cần update',
    func: async (input: string) => {
      try {
        const { id, ...body } = JSON.parse(input);
        const res = await fetch(`${apiUrl}/user/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        const result = await res.json();
        return JSON.stringify(result);
      } catch (error: any) {
        return JSON.stringify({
          success: false,
          message: 'Failed to update user',
          error: error.message,
        });
      }
    },
  }),

  // Legal Document Management Tools
  new DynamicTool({
    name: 'CreateLegalDocument',
    description:
      'Tạo một giấy tờ pháp lý mới. Input: JSON string với title, userId, content, status (optional)',
    func: async (input: string) => {
      try {
        const body = JSON.parse(input);
        const res = await fetch(`${apiUrl}/legal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const result = await res.json();
        return JSON.stringify(result);
      } catch (error: any) {
        return JSON.stringify({
          success: false,
          message: 'Failed to create legal document',
          error: error.message,
        });
      }
    },
  }),

  new DynamicTool({
    name: 'UpdateLegalStatus',
    description:
      'Cập nhật trạng thái giấy tờ legal theo ID. Input: JSON string với id và status (pending/in_progress/completed/expired)',
    func: async (input: string) => {
      try {
        const { id, status } = JSON.parse(input);
        const res = await fetch(`${apiUrl}/legal/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        const result = await res.json();
        return JSON.stringify(result);
      } catch (error: any) {
        return JSON.stringify({
          success: false,
          message: 'Failed to update legal status',
          error: error.message,
        });
      }
    },
  }),

  new DynamicTool({
    name: 'FindLegalByUser',
    description: 'Lấy danh sách giấy tờ theo userId',
    func: async (userId: string) => {
      try {
        const res = await fetch(`${apiUrl}/legal/user/${userId}`);
        const result = await res.json();
        return JSON.stringify(result);
      } catch (error: any) {
        return JSON.stringify({
          success: false,
          message: 'Failed to find legal by user',
          error: error.message,
        });
      }
    },
  }),

  new DynamicTool({
    name: 'FindLegalByStatus',
    description:
      'Lấy giấy tờ theo trạng thái (pending/in_progress/completed/expired)',
    func: async (status: string) => {
      try {
        const res = await fetch(`${apiUrl}/legal/status/${status}`);
        const result = await res.json();
        return JSON.stringify(result);
      } catch (error: any) {
        return JSON.stringify({
          success: false,
          message: 'Failed to find legal by status',
          error: error.message,
        });
      }
    },
  }),
];
