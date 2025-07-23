// agent.tools.ts
import { DynamicTool } from '@langchain/core/tools';
import axios from 'axios';
import { AgentConfig } from './agent.config';

const API_BASE_URL = AgentConfig.system.baseUrl;

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
        'Tạo giấy tờ pháp lý mới cho du học. Input: userId|documentTitle (VD: "123|I-20 Form")',
      func: async (input: string) => {
        try {
          const [userId, documentTitle] = input.split('|');
          if (!userId || !documentTitle) {
            return JSON.stringify({
              success: false,
              error: 'Input không hợp lệ. Cần format: userId|documentTitle',
            });
          }

          const res = await axios.post(
            `${API_BASE_URL}/legal`,
            {
              userId: userId.trim(),
              title: documentTitle.trim(),
              content: `Giấy tờ ${documentTitle.trim()} cần chuẩn bị cho du học Mỹ`,
              status: 'pending',
            },
            { headers: { Authorization: `Bearer ${authToken}` } },
          );
          return JSON.stringify({
            success: true,
            data: res.data,
            message: `Đã tạo giấy tờ ${documentTitle} thành công`,
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
      name: 'getLegalDocuments',
      description:
        'Lấy danh sách tất cả giấy tờ pháp lý của người dùng hiện tại',
      func: async (input: string) => {
        try {
          // Lấy thông tin user từ token thay vì input
          const userRes = await axios.get(`${API_BASE_URL}/user/me`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          const userId = userRes.data._id;

          const res = await axios.get(`${API_BASE_URL}/legal/user/${userId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          return JSON.stringify({
            success: true,
            data: res.data,
            total: res.data.data ? res.data.data.length : 0,
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

    new DynamicTool({
      name: 'ensureLegalDocuments',
      description:
        'Kiểm tra và tạo danh sách giấy tờ pháp lý cần thiết cho du học, chỉ tạo những gì chưa có. Input: userId',
      func: async (input: string) => {
        try {
          const userId = input.trim();
          if (!userId) {
            return JSON.stringify({
              success: false,
              error: 'Cần cung cấp userId',
            });
          }

          // First, get existing legal documents
          const existingRes = await axios.get(
            `${API_BASE_URL}/legal/user/${userId}`,
            {
              headers: { Authorization: `Bearer ${authToken}` },
            },
          );

          const existingDocs = existingRes.data.data || [];
          const existingTitles = existingDocs.map((doc) =>
            doc.title.toLowerCase(),
          );

          // Define required documents for studying abroad
          const requiredDocs = [
            'I-20 Form',
            'Passport',
            'Visa Application (DS-160)',
            'Financial Statement',
            'Academic Transcripts',
          ];

          // Create only missing documents
          const missingDocs = requiredDocs.filter(
            (doc) => !existingTitles.includes(doc.toLowerCase()),
          );

          const createdDocs: any[] = [];
          for (const docTitle of missingDocs) {
            const createRes = await axios.post(
              `${API_BASE_URL}/legal`,
              {
                userId: userId,
                title: docTitle,
                content: `Giấy tờ ${docTitle} cần chuẩn bị cho du học Mỹ`,
                type: 'document',
                status: 'pending',
                priority:
                  docTitle.includes('I-20') || docTitle.includes('Passport')
                    ? 'high'
                    : 'medium',
              },
              { headers: { Authorization: `Bearer ${authToken}` } },
            );
            createdDocs.push(createRes.data);
          }

          return JSON.stringify({
            success: true,
            existing: existingDocs.length,
            created: createdDocs.length,
            createdDocs: createdDocs,
            message: `Đã kiểm tra và tạo ${createdDocs.length} giấy tờ mới. Tổng cộng có ${existingDocs.length + createdDocs.length} giấy tờ.`,
          });
        } catch (error) {
          return JSON.stringify({
            success: false,
            error: 'Không thể kiểm tra/tạo giấy tờ pháp lý',
            details: error.response?.data || error.message,
          });
        }
      },
    }),
  ];
}
