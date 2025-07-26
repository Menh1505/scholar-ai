"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, School, CheckCircle, MessageCircle, Shield, Bell, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Brain,
    title: "Trợ lý AI thông minh",
    description: "Phản hồi tức thì, hiểu bạn như người thật",
    gradient: "from-blue-500 to-purple-600",
  },
  {
    icon: School,
    title: "Gợi ý trường & ngành học",
    description: "Theo nguyện vọng, học lực, tài chính của bạn",
    gradient: "from-green-500 to-teal-600",
  },
  {
    icon: CheckCircle,
    title: "Danh sách giấy tờ chuẩn",
    description: "Theo chuẩn Đại sứ quán và các trường đại học",
    gradient: "from-orange-500 to-red-600",
  },
  {
    icon: MessageCircle,
    title: "Ghi nhớ toàn bộ tiến trình",
    description: "Luôn theo sát bạn dù hôm nay hay 3 tháng sau",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: Shield,
    title: "Bảo mật tuyệt đối",
    description: "Chỉ bạn có quyền truy cập thông tin",
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    icon: Bell,
    title: "Nhắc nhở deadline",
    description: "Không bao giờ trễ hạn nộp hồ sơ",
    gradient: "from-yellow-500 to-orange-600",
  },
];

export default function SolutionSection() {
  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text">ScholarAI</span> là giải pháp
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">ScholarAI là trợ lý ảo được xây dựng bằng công nghệ AI hiện đại, giúp bạn:</p>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-3 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">Gợi ý trường và ngành học phù hợp dựa trên điểm số, ngân sách và định hướng cá nhân</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">Tạo checklist giấy tờ cần thiết theo đúng chuẩn (visa, học bạ, thư giới thiệu, bằng cấp…)</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">Tự động theo dõi tiến trình, biết chính xác mình đang thiếu gì, cần làm gì tiếp theo</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">Trò chuyện tự nhiên – bạn chỉ cần nói chuyện như với một người bạn hiểu biết về du học</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-white/50 shadow-sm hover:shadow-md transition-shadow rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
