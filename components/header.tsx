import { Button } from "@/components/ui/button"
import { Search, Menu, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <Image 
              src="/ClariFi.png" 
              alt="ClariFi Logo" 
              width={36} 
              height={36}
              className="rounded-xl glow-effect"
            />
            <span className="font-sans font-bold text-2xl text-foreground text-glow">ClariFi</span>
            <div className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary">AI-Powered</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
            >
              Documentation
            </Button>
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
            >
              Regulations
            </Button>
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
            >
              Compliance
            </Button>
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
            >
              API Reference
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search regulations, forms, guides..."
              className="pl-10 w-72 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
          >
            Get Started
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
