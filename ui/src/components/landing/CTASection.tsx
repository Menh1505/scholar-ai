"use client";

import { motion } from "framer-motion";

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
