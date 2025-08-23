"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { School, FileText, DollarSign, Calendar, Bot } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: School,
    emoji: "🏫",
    title: "Tư vấn chọn trường thông minh",
    color: "text-blue-500",
  },
  {
    icon: FileText,
    emoji: "📑",
    title: "Checklist giấy tờ pháp lý",
    color: "text-green-500",
  },
  {
    icon: DollarSign,
    emoji: "💰",
    title: "Tính chi phí, học bổng, tài chính",
    color: "text-yellow-500",
  },
  {
    icon: Calendar,
    emoji: "🗓️",
    title: "Theo dõi tiến độ",
    color: "text-purple-500",
  },
  {
    icon: Bot,
    emoji: "🤖",
    title: "Trợ lý AI đồng hành xuyên suốt",
    color: "text-indigo-500",
  },
];

export default function FeaturesSimple() {
  return (
    <section className="py-16 bg-muted/30 backdrop-blur-sm relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-mono font-bold text-foreground mb-8">⚙️ Các tính năng nổi bật</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/70 backdrop-blur-sm shadow-sm rounded-lg p-6 border border-muted/20 hover:shadow-md hover:bg-white/80 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{feature.emoji}</div>
                <div className={`p-3 rounded-full bg-muted/80 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-mono font-semibold text-foreground flex-1">{feature.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center">
          <Button asChild variant="outline" size="lg" className="font-mono">
            <Link href="/features">👉 Xem chi tiết tính năng</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
