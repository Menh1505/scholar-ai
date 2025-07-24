"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Key, Users, Sparkles, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

const securityFeatures = [
  {
    icon: Users,
    title: "ID hội thoại riêng biệt",
    description: "Mỗi người dùng có một ID hội thoại riêng biệt – thông tin không lẫn, không chia sẻ",
  },
  {
    icon: Key,
    title: "API công khai",
    description: "Hệ thống hoạt động công khai qua API, có thể mở rộng theo nhu cầu từng người",
  },
  {
    icon: Shield,
    title: "Không cần đăng ký rườm rà",
    description: "Chỉ cần bắt đầu chat – không yêu cầu tài khoản phức tạp",
  },
];

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-12">Bảo mật & Minh bạch</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10 rounded-3xl transform -rotate-1"></div>

            {/* Main content */}
            <div className="relative bg-card border border-primary/20 rounded-3xl p-12 max-w-4xl mx-auto">
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Bắt đầu <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">miễn phí</span> ngay hôm nay
              </h2>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                ScholarAI hiện đang trong giai đoạn thử nghiệm công khai – bạn có thể sử dụng <span className="text-primary font-semibold">100% miễn phí</span>
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8 text-lg">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Không cần cài đặt
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Không cần thẻ tín dụng
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Chỉ cần bạn có giấc mơ
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="text-xl px-12 py-6 group">
                  <Link href="/profile">
                    <Heart className="mr-2 w-6 h-6" />
                    Bắt đầu hành trình du học
                    <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="text-xl px-12 py-6">
                  <Link href="/signin">Đã có tài khoản? Đăng nhập</Link>
                </Button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
                className="mt-8 text-sm text-muted-foreground">
                Tham gia cùng hàng nghìn bạn trẻ đã tin tưởng ScholarAI
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Final encouragement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16">
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-4">Hành trình của bạn bắt đầu từ đây 🚀</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Đừng để ước mơ du học chỉ là ước mơ. Hãy để ScholarAI đồng hành cùng bạn biến giấc mơ thành hiện thực.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
