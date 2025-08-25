"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, TrendingUp, Users, Target, BookOpen, Zap, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/navbar"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24">
        <div className="finance-gradient min-h-screen flex items-center justify-center relative">
          {/* Falling Money Background - covers entire hero section */}
          <div className="money-rain absolute inset-0">
            <div className="money-bill">💵</div>
            <div className="money-bill">💸</div>
            <div className="money-bill">💸</div>
            <div className="money-bill">💵</div>
            <div className="money-bill">💵</div>
            <div className="money-bill">💸</div>
            <div className="money-bill">💵</div>
            <div className="money-bill">💵</div>
            <div className="money-bill">💸</div>
            <div className="money-bill">💵</div>
            <div className="money-bill">💵</div>
            <div className="money-bill">💸</div>
            <div className="money-bill">💵</div>
            <div className="money-bill">💸</div>
            <div className="money-bill">💸</div>
          </div>
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Main Heading */}
              <div className="space-y-6 mb-12">
                <div className="relative text-center">
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 -translate-x-119 text-2xl md:text-3xl font-bold text-black">How To</div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight">
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      BREAK INTO WALL{' '}
                      <span className="relative inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        <Image 
                          src="/bulltop.png" 
                          alt="Bull" 
                          width={90} 
                          height={65}
                          className="absolute -top-12 left-1/2 transform translate-x-1/2 z-10"
                        />
                        STREET
                      </span>
                    </span>
                  </h1>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex justify-center items-center mb-16">
                <Link href="/docs">
                  <button className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-blue-300 hover:before:[box-shadow:_20px_20px_20px_30px_#2563eb] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4 origin-left hover:decoration-2 hover:text-blue-300 relative bg-neutral-800 h-16 w-96 border text-left p-3 text-gray-50 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content-[''] before:right-1 before:top-1 before:z-10 before:bg-blue-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content-[''] after:bg-blue-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to <span className="text-primary">Succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From interview preparation to networking strategies, we provide all the tools 
              and knowledge you need to break into Wall Street.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Market Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Stay ahead with real-time market analysis, industry trends, and expert commentary 
                  from Wall Street veterans.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Network Building</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with alumni, industry professionals, and fellow aspiring finance 
                  professionals through our exclusive community.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Career Strategy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Develop a personalized roadmap with milestone tracking and expert guidance 
                  to reach your finance career goals.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Interview Prep</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Master technical questions, behavioral interviews, and case studies with 
                  our comprehensive preparation materials.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Fast Track</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Accelerated learning paths and priority access to opportunities for 
                  ambitious professionals ready to move quickly.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Success Guarantee</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We're so confident in our approach that we offer a success guarantee 
                  backed by our proven track record.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Wall Street Journey?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Join thousands of successful professionals who have transformed their careers 
              with our proven methodology.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 hover:scale-105 transition-all duration-300">
              <Link href="/docs">
                Begin Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
