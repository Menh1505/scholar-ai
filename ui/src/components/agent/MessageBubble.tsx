import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowRight } from "lucide-react";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  phase?: string;
}

interface MessageProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageProps> = ({ message }) => {
  // Custom components for markdown rendering
  const markdownComponents = {
    // Paragraphs with proper spacing
    p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,

    // Headings with appropriate styling
    h1: ({ children }: any) => <h1 className="text-lg font-bold mb-2 text-current">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-base font-bold mb-2 text-current">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-sm font-semibold mb-1 text-current">{children}</h3>,

    // Lists with proper spacing and icons
    ul: ({ children }: any) => <ul className="space-y-1 mb-2">{children}</ul>,
    ol: ({ children }: any) => <ol className="space-y-1 mb-2 list-decimal list-inside">{children}</ol>,
    li: ({ children }: any) => (
      <li className="flex items-start gap-2">
        <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-70" />
        <span className="flex-1">{children}</span>
      </li>
    ),

    // Strong text
    strong: ({ children }: any) => <strong className="font-semibold text-current">{children}</strong>,

    // Emphasized text
    em: ({ children }: any) => <em className="italic text-current">{children}</em>,

    // Code blocks
    code: ({ children, className }: any) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className={`px-1 py-0.5 rounded text-xs font-mono ${message.isUser ? "bg-blue-500 bg-opacity-30" : "bg-gray-200 text-gray-800"}`}>
            {children}
          </code>
        );
      }
      return (
        <pre className={`p-2 rounded text-xs font-mono overflow-x-auto mb-2 ${message.isUser ? "bg-blue-500 bg-opacity-30" : "bg-gray-200 text-gray-800"}`}>
          <code>{children}</code>
        </pre>
      );
    },

    // Blockquotes
    blockquote: ({ children }: any) => (
      <blockquote className={`border-l-2 pl-3 py-1 mb-2 italic ${message.isUser ? "border-blue-300" : "border-gray-400"}`}>{children}</blockquote>
    ),

    // Links
    a: ({ href, children }: any) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`underline hover:no-underline ${message.isUser ? "text-blue-100" : "text-blue-600"}`}>
        {children}
      </a>
    ),
  };

  // Function to add custom icons to text
  const processContentWithIcons = (content: string) => {
    // Replace common patterns with icons
    return content
      .replace(/\[✓\]/g, "✅")
      .replace(/\[!\]/g, "⚠️")
      .replace(/\[i\]/g, "ℹ️")
      .replace(/\[tip\]/g, "💡")
      .replace(/\[star\]/g, "⭐")
      .replace(/\[check\]/g, "✅")
      .replace(/\[warning\]/g, "⚠️")
      .replace(/\[info\]/g, "ℹ️")
      .replace(/\[bulb\]/g, "💡");
  };

  const processedContent = processContentWithIcons(message.content);

  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm ${
          message.isUser ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-900 border border-gray-200"
        }`}>
        <div className="text-sm leading-relaxed">
          <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
            {processedContent}
          </ReactMarkdown>
        </div>
        <div className={`text-xs mt-2 ${message.isUser ? "text-blue-100" : "text-gray-500"}`}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};
