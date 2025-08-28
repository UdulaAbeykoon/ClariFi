import { useState, useEffect } from "react";
import PdfViewer from "./PdfViewer";
import RightPane from "./RightPane";
import { appStorage } from "../lib/storage";
import { PdfProvider } from "../contexts/PdfContext";

interface SplitContainerProps {
  moduleSlug?: string;
}

const SplitContainer = ({ moduleSlug }: SplitContainerProps) => {
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    // Load saved split position
    const saved = appStorage.getMainSplit();
    setLeftWidth(saved);
  }, []);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const container = document.getElementById("split-container");
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        
        // Constrain between 20% and 80%
        const constrainedWidth = Math.min(80, Math.max(20, newLeftWidth));
        setLeftWidth(constrainedWidth);
        
        // Save to localStorage
        appStorage.setMainSplit(constrainedWidth);
      }
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing]);

  return (
    <PdfProvider>
      <div id="split-container" className="flex h-full relative">
        {/* Left Panel - PDF Viewer */}
        <div 
          className="bg-card border-r border-border overflow-hidden"
          style={{ width: `${leftWidth}%` }}
        >
          <PdfViewer moduleSlug={moduleSlug} />
        </div>

        {/* Resize Handle */}
        <div
          className="w-1 bg-border hover:bg-primary cursor-col-resize flex-shrink-0 transition-colors group relative"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-0 -left-1 -right-1 group-hover:bg-primary/20 transition-colors" />
        </div>

        {/* Right Panel */}
        <div 
          className="bg-card overflow-hidden"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <RightPane />
        </div>
      </div>
    </PdfProvider>
  );
};

export default SplitContainer;