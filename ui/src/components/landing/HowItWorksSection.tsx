"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "1",
    title: "Chỉ cần chat",
    example: "Tôi muốn học ngành Kinh doanh ở Mỹ, ngân sách dưới 20,000 USD/năm.",
    color: "from-blue-500 to-purple-600",
  },
  {
    step: "2",
    title: "AI đề xuất trường phù hợp",
    example: "Nhận danh sách các trường đại học phù hợp với tiêu chí của bạn",
    color: "from-green-500 to-teal-600",
  },
  {
    step: "3",
    title: "Tạo checklist hồ sơ",
    example: "Danh sách chi tiết các giấy tờ cần chuẩn bị theo chuẩn quốc tế",
    color: "from-orange-500 to-red-600",
  },
  {
    step: "4",
    title: "Ghi nhớ thông tin",
    example: "AI lưu trữ và theo dõi toàn bộ quá trình của bạn",
    color: "from-purple-500 to-pink-600",
  },
  {
    step: "5",
    title: "Theo dõi trạng thái",
    example: "Cập nhật tiến độ từng loại giấy tờ, nhắc nhở deadline",
    color: "from-indigo-500 to-blue-600",
  },
  {
    step: "6",
    title: "Đồng hành đến cuối",
    example: "Hỗ trợ tới lúc bạn cầm visa trên tay",
    color: "from-yellow-500 to-orange-600",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-10 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Cách hoạt động</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Quy trình đơn giản, hiệu quả, được tối ưu hóa</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`flex items-center gap-6 mb-8 ${index % 2 === 1 ? "flex-row-reverse" : ""}`}>
              <div className="flex-1">
                <div className="bg-white/50 shadow-sm hover:shadow-md transition-shadow rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {step.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.example}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector line - only show if not last item */}
              {index < steps.length - 1 && (
                <div className="hidden md:block">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                    className="w-0.5 h-12 bg-gradient-to-b from-primary to-accent"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 max-w-3xl mx-auto border border-primary/20">
            <h3 className="text-xl font-bold text-foreground mb-3">Ví dụ thực tế</h3>
            <div className="bg-card rounded-lg p-4 text-left max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">You</span>
                </div>
                <p className="text-sm text-foreground italic">&quot;Tôi muốn học ngành Computer Science, ngân sách 25,000 USD/năm&quot;</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div className="bg-muted rounded-lg p-3 flex-1">
                  <p className="text-foreground text-xs leading-relaxed">
                    &quot;Tôi đã tìm thấy 3 trường phù hợp với bạn: University of Texas at Austin, Penn State University, và Virginia Tech. Bạn cần chuẩn bị 7
                    loại giấy tờ: TOEFL/IELTS, SAT/ACT, bảng điểm phổ thông, thư giới thiệu, essay cá nhân, chứng minh tài chính, và hộ chiếu. Tôi sẽ tạo
                    timeline chi tiết cho bạn...&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
