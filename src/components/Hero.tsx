import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Business students studying" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Smart Learning for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-glow to-accent">
              Business Students
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Master business concepts with our AI-powered platform. View PDFs, take smart notes, 
            and get instant explanations - all in one seamless experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/get-started">
              <Button 
                size="lg" 
                className="bg-white text-study-secondary hover:bg-gray-100 shadow-glow text-lg px-8 py-4 h-auto font-semibold"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 h-auto font-semibold backdrop-blur-sm"
              onClick={() => {
                const element = document.getElementById("features");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-glow">AI-Powered</div>
              <div className="text-gray-300">Smart Assistance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-glow">PDF + Notes</div>
              <div className="text-gray-300">Side by Side</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-glow">Auto-Save</div>
              <div className="text-gray-300">Never Lose Work</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <ArrowRight className="h-6 w-6 text-white rotate-90" />
        </div>
      </div>
    </section>
  );
};

export default Hero;