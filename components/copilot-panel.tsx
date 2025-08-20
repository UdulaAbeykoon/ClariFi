"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { X, Send, Sparkles, Code, FileText, Calculator } from "lucide-react"

interface CopilotPanelProps {
  isOpen: boolean
  onClose: () => void
}

const suggestions = [
  { icon: FileText, text: "Explain SEC Form 10-K requirements", category: "Regulatory" },
  { icon: Calculator, text: "Calculate debt-to-equity ratio", category: "Analysis" },
  { icon: Code, text: "Generate compliance checklist", category: "Compliance" },
]

export function CopilotPanel({ isOpen, onClose }: CopilotPanelProps) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "I'm your finance documentation assistant. I can help you understand regulations, analyze financial data, and navigate compliance requirements. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      {
        role: "assistant",
        content:
          "I understand you're asking about " +
          input +
          ". Let me provide you with detailed information based on current financial regulations and best practices...",
      },
    ])
    setInput("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-64px)] w-96 bg-background border-l border-border shadow-2xl z-30">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Finance Copilot</h3>
            <p className="text-xs text-muted-foreground">AI-powered assistance</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)] p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <Card
                className={`max-w-[80%] p-3 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border-border/50"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </Card>
            </div>
          ))}
        </div>

        {messages.length === 1 && (
          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Quick suggestions:</p>
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3 hover:bg-primary/5 hover:border-primary/30 bg-transparent"
                  onClick={() => setInput(suggestion.text)}
                >
                  <Icon className="h-4 w-4 mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{suggestion.text}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.category}</p>
                  </div>
                </Button>
              )
            })}
          </div>
        )}
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about regulations, compliance, or analysis..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="bg-primary hover:bg-primary/90">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
