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
    <section className="py-10 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        {/* Final encouragement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-4">Hành trình của bạn bắt đầu từ đây 🚀</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Đừng để ước mơ du học chỉ là ước mơ. Hãy để ScholarAI đồng hành cùng bạn biến giấc mơ thành hiện thực.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
