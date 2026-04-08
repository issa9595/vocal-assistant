"use client";

import type { Message } from "@/types/message";

const formatTimestamp = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return "";
  return dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`
        flex items-end gap-2
        ${isUser ? "justify-end" : "justify-start"}
      `}
    >
      <div
        className={`
          max-w-[85%] px-4 py-3 rounded-large
          ${isUser
            ? "bg-[var(--color-brand-pink)] text-[var(--color-brand-black)] rounded-br-md"
            : "bg-[#9dc0bc30] text-[var(--color-brand-black)] rounded-bl-md"
          }
        `}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span
          className={`
            text-xs mt-1 block
            ${isUser ? "text-[#3D3D3D99]" : "text-[#3D3D3D66]"}
          `}
        >
          {formatTimestamp(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
