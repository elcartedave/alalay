"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Welcome to AlalAI! I'm here to help you with questions, creative tasks, problem-solving, and more. What would you like to explore today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Focus input immediately after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, userMessage]),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      // Ensure input stays focused after response
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-transparent">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-border/20 bg-gradient-to-r from-mint/10 to-softgreen/10 backdrop-blur-sm">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-tealgreen to-seagreen">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">AlalAI</h1>
          <p className="text-sm text-muted-foreground">
            Your intelligent conversation partner
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-4 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex items-start ${
                message.role === "user" ? "ml-2" : "mr-2"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-tealgreen to-seagreen"
                    : "bg-gradient-to-br from-mint to-softgreen"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-deepaqua" />
                )}
              </div>
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                message.role === "user"
                  ? "bg-gradient-to-br from-tealgreen to-seagreen text-white shadow-tealgreen/20"
                  : "bg-white/80 backdrop-blur-sm text-foreground border border-border/20 shadow-mint/20"
              }`}
            >
              <div
                className={`whitespace-pre-wrap ${
                  message.role === "user" ? "text-white" : "text-slate-700"
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Animation */}
        {isLoading && (
          <div className="flex gap-4">
            <div className="flex items-start mr-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-mint to-softgreen">
                <Bot className="w-4 h-4 text-deepaqua" />
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm text-foreground border border-border/20 rounded-2xl px-4 py-3 shadow-sm shadow-mint/20">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-tealgreen rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-tealgreen rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-tealgreen rounded-full animate-bounce"></div>
                </div>
                <span className="text-sm text-muted-foreground">
                  AI is thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className=" border-t border-border/20 bg-white/5 backdrop-blur-sm">
        <div className="relative">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Type your message here..."
                className="w-full rounded-2xl border border-border/30 bg-white/80 backdrop-blur-sm px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tealgreen/50 focus:border-tealgreen/50 transition-all duration-200 shadow-sm"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-tealgreen to-seagreen text-white hover:from-seagreen hover:to-deepaqua focus:outline-none focus:ring-2 focus:ring-tealgreen/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-tealgreen/25 transform hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Helpful Tips */}
        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">
            Press Enter to send • Try asking about anything!
          </p>
        </div>
      </div>
    </div>
  );
}
