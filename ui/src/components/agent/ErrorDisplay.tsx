import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string;
  onClearError: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClearError }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
      <div className="flex justify-between items-center">
        <p className="text-red-700">{error}</p>
        <Button variant="ghost" size="sm" onClick={onClearError}>
          ×
        </Button>
      </div>
    </div>
  );
};
