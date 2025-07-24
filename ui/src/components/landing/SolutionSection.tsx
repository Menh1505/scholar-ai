"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Giải pháp hoàn hảo
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ScholarAI</span> là giải pháp
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">ScholarAI là trợ lý ảo được xây dựng bằng công nghệ AI hiện đại, giúp bạn:</p>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-foreground">Gợi ý trường và ngành học phù hợp dựa trên điểm số, ngân sách và định hướng cá nhân</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-foreground">Tạo checklist giấy tờ cần thiết theo đúng chuẩn (visa, học bạ, thư giới thiệu, bằng cấp…)</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-foreground">Tự động theo dõi tiến trình, biết chính xác mình đang thiếu gì, cần làm gì tiếp theo</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-foreground">Trò chuyện tự nhiên – bạn chỉ cần nói chuyện như với một người bạn hiểu biết về du học</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 max-w-2xl mx-auto border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">Tất cả chỉ trong một khung chat đơn giản</h3>
            <p className="text-lg text-muted-foreground mb-6">Không cần tải app, không cần kiến thức kỹ thuật.</p>
            <Button asChild size="lg" className="group">
              <Link href="/profile">
                Trải nghiệm ngay
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
