"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const features = [
  {
    id: "intro",
    title: "Giới thiệu ScholarAI",
    short: "Nền tảng AI hỗ trợ hành trình du học từ A đến Z.",
    detail: [
      "ScholarAI là trợ lý thông minh giúp bạn từng bước trên hành trình du học: từ tư vấn chọn trường, chuẩn bị giấy tờ, đến lập kế hoạch tài chính.",
      "Bạn có thể trò chuyện với AI bằng tiếng Việt hoặc tiếng Anh, không cần kiến thức chuyên sâu.",
    ],
  },
  {
    id: "select_school",
    title: "Tư vấn chọn trường và ngành",
    short: "AI phân tích hồ sơ và sở thích để gợi ý trường phù hợp.",
    detail: ["Bạn chỉ cần nhập các thông tin như học lực, sở thích, quốc gia muốn đến.", "AI sẽ gợi ý danh sách các trường phù hợp nhất, kèm lý do đề xuất."],
  },
  {
    id: "legal_checklist",
    title: "Checklist giấy tờ pháp lý",
    short: "Tạo danh sách các giấy tờ cần chuẩn bị và theo dõi tiến độ.",
    detail: [
      "AI sẽ hỏi bạn các câu hỏi và sinh ra danh sách giấy tờ như Visa, I-20, bảng điểm, hộ chiếu, tài chính.",
      "Bạn có thể đánh dấu hoàn thành từng giấy tờ và theo dõi trạng thái.",
    ],
  },
  {
    id: "cost_plan",
    title: "Tính toán chi phí và lập kế hoạch",
    short: "Dự toán học phí, sinh hoạt, bảo hiểm, tài chính cần chuẩn bị.",
    detail: ["Bạn nhập ngân sách và thời gian dự định du học.", "AI giúp tính toán chi tiết và gợi ý kế hoạch phù hợp."],
  },
  {
    id: "chat_agent",
    title: "Trò chuyện cùng AI",
    short: "Chat với trợ lý ảo để giải đáp mọi thắc mắc về du học.",
    detail: [
      "Bạn có thể hỏi bất kỳ điều gì như cách chọn ngành, cách xin học bổng, visa, việc làm sau tốt nghiệp...",
      "AI luôn sẵn sàng trả lời và điều hướng bạn tới bước tiếp theo phù hợp.",
    ],
  },
];

export default function FeaturesPage() {
  const [search, setSearch] = useState("");

  const filtered = features.filter((f) => f.title.toLowerCase().includes(search.toLowerCase()) || f.short.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" className="mb-4">
            <FaArrowLeft className="mr-2 w-4 h-4" />
            Quay về trang chủ
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-4">📘 Hướng dẫn sử dụng ScholarAI</h1>
        <p className="text-muted-foreground mb-6">Khám phá các tính năng chính và cách sử dụng để hỗ trợ hành trình du học của bạn.</p>
      </div>

      <Input placeholder="Tìm tính năng..." className="mb-6" value={search} onChange={(e) => setSearch(e.target.value)} />

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          {features.map((f) => (
            <TabsTrigger key={f.id} value={f.id}>
              {f.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((f) => (
              <Card key={f.id}>
                <CardHeader>
                  <CardTitle>{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-muted-foreground">{f.short}</p>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="info">
                      <AccordionTrigger>Chi tiết hướng dẫn</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-4 text-sm space-y-1">
                          {f.detail.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {features.map((f) => (
          <TabsContent key={f.id} value={f.id}>
            <Card>
              <CardHeader>
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{f.short}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {f.detail.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
