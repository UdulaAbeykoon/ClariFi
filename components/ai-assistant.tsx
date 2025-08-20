"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X, Send, Sparkles, Bot } from "lucide-react"

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI finance assistant. I can help you navigate SEC filings, understand regulatory requirements, analyze financial statements, and answer compliance questions. What would you like to explore?",
    },
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return

    setMessages((prev) => [...prev, { role: "user", content: message }])
    setMessage("")

    setTimeout(() => {
      const responses = [
        "I can help you analyze that SEC filing. Let me break down the key financial metrics and risk factors for you.",
        "Based on the latest regulatory updates, here's what you need to know about compliance requirements...",
        "For that financial ratio analysis, I recommend focusing on liquidity, profitability, and leverage metrics. Here's how to interpret them:",
        "That's a great question about risk management. Let me explain the current best practices and regulatory frameworks.",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: randomResponse,
        },
      ])
    }, 1000)
  }

  return (
    <>
      {/* AI Assistant Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-2xl z-50 glow-effect group"
        size="icon"
      >
        <div className="relative">
          <Bot className="h-7 w-7 text-primary-foreground" />
          <Sparkles className="h-4 w-4 text-primary-foreground absolute -top-1 -right-1 group-hover:animate-pulse" />
        </div>
      </Button>

      {/* AI Assistant Chat Interface */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-end p-6">
          <Card className="w-96 h-[600px] flex flex-col border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/50">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-sans font-semibold text-glow">AI Finance Assistant</CardTitle>
                  <p className="text-xs text-muted-foreground">Powered by Clarify</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4 p-4">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground ml-8 shadow-lg"
                        : "bg-card border border-border/50 text-card-foreground mr-8 shadow-sm"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium text-primary">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/50 pt-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask about SEC filings, compliance, risk management..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="bg-primary hover:bg-primary/90 glow-effect"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  AI responses are for informational purposes only
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
