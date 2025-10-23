import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthDialog from "./AuthDialog";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const handleGetStarted = () => {
    if (!user) {
      setAuthDialogOpen(true);
    } else {
      navigate("/get-started");
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Falling Money Emojis */}
      <div className="absolute inset-0 z-0">
        <style>{`
          @keyframes fall {
            0% { transform: translateY(-100vh); }
            100% { transform: translateY(100vh); }
          }
          .falling-emoji {
            animation: fall linear infinite;
            opacity: 0.3;
          }
        `}</style>
        <div className="absolute left-10 text-2xl falling-emoji" style={{animationDelay: '0s', animationDuration: '8s'}}>💵</div>
        <div className="absolute left-1/4 text-xl falling-emoji" style={{animationDelay: '1s', animationDuration: '10s'}}>💸</div>
        <div className="absolute right-20 text-2xl falling-emoji" style={{animationDelay: '2s', animationDuration: '9s'}}>💵</div>
        <div className="absolute right-1/3 text-xl falling-emoji" style={{animationDelay: '3s', animationDuration: '12s'}}>💸</div>
        <div className="absolute left-1/3 text-lg falling-emoji" style={{animationDelay: '4s', animationDuration: '8s'}}>💵</div>
        <div className="absolute right-10 text-2xl falling-emoji" style={{animationDelay: '5s', animationDuration: '11s'}}>💸</div>
        <div className="absolute left-20 text-xl falling-emoji" style={{animationDelay: '6s', animationDuration: '9s'}}>💵</div>
        <div className="absolute right-1/4 text-lg falling-emoji" style={{animationDelay: '7s', animationDuration: '10s'}}>💸</div>
        <div className="absolute left-16 text-2xl falling-emoji" style={{animationDelay: '8s', animationDuration: '12s'}}>💵</div>
        <div className="absolute right-16 text-xl falling-emoji" style={{animationDelay: '9s', animationDuration: '8s'}}>💸</div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center flex items-center justify-center h-full">
        <div className="max-w-4xl mx-auto">
          <div className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-gray-900 mt-16">
            <div className="text-left max-w-fit mx-auto">
              <span className="block text-gray-900 text-2xl md:text-3xl -mb-2">How To</span>
              <span className="text-blue-600 text-4xl md:text-6xl relative">
                BREAK INTO WALL{" "}
                <span className="relative inline-block">
                  <img
                    src="/bulltop.png"
                    alt="Bull"
                    className="absolute -top-14 md:-top-13 left-1/2 transform -translate-x-1/10 h-12 md:h-16 w-auto object-contain z-10"
                  />
                  STREET
                </span>
              </span>
            </div>
          </div>


          <div className="flex justify-center">
            <style>{`
              .cssbuttons-io-button {
                background: #2563eb;
                color: white;
                font-family: inherit;
                padding: 0.35em;
                padding-left: 1.2em;
                font-size: 17px;
                font-weight: 500;
                border-radius: 0.9em;
                border: none;
                letter-spacing: 0.05em;
                display: flex;
                align-items: center;
                box-shadow: inset 0 0 1.6em -0.6em #1e40af;
                overflow: hidden;
                position: relative;
                height: 2.8em;
                padding-right: 3.3em;
                cursor: pointer;
              }

              .cssbuttons-io-button .icon {
                background: white;
                margin-left: 1em;
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 2.2em;
                width: 2.2em;
                border-radius: 0.7em;
                box-shadow: 0.1em 0.1em 0.6em 0.2em #1d4ed8;
                right: 0.3em;
                transition: all 0.3s;
              }

              .cssbuttons-io-button:hover .icon {
                width: calc(100% - 0.6em);
              }

              .cssbuttons-io-button .icon svg {
                width: 1.1em;
                transition: transform 0.3s;
                color: #2563eb;
              }

              .cssbuttons-io-button:hover .icon svg {
                transform: translateX(0.1em);
              }

              .cssbuttons-io-button:active .icon {
                transform: scale(0.95);
              }

              @keyframes scroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }

              .scroll-container {
                overflow: hidden;
                position: relative;
                width: 100%;
                mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
              }

              .scroll-content {
                display: flex;
                width: fit-content;
              }

              .scroll-content > div {
                display: flex;
                animation: scroll 30s linear infinite;
              }
            `}</style>
            <button onClick={handleGetStarted} className="cssbuttons-io-button">
              Get Started
              <div className="icon">
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          </div>

          {/* Trusted By Section */}
          <div className="mt-16">
            <p className="text-gray-600 text-sm mb-6 font-medium">Trusted by students from:</p>
            <div className="scroll-container">
              <div className="scroll-content">
                <div className="flex items-center gap-16 px-8">
                  <img src="/smithcom.png" alt="Smith School" className="h-12 grayscale opacity-60 hover:opacity-100 transition-opacity" />
                  <img src="/ivey.png" alt="Ivey Business School" className="h-12 grayscale opacity-60 hover:opacity-100 transition-opacity" />
                  <img src="/uoft.png" alt="University of Toronto" className="h-12 grayscale opacity-60 hover:opacity-100 transition-opacity" />
                  <img src="/ubc.png" alt="UBC Sauder" className="h-12 grayscale opacity-60 hover:opacity-100 transition-opacity" />
                  <img src="/smithcom.png" alt="Smith School" className="h-12 grayscale opacity-60 hover:opacity-100 transition-opacity" />
                  <img src="/ivey.png" alt="Ivey Business School" className="h-12 grayscale opacity-60 hover:opacity-100 transition-opacity" />
                  <img src="/uoft.png" alt="University of Toronto" className="h-12 grayscale opacity-60 hover:opacity-100 transition-opacity" />
                  <img src="/ubc.png" alt="UBC Sauder" className="h-12 grayscale opacity-60 hover:opacity-100 transition-opacity" />
                  <img src="/smithcom.png" alt="Smith School" className="h-12 grayscale opacity-60 hover:opacity-100 transition-opacity" />
                  <img src="/ivey.png" alt="Ivey Business School" className="h-12 grayscale opacity-60 hover:opacity-100 transition-opacity" />
                  <img src="/uoft.png" alt="University of Toronto" className="h-12 grayscale opacity-60 hover:opacity-100 transition-opacity" />
                  <img src="/ubc.png" alt="UBC Sauder" className="h-12 grayscale opacity-60 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <ArrowRight className="h-6 w-6 text-gray-600 rotate-90" />
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </section>
  );
};

export default Hero;