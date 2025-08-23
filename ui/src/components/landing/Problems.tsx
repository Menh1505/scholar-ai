"use client";

import { motion } from "framer-motion";
import { AlertCircle, FileX, DollarSign, HelpCircle } from "lucide-react";

const problems = [
  {
    icon: HelpCircle,
    text: "Không biết chọn trường, ngành?",
    color: "text-red-500",
  },
  {
    icon: FileX,
    text: "Rối rắm với hồ sơ pháp lý?",
    color: "text-orange-500",
  },
  {
    icon: DollarSign,
    text: "Không rõ cần bao nhiều tiền để du học?",
    color: "text-yellow-500",
  },
  {
    icon: AlertCircle,
    text: "Không có ai hướng dẫn từng bước?",
    color: "text-blue-500",
  },
];

export default function ProblemsSimple() {
  return (
    <section className="py-16 bg-muted/40 backdrop-blur-sm relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-mono font-bold text-foreground mb-8">❓ Bạn đang gặp khó khăn?</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/60 backdrop-blur-sm shadow-sm rounded-lg p-6 hover:bg-white/70 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-muted/80 ${problem.color}`}>
                  <problem.icon className="w-6 h-6" />
                </div>
                <p className="text-lg font-sans text-foreground">{problem.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
