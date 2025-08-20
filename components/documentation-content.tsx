import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Star, TrendingUp, Shield, FileText, Building2, Users, Award, Zap } from "lucide-react"

const featuredTopics = [
  {
    title: "SEC Form 10-K Analysis",
    description: "Complete guide to analyzing annual reports and understanding key financial metrics and risks.",
    category: "SEC Filings",
    readTime: "22 min",
    popularity: 4.9,
    isNew: false,
    icon: FileText,
  },
  {
    title: "Basel III Capital Requirements",
    description:
      "Navigate the latest banking regulations and capital adequacy requirements for financial institutions.",
    category: "Compliance",
    readTime: "18 min",
    popularity: 4.7,
    isNew: true,
    icon: Building2,
  },
  {
    title: "Credit Risk Assessment Models",
    description: "Advanced techniques for evaluating counterparty risk and building robust credit scoring models.",
    category: "Risk Management",
    readTime: "25 min",
    popularity: 4.8,
    isNew: false,
    icon: Shield,
  },
  {
    title: "ESG Integration in Investment Analysis",
    description: "Framework for incorporating environmental, social, and governance factors into investment decisions.",
    category: "Investment",
    readTime: "20 min",
    popularity: 4.6,
    isNew: true,
    icon: TrendingUp,
  },
]

const quickLinks = [
  "SEC EDGAR Database",
  "Financial Ratio Calculator",
  "DCF Valuation Model",
  "Risk Assessment Toolkit",
  "Compliance Checklist",
  "Regulatory Calendar",
]

export function DocumentationContent() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8 space-y-12">
        <div className="text-center space-y-8 py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl"></div>
          <div className="relative space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1">
                <Award className="h-3 w-3 mr-1" />
                Industry Leading
              </Badge>
              <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-1">
                <Zap className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
            <h1 className="text-6xl font-sans font-bold text-foreground text-glow leading-tight">
              Enterprise Finance
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Intelligence Platform
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Trusted by Fortune 500 companies and leading financial institutions. Access comprehensive regulatory
              frameworks, real-time compliance monitoring, and AI-driven financial analysis tools.
            </p>
            <div className="flex items-center justify-center space-x-3 text-sm text-muted-foreground pt-4">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-primary" />
                <span>150,000+ Professionals</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-primary" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <div className="flex items-center space-x-1">
                <Award className="h-4 w-4 text-primary" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 pt-8">
            <Button size="lg" className="bg-primary hover:bg-primary/90 glow-effect px-10 py-4 text-lg font-semibold">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/30 text-primary hover:bg-primary/10 px-10 py-4 text-lg bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
        </div>

        <section className="bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-xl rounded-2xl p-10 border border-border/50 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-3">
              <div className="text-5xl font-sans font-bold text-primary text-glow">$2.4T</div>
              <div className="text-sm text-muted-foreground font-medium">Assets Under Management</div>
            </div>
            <div className="space-y-3">
              <div className="text-5xl font-sans font-bold text-primary text-glow">500+</div>
              <div className="text-sm text-muted-foreground font-medium">Enterprise Clients</div>
            </div>
            <div className="space-y-3">
              <div className="text-5xl font-sans font-bold text-primary text-glow">15K+</div>
              <div className="text-sm text-muted-foreground font-medium">Regulatory Documents</div>
            </div>
            <div className="space-y-3">
              <div className="text-5xl font-sans font-bold text-primary text-glow">99.8%</div>
              <div className="text-sm text-muted-foreground font-medium">Accuracy Rating</div>
            </div>
          </div>
        </section>

        {/* Featured Topics */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-sans font-semibold text-foreground text-glow">Featured Documentation</h2>
              <p className="text-lg text-muted-foreground mt-3">Essential guides for finance professionals</p>
            </div>
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 text-lg px-6">
              View All Guides <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredTopics.map((topic, index) => {
              const Icon = topic.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-2xl transition-all duration-500 cursor-pointer group border-border/50 hover:border-primary/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl hover:scale-[1.02]"
                >
                  <CardHeader className="space-y-4 p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-sm bg-primary/10 text-primary border-primary/20 px-3 py-1"
                        >
                          {topic.category}
                        </Badge>
                      </div>
                      {topic.isNew && (
                        <Badge className="bg-accent text-accent-foreground text-sm glow-effect px-3 py-1">New</Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl font-sans group-hover:text-primary transition-colors leading-tight">
                      {topic.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      {topic.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{topic.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 fill-current text-primary" />
                          <span className="font-medium">{topic.popularity}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform text-primary" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Quick Links */}
        <section className="space-y-8">
          <h2 className="text-3xl font-sans font-semibold text-foreground text-glow">Quick Access Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto p-6 text-left hover:bg-primary/10 hover:border-primary/50 bg-gradient-to-r from-card/60 to-card/30 backdrop-blur-sm border-border/50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-r from-primary to-accent glow-effect"></div>
                  <span className="text-base font-semibold">{link}</span>
                </div>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
