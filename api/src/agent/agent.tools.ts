// agent.tools.ts
import { DynamicTool } from '@langchain/core/tools';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export function createAgentTools(authToken: string) {
  return [
    new DynamicTool({
      name: 'getUserInfo',
      description: 'Lấy thông tin người dùng hiện tại để hiểu profile học tập',
      func: async (input: string) => {
        try {
          const res = await axios.get(`${API_BASE_URL}/user/me`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          return JSON.stringify({
            success: true,
            data: res.data,
          });
        } catch (error) {
          return JSON.stringify({
            success: false,
            error: 'Không thể lấy thông tin người dùng',
            details: error.response?.data || error.message,
          });
        }
      },
    }),

    new DynamicTool({
      name: 'createLegalDocument',
      description:
        'Tạo giấy tờ pháp lý mới cho du học. Input: tên giấy tờ (VD: I-20, Passport, Visa Application)',
      func: async (input: string) => {
        try {
          const documentName = input.trim();
          const res = await axios.post(
            `${API_BASE_URL}/legal`,
            {
              name: documentName,
              type: 'study_abroad',
              status: 'pending',
              description: `Giấy tờ ${documentName} cần chuẩn bị cho du học Mỹ`,
            },
            { headers: { Authorization: `Bearer ${authToken}` } },
          );
          return JSON.stringify({
            success: true,
            data: res.data,
            message: `Đã tạo giấy tờ ${documentName} thành công`,
          });
        } catch (error) {
          return JSON.stringify({
            success: false,
            error: `Không thể tạo giấy tờ ${input}`,
            details: error.response?.data || error.message,
          });
        }
      },
    }),

    new DynamicTool({
      name: 'updateLegalStatus',
      description:
        'Cập nhật trạng thái giấy tờ đã hoàn thành. Input: "documentId|status" (VD: "123|completed")',
      func: async (input: string) => {
        try {
          const [id, status] = input.split('|');
          if (!id || !status) {
            return JSON.stringify({
              success: false,
              error: 'Format không đúng. Cần: documentId|status',
            });
          }

          const res = await axios.patch(
            `${API_BASE_URL}/legal/${id}`,
            { status: status.trim() },
            { headers: { Authorization: `Bearer ${authToken}` } },
          );
          return JSON.stringify({
            success: true,
            data: res.data,
            message: `Đã cập nhật trạng thái giấy tờ thành ${status}`,
          });
        } catch (error) {
          return JSON.stringify({
            success: false,
            error: 'Không thể cập nhật trạng thái giấy tờ',
            details: error.response?.data || error.message,
          });
        }
      },
    }),

    new DynamicTool({
      name: 'getLegalDocuments',
      description: 'Lấy danh sách tất cả giấy tờ pháp lý của người dùng',
      func: async (input: string) => {
        try {
          const res = await axios.get(`${API_BASE_URL}/legal`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          return JSON.stringify({
            success: true,
            data: res.data,
            total: res.data.length,
          });
        } catch (error) {
          return JSON.stringify({
            success: false,
            error: 'Không thể lấy danh sách giấy tờ',
            details: error.response?.data || error.message,
          });
        }
      },
    }),

    new DynamicTool({
      name: 'createStudyPlan',
      description:
        'Tạo kế hoạch học tập chi tiết dựa trên thông tin người dùng. Input: thông tin về trường và ngành đã chọn',
      func: async (input: string) => {
        try {
          // Tạo study plan dựa trên input
          const planData = {
            name: 'Study Plan for US Education',
            description: `Kế hoạch học tập chi tiết: ${input}`,
            type: 'study_plan',
            status: 'draft',
          };

          const res = await axios.post(`${API_BASE_URL}/legal`, planData, {
            headers: { Authorization: `Bearer ${authToken}` },
          });

          return JSON.stringify({
            success: true,
            data: res.data,
            message: 'Đã tạo kế hoạch học tập thành công',
          });
        } catch (error) {
          return JSON.stringify({
            success: false,
            error: 'Không thể tạo kế hoạch học tập',
            details: error.response?.data || error.message,
          });
        }
      },
    }),

    new DynamicTool({
      name: 'searchUniversities',
      description:
        'Tìm kiếm các trường đại học phù hợp. Input: thông tin về ngành, ngân sách, vùng ưu tiên',
      func: async (input: string) => {
        try {
          // Mock data - trong thực tế có thể integrate với API của trường học
          const universities = [
            {
              name: 'Harvard University',
              location: 'Cambridge, MA',
              ranking: 1,
              tuition: '$54,000/year',
              programs: ['Business', 'Computer Science', 'Medicine'],
              requirements: {
                gpa: 3.9,
                toefl: 100,
                sat: 1500,
              },
            },
            {
              name: 'MIT',
              location: 'Cambridge, MA',
              ranking: 2,
              tuition: '$53,000/year',
              programs: ['Engineering', 'Computer Science', 'Physics'],
              requirements: {
                gpa: 3.8,
                toefl: 95,
                sat: 1480,
              },
            },
            {
              name: 'Stanford University',
              location: 'Stanford, CA',
              ranking: 3,
              tuition: '$56,000/year',
              programs: ['Computer Science', 'Business', 'Engineering'],
              requirements: {
                gpa: 3.9,
                toefl: 100,
                sat: 1490,
              },
            },
          ];

          // Filter based on input criteria
          const filteredUniversities = universities.filter((uni) => {
            const inputLower = input.toLowerCase();
            return uni.programs.some((program) =>
              inputLower.includes(program.toLowerCase()),
            );
          });

          return JSON.stringify({
            success: true,
            data: filteredUniversities,
            total: filteredUniversities.length,
            message: `Tìm thấy ${filteredUniversities.length} trường phù hợp`,
          });
        } catch (error) {
          return JSON.stringify({
            success: false,
            error: 'Không thể tìm kiếm trường học',
            details: error.message,
          });
        }
      },
    }),
  ];
}
