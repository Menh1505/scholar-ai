"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Vấn đề của <span className="text-destructive">người du học</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Du học không chỉ là chuyện "nộp hồ sơ – nhận thư mời – xách vali lên đường". Nó là một hành trình thay đổi cả cuộc đời – và sai một bước, có thể lỡ
            cả tương lai.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <Card className="h-full border-l-4 border-l-destructive/60 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-muted ${problem.color}`}>
                      <problem.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{problem.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-destructive mb-4">Hậu quả?</h3>
            <p className="text-lg text-foreground">
              Không lên kế hoạch bài bản, dễ bỏ lỡ deadline, thiếu giấy tờ, không chuẩn bị tâm lý – và thậm chí vỡ mộng sau khi đã đến nước ngoài.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
