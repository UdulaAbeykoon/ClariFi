"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Calculator,
  TrendingUp,
  DollarSign,
  FileText,
  Shield,
  Building2,
} from "lucide-react"

interface DocumentationSidebarProps {
  collapsed?: boolean
}

const documentationSections = [
  {
    title: "Getting Started",
    icon: BookOpen,
    items: ["Platform Overview", "Account Setup", "Navigation Guide"],
  },
  {
    title: "SEC Filings",
    icon: FileText,
    items: ["Form 10-K", "Form 10-Q", "Form 8-K", "Proxy Statements", "Registration Statements"],
  },
  {
    title: "Financial Analysis",
    icon: Calculator,
    items: ["Ratio Analysis", "Trend Analysis", "Peer Comparison", "Credit Analysis"],
  },
  {
    title: "Investment Research",
    icon: TrendingUp,
    items: ["Equity Valuation", "Fixed Income", "Alternative Investments", "Market Analysis"],
  },
  {
    title: "Risk Management",
    icon: Shield,
    items: ["Market Risk", "Credit Risk", "Operational Risk", "Liquidity Risk"],
  },
  {
    title: "Regulatory Compliance",
    icon: Building2,
    items: ["SOX Compliance", "Basel III", "Dodd-Frank", "MiFID II", "GDPR Impact"],
  },
  {
    title: "Corporate Finance",
    icon: DollarSign,
    items: ["Capital Structure", "M&A Analysis", "IPO Process", "Dividend Policy"],
  },
]

export function DocumentationSidebar({ collapsed = false }: DocumentationSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["Getting Started"])

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((section) => section !== title) : [...prev, title],
    )
  }

  if (collapsed) {
    return null
  }

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border h-full">
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-lg font-sans font-semibold text-sidebar-foreground text-glow">Documentation</h2>
        <p className="text-sm text-muted-foreground mt-1">Finance & Regulatory Guides</p>
      </div>
      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-4 space-y-2">
          {documentationSections.map((section) => {
            const Icon = section.icon
            const isExpanded = expandedSections.includes(section.title)

            return (
              <div key={section.title} className="space-y-1">
                <Button
                  variant="ghost"
                  onClick={() => toggleSection(section.title)}
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/20 hover:text-primary transition-all duration-200 group"
                >
                  <Icon className="mr-3 h-4 w-4 group-hover:text-primary transition-colors" />
                  <span className="flex-1 text-left font-medium">{section.title}</span>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
                {isExpanded && (
                  <div className="ml-7 space-y-1 border-l border-border/30 pl-4">
                    {section.items.map((item) => (
                      <Button
                        key={item}
                        variant="ghost"
                        className="w-full justify-start text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40 mr-3"></div>
                        {item}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
