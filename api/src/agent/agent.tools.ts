// agent.tools.ts
import { DynamicTool } from '@langchain/core/tools';
import { UserService } from '../user/user.service';
import { LegalService } from '../legal/legal.service';
import { AgentSessionService } from './services/agent.session.service';
import { Phase } from './schema/agent.schema';

export function createAgentTools(
  legalService: LegalService,
  userId: string,
  sessionService: AgentSessionService,
) {
  return [
    new DynamicTool({
      name: 'createLegalDocuments',
      description: `
Tạo nhiều giấy tờ pháp lý cần thiết cho quá trình du học. 
Input là một chuỗi gồm các tên giấy tờ, cách nhau bởi dấu phẩy (,) hoặc một chuỗi JSON dạng array như: "I-20 Form, Bank Statement, Transcript" hoặc ["I-20 Form", "F-1 Visa Application", Bank Statement", "Transcript"]. Lưu ý: Chỉ nhập tên giấy tờ, không cần thêm thông tin nào khác. Ví dụ đúng: - "Passport, I-20 Form, Bank Statement" - '["Passport", "Visa Application"]'`,
      func: async (input: string) => {
        try {
          // Normalize input
          let titles: string[] = [];

          // Case: JSON array string
          if (input.trim().startsWith('[')) {
            titles = JSON.parse(input);
          } else {
            // Case: comma-separated string
            titles = input
              .split(',')
              .map((t) => t.trim())
              .filter((t) => t.length > 0);
          }

          if (!titles.length) {
            return JSON.stringify({
              success: false,
              error: 'Cần ít nhất 1 tên giấy tờ',
            });
          }

          const created: any[] = [];
          const failed: { title: string; error: string }[] = [];

          for (const title of titles) {
            try {
              const legal = await legalService.create({
                userId,
                title,
                status: 'pending',
              });
              created.push(legal);
            } catch (err) {
              failed.push({ title, error: err.message });
            }
          }

          return JSON.stringify({
            success: failed.length === 0,
            createdCount: created.length,
            failedCount: failed.length,
            created,
            failed,
            message:
              failed.length === 0
                ? 'Tạo tất cả giấy tờ thành công.'
                : `Một số giấy tờ không thể tạo: ${failed
                    .map((f) => f.title)
                    .join(', ')}`,
          });
        } catch (err) {
          return JSON.stringify({
            success: false,
            error: 'Đầu vào không hợp lệ hoặc lỗi xử lý',
            details: err.message,
          });
        }
      },
    }),

    new DynamicTool({
      name: 'markLegalDocumentCompleted',
      description: `Đánh dấu một giấy tờ pháp lý đã hoàn thành. Input: tên giấy tờ (VD: "I-20 Form", "F-1 Visa"). Lưu ý: Chỉ truyền tên giấy tờ, không cần ID. Tool sẽ tìm đúng giấy tờ theo user và cập nhật trạng thái "completed".`,
      func: async (input: string) => {
        try {
          const documentTitle = input.trim();
          if (!documentTitle) {
            return JSON.stringify({
              success: false,
              error: 'Tên giấy tờ không được để trống.',
            });
          }

          // Tìm giấy tờ theo title + user
          const documents = await legalService.findByUserId(userId);
          const target = documents.find(
            (doc) => doc.title.toLowerCase() === documentTitle.toLowerCase(),
          );

          if (!target) {
            return JSON.stringify({
              success: false,
              error: `Không tìm thấy giấy tờ với tên "${documentTitle}"`,
            });
          }

          // Cập nhật trạng thái
          const updated = await legalService.update(target._id.toString(), {
            status: 'completed',
          });

          return JSON.stringify({
            success: true,
            message: `Đã đánh dấu giấy tờ "${documentTitle}" là hoàn thành.`,
            data: updated,
          });
        } catch (error) {
          return JSON.stringify({
            success: false,
            error: 'Không thể cập nhật giấy tờ',
            details: error.message,
          });
        }
      },
    }),

    new DynamicTool({
      name: 'updateUserInfo',
      description: `
Cập nhật thông tin cá nhân của người dùng trong phiên tư vấn. Tool này cho phép cập nhật một hoặc nhiều trường thông tin user cùng lúc.

Input: Chuỗi JSON chứa các trường cần cập nhật. Các trường có thể bao gồm:

 THÔNG TIN CÁ NHÂN:
- fullName: Họ và tên đầy đủ (string)
- email: Địa chỉ email (string) 
- phoneNumber: Số điện thoại (string)
- address: Địa chỉ hiện tại (string)
- dateOfBirth: Ngày sinh theo định dạng YYYY-MM-DD (string)
- gender: Giới tính - "Nam", "Nữ", hoặc "Khác" (string)
- religion: Tôn giáo (string)

 THÔNG TIN HỘ CHIẾU:
- passportNumber: Số hộ chiếu (string)
- passportExpiryDate: Ngày hết hạn hộ chiếu YYYY-MM-DD (string)
- currentCountry: Quốc gia đang sinh sống (string)

 HỌC LỰC HIỆN TẠI:
- currentEducationLevel: Trình độ học vấn - "THPT", "Cao đẳng", "Đại học", hoặc "Khác" (string)
- academicResult: Kết quả học tập (GPA, điểm số...) (string)

 TÀI CHÍNH:
- estimatedBudget: Ngân sách dự kiến (number)
- fundingSource: Nguồn tài trợ - "Tự túc", "Gia đình tài trợ", "Học bổng", hoặc "Khác" (string)
- needsScholarship: Có cần học bổng không (boolean)

 NGÔN NGỮ & CHỨNG CHỈ:
- studyLanguage: Ngôn ngữ học chính (string)
- certificates: Object chứa điểm các chứng chỉ ngôn ngữ:
  - ielts: Điểm IELTS (number)
  - toefl: Điểm TOEFL (number) 
  - duolingo: Điểm Duolingo (number)
  - testDaf: Điểm TestDaF (number)

 KẾ HOẠCH & THỜI GIAN:
- studyPlan: Lộ trình học, định hướng cá nhân (string)
- intendedIntakeTime: Thời gian dự kiến nhập học (string)
- currentProgress: Tiến độ hiện tại (string)


Ví dụ sử dụng:
- Cập nhật tên: '{"fullName": "Nguyễn Văn An"}'
- Cập nhật nhiều trường: '{"fullName": "Nguyễn Văn An", "email": "an@email.com", "estimatedBudget": 50000}'
- Cập nhật chứng chỉ: '{"certificates": {"ielts": 7.5, "toefl": 100}}'

Lưu ý: Chỉ truyền các trường cần cập nhật, không cần truyền tất cả.
`,
      func: async (input: string) => {
        try {
          const updateData = JSON.parse(input);

          if (!updateData || typeof updateData !== 'object') {
            return JSON.stringify({
              success: false,
              error: 'Dữ liệu cập nhật phải là một object JSON hợp lệ',
            });
          }

          // Lấy session hiện tại
          const session = await sessionService.getOrCreateSession(userId);

          // Chuẩn bị dữ liệu cập nhật
          const sessionUpdates: any = {};

          // Danh sách các trường thuộc userInfo
          const userInfoFields = [
            'fullName',
            'email',
            'phoneNumber',
            'address',
            'dateOfBirth',
            'gender',
            'religion',
            'passportNumber',
            'passportExpiryDate',
            'currentCountry',
            'currentEducationLevel',
            'academicResult',
            'estimatedBudget',
            'fundingSource',
            'needsScholarship',
            'studyLanguage',
            'certificates',
            'studyPlan',
            'intendedIntakeTime',
            'currentProgress',
          ];

          // Cập nhật userInfo
          const userInfoUpdates: any = {};
          let hasUserInfoUpdates = false;

          for (const field of userInfoFields) {
            if (updateData.hasOwnProperty(field)) {
              userInfoUpdates[field] = updateData[field];
              hasUserInfoUpdates = true;
            }
          }

          if (hasUserInfoUpdates) {
            sessionUpdates.userInfo = {
              ...session.userInfo,
              ...userInfoUpdates,
            };
          }

          // Thực hiện cập nhật
          if (Object.keys(sessionUpdates).length > 0) {
            await sessionService.updateSession(userId, sessionUpdates);

            return JSON.stringify({
              success: true,
              message: 'Cập nhật thông tin người dùng thành công',
              updatedFields: Object.keys(updateData),
              updatedData: updateData,
            });
          } else {
            return JSON.stringify({
              success: false,
              error:
                'Không có trường nào được cập nhật. Vui lòng kiểm tra lại tên trường.',
            });
          }
        } catch (error) {
          if (error instanceof SyntaxError) {
            return JSON.stringify({
              success: false,
              error:
                'Định dạng JSON không hợp lệ. Vui lòng kiểm tra lại cú pháp.',
              details: error.message,
            });
          }

          return JSON.stringify({
            success: false,
            error: 'Không thể cập nhật thông tin người dùng',
            details: error.message,
          });
        }
      },
    }),

    new DynamicTool({
      name: 'updateUserAspirations',
      description: `
Cập nhật nguyện vọng học tập của người dùng trong phiên tư vấn. Tool này cho phép cập nhật một hoặc nhiều trường nguyện vọng cùng lúc.

Input: Chuỗi JSON chứa các trường nguyện vọng cần cập nhật. Các trường có thể bao gồm:

 NGUYỆN VỌNG HỌC TẬP:
- desiredEducationLevel: Trình độ mong muốn - "Cao đẳng", "Cử nhân", "Thạc sĩ", "Tiến sĩ" (string)
- extracurricularsAndExperience: Hoạt động ngoại khóa và kinh nghiệm (string)
- dreamMajor: Ngành học mong muốn (string)
- reasonForChoosingMajor: Lý do chọn ngành này (string)
- careerGoal: Mục tiêu nghề nghiệp trong tương lai (string)
- preferredStudyCountry: Quốc gia muốn du học (string)
- schoolSelectionCriteria: Tiêu chí lựa chọn trường học (string)

Ví dụ sử dụng:
- Cập nhật ngành học: '{"dreamMajor": "Khoa học máy tính"}'
- Cập nhật nhiều trường: '{"dreamMajor": "Khoa học máy tính", "preferredStudyCountry": "Úc", "careerGoal": "Trở thành AI Engineer"}'
- Cập nhật trình độ: '{"desiredEducationLevel": "Thạc sĩ", "reasonForChoosingMajor": "Muốn nghiên cứu sâu về AI"}'

Lưu ý: Chỉ truyền các trường cần cập nhật, không cần truyền tất cả.
`,
      func: async (input: string) => {
        try {
          const updateData = JSON.parse(input);

          if (!updateData || typeof updateData !== 'object') {
            return JSON.stringify({
              success: false,
              error: 'Dữ liệu cập nhật phải là một object JSON hợp lệ',
            });
          }

          // Lấy session hiện tại
          const session = await sessionService.getOrCreateSession(userId);

          // Chuẩn bị dữ liệu cập nhật
          const sessionUpdates: any = {};

          // Danh sách các trường thuộc aspirations
          const aspirationsFields = [
            'desiredEducationLevel',
            'extracurricularsAndExperience',
            'dreamMajor',
            'reasonForChoosingMajor',
            'careerGoal',
            'preferredStudyCountry',
            'schoolSelectionCriteria',
          ];

          // Cập nhật aspirations
          const aspirationsUpdates: any = {};
          let hasAspirationsUpdates = false;

          for (const field of aspirationsFields) {
            if (updateData.hasOwnProperty(field)) {
              aspirationsUpdates[field] = updateData[field];
              hasAspirationsUpdates = true;
            }
          }

          if (hasAspirationsUpdates) {
            sessionUpdates.aspirations = {
              ...session.aspirations,
              ...aspirationsUpdates,
            };
          }

          // Thực hiện cập nhật
          if (Object.keys(sessionUpdates).length > 0) {
            await sessionService.updateSession(userId, sessionUpdates);

            return JSON.stringify({
              success: true,
              message: 'Cập nhật nguyện vọng học tập thành công',
              updatedFields: Object.keys(updateData),
              updatedData: updateData,
            });
          } else {
            return JSON.stringify({
              success: false,
              error:
                'Không có trường nào được cập nhật. Vui lòng kiểm tra lại tên trường.',
            });
          }
        } catch (error) {
          if (error instanceof SyntaxError) {
            return JSON.stringify({
              success: false,
              error:
                'Định dạng JSON không hợp lệ. Vui lòng kiểm tra lại cú pháp.',
              details: error.message,
            });
          }

          return JSON.stringify({
            success: false,
            error: 'Không thể cập nhật nguyện vọng học tập',
            details: error.message,
          });
        }
      },
    }),

    new DynamicTool({
      name: 'updateSessionPhase',
      description: `
Cập nhật giai đoạn (phase) hiện tại của phiên tư vấn du học. Tool này được sử dụng để chuyển đổi giữa các giai đoạn khác nhau trong quá trình tư vấn.

Input: Tên giai đoạn cần chuyển đến (string). Các giai đoạn hợp lệ bao gồm:

 CÁC GIAI ĐOẠN TƯ VẤN:
- "collect_info": Thu thập thông tin cá nhân và nguyện vọng từ user
- "select_school": Gợi ý và lựa chọn trường học, ngành học phù hợp
- "legal_checklist": Tạo và quản lý danh sách giấy tờ pháp lý cần thiết
- "progress_tracking": Theo dõi tiến độ chuẩn bị giấy tờ và hồ sơ
- "life_planning": Tư vấn về kế hoạch sinh sống, chỗ ở, chi phí

 HƯỚNG DẪN SỬ DỤNG:
- Sử dụng tool này để chuyển phase khi user có nhu cầu rõ ràng về một giai đoạn cụ thể
- Chỉ chuyển phase khi thực sự cần thiết, không nên thay đổi liên tục
- Phase sẽ ảnh hưởng đến cách agent phản hồi và hướng dẫn user

 VÍ DỤ SỬ DỤNG:
- Chuyển sang thu thập thông tin: "collect_info"
- Chuyển sang gợi ý trường học: "select_school" 
- Chuyển sang checklist giấy tờ: "legal_checklist"
- Chuyển sang theo dõi tiến độ: "progress_tracking"
- Chuyển sang tư vấn sinh sống: "life_planning"

 LƯU Ý: Chỉ truyền tên phase, không cần thêm thông tin khác.
`,
      func: async (input: string) => {
        try {
          const newPhase = input.trim().toLowerCase();

          // Danh sách các phase hợp lệ
          const validPhases = [
            Phase.COLLECT_INFO,
            Phase.SELECT_SCHOOL,
            Phase.LEGAL_CHECKLIST,
            Phase.PROGRESS_TRACKING,
            Phase.LIFE_PLANNING,
          ];

          // Tìm phase enum tương ứng
          const phaseMap = {
            collect_info: Phase.COLLECT_INFO,
            select_school: Phase.SELECT_SCHOOL,
            legal_checklist: Phase.LEGAL_CHECKLIST,
            progress_tracking: Phase.PROGRESS_TRACKING,
            life_planning: Phase.LIFE_PLANNING,
          };

          const targetPhase = phaseMap[newPhase];
          if (!targetPhase) {
            return JSON.stringify({
              success: false,
              error: `Phase không hợp lệ. Các phase hợp lệ: ${Object.keys(phaseMap).join(', ')}`,
              validPhases: Object.keys(phaseMap),
            });
          }

          // Lấy session hiện tại
          const session = await sessionService.getOrCreateSession(userId);
          const currentPhase = session.phase;

          // Cập nhật phase
          await sessionService.updateSession(userId, { phase: targetPhase });

          // Tạo thông báo mô tả sự thay đổi
          const phaseDescriptions = {
            collect_info: 'Thu thập thông tin cá nhân và nguyện vọng',
            select_school: 'Gợi ý và lựa chọn trường học phù hợp',
            legal_checklist: 'Tạo và quản lý danh sách giấy tờ pháp lý',
            progress_tracking: 'Theo dõi tiến độ chuẩn bị hồ sơ',
            life_planning: 'Tư vấn kế hoạch sinh sống và thích nghi',
          };

          return JSON.stringify({
            success: true,
            message: `Đã chuyển giai đoạn tư vấn thành công`,
            previousPhase: currentPhase,
            currentPhase: newPhase,
            phaseDescription: phaseDescriptions[newPhase],
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          return JSON.stringify({
            success: false,
            error: 'Không thể cập nhật giai đoạn phiên tư vấn',
            details: error.message,
          });
        }
      },
    }),
  ];
}
