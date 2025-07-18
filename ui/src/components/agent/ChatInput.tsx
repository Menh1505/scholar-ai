import React, { useRef } from "react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  loading: boolean;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export const ChatInput: React.FC<ChatInputProps> = ({ inputMessage, setInputMessage, onSendMessage, loading, textareaRef }) => {
  const localTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRefToUse = textareaRef || localTextareaRef;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      console.log("sending message");
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-2">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <textarea
            ref={textareaRefToUse}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32"
            rows={1}
            disabled={loading}
          />
        </div>
        <Button onClick={onSendMessage} disabled={!inputMessage.trim() || loading} className="px-2">
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};
