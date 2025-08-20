"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Users, Target } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="finance-gradient min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 text-glow">
                How to Break Into
                <span className="text-primary block mt-2">Wall Street</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                Master the strategies, skills, and insider knowledge you need to launch your finance career
              </p>

              <Link href="/docs">
                <Button size="lg" className="text-lg px-8 py-6 glow-effect hover:scale-105 transition-all duration-300">
                  Launch Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-card">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Market Insights</h3>
                <p className="text-muted-foreground">Learn from real market data and industry trends that matter</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Network Building</h3>
                <p className="text-muted-foreground">Connect with professionals and build relationships that last</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Career Strategy</h3>
                <p className="text-muted-foreground">Develop a clear path from where you are to where you want to be</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
