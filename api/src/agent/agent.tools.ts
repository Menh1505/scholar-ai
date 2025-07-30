// agent.tools.ts
import { DynamicTool } from '@langchain/core/tools';
import { UserService } from '../user/user.service';
import { LegalService } from '../legal/legal.service';
import { CreateLegalDto } from '../legal/dto/create-legal.dto';
import { UpdateLegalDto } from '../legal/dto/update-legal.dto';

export function createAgentTools(
  userService: UserService,
  legalService: LegalService,
  userId: string,
) {
  return [
    new DynamicTool({
      name: 'getUserInfo',
      description:
        'Lấy thông tin người dùng theo userId để hiểu profile học tập',
      func: async (input: string) => {
        try {
          const targetUserId = input.trim() || userId;
          const user = await userService.findOne(targetUserId);

          if (!user) {
            return JSON.stringify({
              success: false,
              error: 'Không tìm thấy người dùng',
            });
          }

          return JSON.stringify({
            success: true,
            data: user,
            message: 'Lấy thông tin người dùng thành công',
          });
        } catch (error) {
          return JSON.stringify({
            success: false,
            error: 'Không thể lấy thông tin người dùng',
            details: error.message,
          });
        }
      },
    }),

    new DynamicTool({
      name: 'createLegalDocument',
      description:
        'Tạo giấy tờ pháp lý mới cho du học. Input: documentTitle (VD: "I-20 Form")',
      func: async (input: string) => {
        try {
          const documentTitle = input.trim();
          if (!documentTitle) {
            return JSON.stringify({
              success: false,
              error: 'Tên giấy tờ không được để trống',
            });
          }

          const createLegalDto: CreateLegalDto = {
            userId: userId,
            title: documentTitle,
            content: `Giấy tờ ${documentTitle} cần chuẩn bị cho du học Mỹ`,
            status: 'pending',
          };

          const legal = await legalService.create(createLegalDto);

          return JSON.stringify({
            success: true,
            data: legal,
            message: `Đã tạo giấy tờ ${documentTitle} thành công`,
          });
        } catch (error) {
          return JSON.stringify({
            success: false,
            error: `Không thể tạo giấy tờ ${input}`,
            details: error.message,
          });
        }
      },
    }),

    new DynamicTool({
      name: 'getLegalDocuments',
      description:
        'Lấy danh sách tất cả giấy tờ pháp lý của người dùng cần phải làm và trạng thái hiện tại',
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
      name: 'updateLegalDocument',
      description:
        'Cập nhật giấy tờ pháp lý. Input: documentId|updateData (VD: "64f1a2b3c4d5e6f7g8h9i0j1|{"status": "completed", "content": "Đã hoàn thành"}")',
      func: async (input: string) => {
        try {
          const [documentId, updateDataStr] = input.split('|');
          if (!documentId || !updateDataStr) {
            return JSON.stringify({
              success: false,
              error: 'Input không hợp lệ. Cần format: documentId|updateData',
            });
          }

          let updateData: UpdateLegalDto;
          try {
            updateData = JSON.parse(updateDataStr.trim());
          } catch (parseError) {
            return JSON.stringify({
              success: false,
              error: 'Dữ liệu cập nhật không đúng định dạng JSON',
            });
          }

          const updatedDocument = await legalService.update(
            documentId.trim(),
            updateData,
          );

          return JSON.stringify({
            success: true,
            data: updatedDocument,
            message: 'Cập nhật giấy tờ thành công',
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
