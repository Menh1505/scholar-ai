"use client";

import { motion } from "framer-motion";

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
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        {/* Target Audience */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-6">AI này dành cho ai?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-5xl mx-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {targetAudience.map((audience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="bg-white/50 shadow-sm hover:shadow-md transition-shadow rounded-lg p-4 text-center">
                <div className="text-3xl mb-3">{audience.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{audience.title}</h3>
                <p className="text-muted-foreground text-sm">{audience.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-8">
            Hành trình du học: Truyền thống vs. <span className="text-primary">ScholarAI</span>
          </h2>

          <div className="overflow-x-auto">
            <div className="min-w-full bg-card rounded-lg border overflow-hidden shadow-sm">
              {/* Header */}
              <div className="grid grid-cols-4 bg-muted/50">
                <div className="p-3 font-semibold text-sm text-foreground border-r">Việc cần làm</div>
                <div className="p-3 font-semibold text-sm text-red-400 border-r">Tự làm thủ công</div>
                <div className="p-3 font-semibold text-sm text-primary border-r">Dùng ScholarAI</div>
                <div className="p-3 font-semibold text-sm text-green-600">Cải thiện</div>
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
                  <div className="p-3 font-medium text-sm text-foreground border-r">{row.task}</div>
                  <div className="p-3 text-sm text-red-400 border-r">{row.traditional}</div>
                  <div className="p-3 text-sm text-foreground border-r">{row.scholarAI}</div>
                  <div className="p-3 text-sm text-green-600 font-medium">{row.improvement}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
