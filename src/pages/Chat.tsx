import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm here to listen and support you. How are you feeling today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) return null;
  if (!user) return null;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    const updatedMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to start stream");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let assistantContent = "";

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Chat error:", error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 sm:pt-24 container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
        <Card className="h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] flex flex-col shadow-[var(--shadow-glow)]">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Your Wellness Companion
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                      : "bg-card border border-border"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border p-4 rounded-2xl">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <div className="p-4 sm:p-6 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
