"use client";

import { motion } from "framer-motion";
import { AlertTriangle, DollarSign, FileX, HelpCircle, MapPin, Clock } from "lucide-react";

const problems = [
  {
    icon: HelpCircle,
    title: "Không biết bắt đầu từ đâu",
    description: "Hàng ngàn trường, hàng trăm ngành. Google cả tuần vẫn không ra được trường phù hợp với năng lực, tài chính hay ước mơ.",
    color: "text-red-500",
  },
  {
    icon: DollarSign,
    title: "Chi phí tư vấn cao",
    description: "Thuê dịch vụ tư vấn tốn 10–30 triệu, nhưng lại không chắc hiểu hết quy trình, hoặc bị rập khuôn theo lộ trình có sẵn.",
    color: "text-orange-500",
  },
  {
    icon: FileX,
    title: "Thiếu giấy tờ, điền sai form",
    description: "Tự làm thì thiếu giấy tờ, điền sai form, không hiểu rõ quy định pháp lý – rất dễ bị loại hồ sơ chỉ vì sai sót nhỏ.",
    color: "text-yellow-500",
  },
  {
    icon: AlertTriangle,
    title: "Không có hướng dẫn tận tình",
    description: "Mỗi người lại khuyên một kiểu – học sinh hoang mang, phụ huynh lo lắng.",
    color: "text-blue-500",
  },
  {
    icon: MapPin,
    title: "Thiếu kỹ năng sống cơ bản",
    description: "Không biết ước lượng chi phí sinh hoạt, lập kế hoạch học tập, hay cách sinh tồn nơi đất khách quê người.",
    color: "text-purple-500",
  },
  {
    icon: Clock,
    title: "Dễ bỏ lỡ deadline",
    description: "Chỉ một sơ suất nhỏ – bạn có thể đánh mất cả năm trời vì không lên kế hoạch bài bản.",
    color: "text-pink-500",
  },
];

export default function ProblemsSection() {
  return (
    <section className="py-10 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-mono font-bold text-foreground mb-6">
            Vấn đề của <span className="text-destructive font-sans">người du học</span>
          </h2>
          <p className="text-xl font-sans text-muted-foreground max-w-3xl mx-auto">
            Du học không chỉ là chuyện &quot;nộp hồ sơ – nhận thư mời – xách vali lên đường&quot;. Nó là một hành trình thay đổi cả cuộc đời – và sai một bước,
            có thể lỡ cả tương lai.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-white/50 shadow-sm hover:shadow-md transition-shadow rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-md bg-muted/80 ${problem.color} flex-shrink-0`}>
                  <problem.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-mono font-semibold text-foreground mb-1">{problem.title}</h3>
                  <p className="text-sm font-sans text-muted-foreground leading-relaxed">{problem.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-2xl mx-auto">
            <h3 className="text-xl font-mono font-bold text-destructive mb-2">Hậu quả?</h3>
            <p className="text-base font-sans text-foreground">
              Không lên kế hoạch bài bản, dễ bỏ lỡ deadline, thiếu giấy tờ, không chuẩn bị tâm lý – và thậm chí vỡ mộng sau khi đã đến nước ngoài.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
