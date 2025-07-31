"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, UserCheck } from "lucide-react";

const targetAudience = [
  {
    icon: GraduationCap,
    emoji: "👨‍🎓",
    title: "Học sinh, sinh viên muốn đi du học",
    color: "text-blue-500",
  },
  {
    icon: Users,
    emoji: "👨‍👩‍👧‍👦",
    title: "Phụ huynh cần hỗ trợ con cái",
    color: "text-green-500",
  },
  {
    icon: UserCheck,
    emoji: "🙋‍♂️",
    title: "Người tự làm hồ sơ không cần tư vấn viên",
    color: "text-purple-500",
  },
];

export default function TargetAudience() {
  return (
    <section className="py-16 bg-background/60 backdrop-blur-sm relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-mono font-bold text-foreground mb-8">👨‍🎓 Phù hợp với ai?</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {targetAudience.map((audience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-8 border border-muted/20 text-center hover:bg-white/90 transition-all duration-300">
              <div className="mb-6">
                <div className="text-6xl mb-4">{audience.emoji}</div>
                <div className={`inline-flex p-4 rounded-full bg-muted/80 ${audience.color}`}>
                  <audience.icon className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-sans font-semibold text-foreground leading-relaxed">{audience.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
