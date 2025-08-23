"use client";

import { motion } from "framer-motion";
import { School, CheckCircle, DollarSign, BarChart, MessageCircle } from "lucide-react";

const solutions = [
  {
    icon: School,
    text: "Tư vấn chọn trường & ngành phù hợp",
    color: "text-blue-500",
  },
  {
    icon: CheckCircle,
    text: "Tạo checklist hồ sơ pháp lý theo quốc gia",
    color: "text-green-500",
  },
  {
    icon: DollarSign,
    text: "Ước tính chi phí học & sinh hoạt",
    color: "text-yellow-500",
  },
  {
    icon: BarChart,
    text: "Theo dõi tiến độ chuẩn bị",
    color: "text-purple-500",
  },
  {
    icon: MessageCircle,
    text: "Trợ lý AI hỏi đáp 24/7",
    color: "text-indigo-500",
  },
];

export default function SolutionsSimple() {
  return (
    <section className="py-16 bg-background/60 backdrop-blur-sm relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-mono font-bold text-foreground mb-8">🎯 ScholarAI sẽ giúp bạn:</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 rounded-lg p-6 border border-muted/20 hover:bg-white/80">
              <div className="flex flex-col items-center text-center gap-4">
                <div className={`p-4 rounded-full bg-muted/80 ${solution.color}`}>
                  <solution.icon className="w-8 h-8" />
                </div>
                <p className="text-lg font-sans text-foreground leading-relaxed">{solution.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
