"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { DocumentationSidebar } from "@/components/documentation-sidebar"
import { DocumentationContent } from "@/components/documentation-content"
import { CopilotPanel } from "@/components/copilot-panel"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, PanelRightOpen } from "lucide-react"

export default function DocsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [copilotOpen, setCopilotOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-64px)] finance-gradient relative">
        <div className={`transition-all duration-300 ${sidebarCollapsed ? "w-0" : "w-80"} relative`}>
          <DocumentationSidebar collapsed={sidebarCollapsed} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-4 top-4 z-10 h-8 w-8 rounded-full bg-background border border-border shadow-lg hover:bg-accent"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className={`flex-1 transition-all duration-300 ${copilotOpen ? "mr-96" : ""}`}>
          <DocumentationContent />
        </div>

        <CopilotPanel isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />

        {!copilotOpen && (
          <Button
            onClick={() => setCopilotOpen(true)}
            className="fixed right-6 top-20 z-20 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg glow-effect"
            size="sm"
          >
            <PanelRightOpen className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        )}
      </div>
    </div>
  )
}
