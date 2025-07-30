// agent.tools.ts
import { DynamicTool } from '@langchain/core/tools';
import { UserService } from '../user/user.service';
import { LegalService } from '../legal/legal.service';

export function createAgentTools(
  legalService: LegalService,
  userId: string,
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
      name: 'getLegalDocuments',
      description: `Lấy danh sách giấy tờ pháp lý cần thiết của người dùng. Output là danh sách giấy tờ kèm trạng thái. Ví dụ: "I-20 Form - pending", "F-1 Visa - in_progress", "Transcript - completed".`,
      func: async () => {
        try {
          const documents = await legalService.findByUserId(userId);

          return JSON.stringify({
            success: true,
            data: documents,
            total: documents.length,
            message: 'Lấy danh sách giấy tờ thành công',
          });
        } catch (error) {
          return JSON.stringify({
            success: false,
            error: 'Không thể lấy danh sách giấy tờ',
            details: error.message,
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
  ];
}
