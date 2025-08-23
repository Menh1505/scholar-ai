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
      description: `Tạo nhiều giấy tờ pháp lý du học. Input: tên giấy tờ cách nhau bởi dấu phẩy hoặc JSON array. VD: "I-20 Form, Bank Statement" hoặc ["Passport", "Visa"]`,
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
      description: `Đánh dấu giấy tờ pháp lý hoàn thành. Input: tên giấy tờ (VD: "I-20 Form"). Chỉ truyền tên, tool sẽ tìm và cập nhật status thành "completed".`,
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
      description: `Cập nhật thông tin cá nhân. Input: JSON object với các trường cần cập nhật.
Các trường: fullName, email, phoneNumber, address, dateOfBirth (YYYY-MM-DD), gender, religion, passportNumber, passportExpiryDate, currentCountry, currentEducationLevel, academicResult, estimatedBudget, fundingSource, needsScholarship, studyLanguage, certificates {ielts, toefl, duolingo, testDaf}, studyPlan, intendedIntakeTime, currentProgress.
VD: '{"fullName": "Nguyễn Văn An", "estimatedBudget": 50000}'`,

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
      description: `Cập nhật nguyện vọng học tập. Input: JSON object với các trường nguyện vọng.
Các trường: desiredEducationLevel, extracurricularsAndExperience, dreamMajor, reasonForChoosingMajor, careerGoal, preferredStudyCountry, schoolSelectionCriteria.
VD: '{"dreamMajor": "Khoa học máy tính", "preferredStudyCountry": "Úc"}'`,
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
      description: `Cập nhật giai đoạn tư vấn. Input: tên phase.
Các phase hợp lệ: "collect_info" (thu thập thông tin), "select_school" (gợi ý trường), "legal_checklist" (giấy tờ pháp lý), "progress_tracking" (theo dõi tiến độ), "life_planning" (tư vấn sinh sống).
VD: "select_school"`,
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
