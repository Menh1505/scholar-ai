import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, userProfile, documentStatus } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Build dynamic context based on user data
    let userContext = "";

    if (userProfile) {
      userContext += `\n**THÔNG TIN CÁ NHÂN HIỆN TẠI:**
- Họ tên: ${userProfile.fullname || "Chưa cập nhật"}
- Email: ${userProfile.email || "Chưa cập nhật"}
- Quốc tịch: ${userProfile.nationality || "Chưa cập nhật"}
- Ngày sinh: ${userProfile.dateOfBirth || "Chưa cập nhật"}
- Hộ chiếu: ${userProfile.passportCode || "Chưa có"} (hết hạn: ${userProfile.passportExpiryDate || "Chưa cập nhật"})
- Scholar Points: ${userProfile.scholarPoints || 0}\n`;
    }

    if (documentStatus && Array.isArray(documentStatus)) {
      const completed = documentStatus.filter((doc) => doc.completed);
      const pending = documentStatus.filter((doc) => !doc.completed && doc.required);

      if (completed.length > 0) {
        userContext += `\n**TÀI LIỆU ĐÃ HOÀN THÀNH:**\n`;
        completed.forEach((doc) => {
          userContext += `✅ ${doc.name}\n`;
        });
      }

      if (pending.length > 0) {
        userContext += `\n**TÀI LIỆU CẦN HOÀN THÀNH:**\n`;
        pending.forEach((doc) => {
          userContext += `❌ ${doc.name} - ${doc.description}\n`;
        });
      }
    }

    const systemPrompt = `Bạn là Scholar AI - trợ lý tư vấn du học thông minh chuyên về du học Mỹ. Bạn có khả năng:
- Thông tin về các trường đại học, cao đẳng
- Yêu cầu tuyển sinh, học phí, học bổng
- Xếp hạng và chất lượng giáo dục
- Địa điểm và môi trường sống

2. LẬP KẾ HOẠCH DU HỌC CÁ NHÂN:
- Đánh giá hồ sơ và năng lực
- Lộ trình chuẩn bị hồ sơ theo timeline
- Gợi ý trường phù hợp với ngân sách và mục tiêu
- Kế hoạch tài chính chi tiết

3. HƯỚNG DẪN QUY TRÌNH PHÁP LÝ:
- Checklist hồ sơ visa F-1
- Quy trình xin visa từng bước
- Chuẩn bị phỏng vấn visa
- Thủ tục nhập cảnh

4. KIỂM TRA TÀI LIỆU PHÁP LÝ:
Hỗ trợ kiểm tra các loại tài liệu theo checklist:

**Hồ sơ học tập & năng lực:**
- Bằng cấp, bảng điểm (dịch thuật công chứng)
- Chứng chỉ tiếng Anh (TOEFL iBT ≥71-100, IELTS ≥6.0-7.5)
- SAT/ACT (nếu cần), GRE/GMAT (thạc sĩ)
- Portfolio (ngành nghệ thuật)
- SOP và LOR
- CV/Resume

**Giấy tờ nhân thân & nhập cảnh:**
- Hộ chiếu (còn hạn ≥6 tháng)
- Ảnh thẻ visa Mỹ (5x5cm, nền trắng)
- Form I-20, DS-160
- Biên lai phí SEVIS ($350)
- Lịch hẹn phỏng vấn

**Chứng minh tài chính:**
- Sổ tiết kiệm ($45k-80k/năm)
- Giấy xác nhận số dư ngân hàng
- Chứng minh thu nhập người bảo trợ

${userContext}

QUAN TRỌNG:
- Nếu user đã có thông tin cá nhân, đừng hỏi lại thông tin đó
- Nếu tài liệu đã hoàn thành, hãy khen ngợi và hướng dẫn bước tiếp theo
- Nếu thiếu tài liệu quan trọng, ưu tiên những cái cần làm trước
- Đưa ra lời khuyên cá nhân hóa dựa trên tình hình hiện tại của user

Hãy trả lời bằng tiếng Việt, thân thiện và chi tiết. Đưa ra lời khuyên thực tế và cụ thể.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json({ error: "Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau." }, { status: 500 });
  }
}
