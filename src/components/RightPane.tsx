import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PenTool, MessageCircle } from "lucide-react";
import NotesPane from "./NotesPane";
import ChatPane from "./ChatPane";
import { appStorage } from "../lib/storage";

type ActivePane = "notes" | "chat";

const RightPane = () => {
  const [activePane, setActivePane] = useState<ActivePane>("notes");
  const [notesHeight, setNotesHeight] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const savedPane = appStorage.getActivePane() as ActivePane;
    const savedHeight = appStorage.getNotesHeight();
    
    setActivePane(savedPane);
    setNotesHeight(savedHeight);
  }, []);

  const handlePaneChange = (pane: ActivePane) => {
    setActivePane(pane);
    appStorage.setActivePane(pane);
  };

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const container = document.getElementById("right-pane-container");
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const newHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100;
        
        // Constrain between 20% and 80%
        const constrainedHeight = Math.min(80, Math.max(20, newHeight));
        setNotesHeight(constrainedHeight);
        
        // Save to localStorage
        appStorage.setNotesHeight(constrainedHeight);
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
    <div id="right-pane-container" className="flex flex-col h-full">
      {/* Tab Bar */}
      <div className="flex border-b border-border bg-muted/30">
        <Button
          variant={activePane === "notes" ? "default" : "ghost"}
          onClick={() => handlePaneChange("notes")}
          className="rounded-none border-r border-border flex-1 justify-center"
        >
          <PenTool className="h-4 w-4 mr-2" />
          Notes
        </Button>
        <Button
          variant={activePane === "chat" ? "default" : "ghost"}
          onClick={() => handlePaneChange("chat")}
          className="rounded-none flex-1 justify-center"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask AI
        </Button>
      </div>

      {/* Single Pane Mode */}
      {activePane === "notes" && (
        <div className="flex-1">
          <NotesPane />
        </div>
      )}

      {activePane === "chat" && (
        <div className="flex-1">
          <ChatPane />
        </div>
      )}
    </div>
  );
};

export default RightPane;