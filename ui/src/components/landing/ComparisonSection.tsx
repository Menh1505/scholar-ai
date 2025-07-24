"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const comparisonData = [
  {
    task: "Tìm trường, chọn ngành",
    traditional: "Mất nhiều tuần tra cứu",
    scholarAI: "Gợi ý chính xác chỉ sau vài phút",
    improvement: "90% tiết kiệm thời gian",
  },
  {
    task: "Liệt kê giấy tờ cần nộp",
    traditional: "Dễ bị sót, thiếu",
    scholarAI: "Checklist thông minh tự động",
    improvement: "100% đầy đủ",
  },
  {
    task: "Cập nhật tiến độ hồ sơ",
    traditional: "Phải nhớ từng cái",
    scholarAI: "Theo dõi, nhắc nhở tự động",
    improvement: "Không bỏ sót deadline",
  },
  {
    task: "Hỏi – đáp chuyên sâu",
    traditional: "Không ai giải đáp ngay",
    scholarAI: "Chat với AI 24/7",
    improvement: "Phản hồi tức thì",
  },
  {
    task: "Chi phí",
    traditional: "10–20 triệu VNĐ",
    scholarAI: "Miễn phí (bản thử nghiệm)",
    improvement: "Tiết kiệm 100%",
  },
];

const targetAudience = [
  {
    title: "Học sinh đang lên kế hoạch du học",
    description: "Chuẩn bị cho hành trình du học từ sớm",
    icon: "👨‍🎓",
  },
  {
    title: "Sinh viên đại học muốn học chuyển tiếp",
    description: "Tiếp tục học tập ở bậc cao hơn",
    icon: "📚",
  },
  {
    title: "Phụ huynh cần hỗ trợ con cái",
    description: "Đồng hành cùng con trong quá trình du học",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    title: "Người đi làm muốn học cao hơn",
    description: "Nâng cao trình độ và kỹ năng nghề nghiệp",
    icon: "💼",
  },
  {
    title: "Ai đang loay hoay với thông tin rối rắm",
    description: "Cần sự hỗ trợ để sắp xếp thông tin du học",
    icon: "❓",
  },
];

export default function ComparisonSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Target Audience */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-6">AI này dành cho ai?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {targetAudience.map((audience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}>
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{audience.icon}</div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{audience.title}</h3>
                    <p className="text-muted-foreground text-sm">{audience.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-12">
            Hành trình du học: <span className="text-muted-foreground">Truyền thống</span> vs. <span className="text-primary">ScholarAI</span>
          </h2>

          <div className="overflow-x-auto">
            <div className="min-w-full bg-card rounded-xl border overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-4 bg-muted/50">
                <div className="p-4 font-semibold text-foreground border-r">Việc cần làm</div>
                <div className="p-4 font-semibold text-red-400 border-r">Tự làm thủ công</div>
                <div className="p-4 font-semibold text-primary border-r">Dùng ScholarAI</div>
                <div className="p-4 font-semibold text-green-600">Cải thiện</div>
              </div>

              {/* Rows */}
              {comparisonData.map((row, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`grid grid-cols-4 border-t ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                  <div className="p-4 font-medium text-foreground border-r">{row.task}</div>
                  <div className="p-4 text-red-400 border-r">{row.traditional}</div>
                  <div className="p-4 text-foreground border-r">{row.scholarAI}</div>
                  <div className="p-4 text-green-600 font-medium">{row.improvement}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Success Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Câu chuyện thực tế</h3>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    TA
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-foreground mb-4">Tuấn Anh, học sinh lớp 12 tại TP.HCM</h4>
                    <p className="text-muted-foreground mb-6">Muốn học ngành Computer Science nhưng không biết phải bắt đầu từ đâu.</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-foreground mb-3">🕐 Chỉ sau 30 phút chat với ScholarAI:</h5>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>✅ Có danh sách 3 trường phù hợp</li>
                          <li>✅ Biết rõ cần chuẩn bị 7 loại giấy tờ</li>
                          <li>✅ Có tiến trình rõ ràng để theo dõi</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground mb-3">📅 Sau 1 tháng:</h5>
                        <p className="text-sm text-muted-foreground">Đã hoàn tất toàn bộ hồ sơ apply và sẵn sàng nộp đơn vào các trường mơ ước.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
