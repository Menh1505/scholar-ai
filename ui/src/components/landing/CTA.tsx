"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus, Rocket } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background/60 to-accent/5 backdrop-blur-sm relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-mono font-bold text-foreground mb-6">🚀 Sẵn sàng bắt đầu?</h2>
          <p className="text-xl font-sans text-muted-foreground mb-8 max-w-2xl mx-auto">🎁 Dùng thử miễn phí – Không cần thẻ thanh toán</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
          <Button asChild size="lg" className="text-lg font-mono font-semibold px-8 py-6 group min-w-[250px]">
            <Link href="/agent">
              <MessageCircle className="mr-2 w-5 h-5" />
              👉 Trò chuyện với ScholarAI
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="text-lg font-sans px-8 py-6 min-w-[250px]">
            <Link href="/profile">
              <UserPlus className="mr-2 w-5 h-5" />
              👉 Tạo tài khoản miễn phí
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-mono">
            <Rocket className="w-4 h-4" />
            Bắt đầu hành trình du học của bạn ngay hôm nay!
          </div>
        </motion.div>
      </div>
    </section>
  );
}
