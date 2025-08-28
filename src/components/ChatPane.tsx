import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, FileText, Loader2, AlertCircle, Database, ArrowDown } from "lucide-react";
import { getChatCompletion, isCerebrasConfigured } from "@/lib/cerebrasClient";
import { testCerebrasConnection } from "@/lib/testOpenAI";
import { askRAG } from "@/lib/ragService";
import { ingestPdf } from "@/lib/pdfIngestion";
import { usePdfContext } from "../contexts/PdfContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  citations?: Array<{
    page_start: number;
    page_end: number;
  }>;
}

const ChatPane = () => {
  const { currentPage } = usePdfContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: isCerebrasConfigured() 
        ? "Hello! I'm your business study assistant powered by Cerebras. I can answer questions strictly from the Business Valuation PDF using advanced retrieval technology. Ask me anything about the topics covered in your textbook and I'll provide concise, accurate answers with page references."
        : "Hello! I'm your business study assistant, but I need a Cerebras API key to function. Please check your environment configuration.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const container = messagesContainerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Show scroll button if user scrolled up more than 100px from bottom
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
    
    // Show top indicator if user scrolled down from the top
    setShowTopIndicator(scrollTop > 50);
  };

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added, but only if user was already near bottom
    if (!messagesContainerRef.current) return;
    
    const container = messagesContainerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const wasNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    
    if (wasNearBottom) {
      // Small delay to ensure DOM is updated
      setTimeout(() => scrollToBottom(), 100);
    } else {
      // User has scrolled up, don't auto-scroll but show the scroll button
      setShowScrollButton(true);
    }
  }, [messages]);

  useEffect(() => {
    // Test Cerebras connection on component mount
    if (isCerebrasConfigured()) {
      console.log('Testing Cerebras connection...');
      testCerebrasConnection();
    }
    
    // Test Supabase connection
    const testSupabase = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
        );
        
        // Test basic connection
        const { data, error } = await supabase.from('pdf_chunks').select('count').limit(1);
        if (error) {
          console.warn('Supabase connection test failed:', error);
          console.log('You may need to run the database setup. Check SETUP_DATABASE.sql file.');
        } else {
          console.log('✅ Supabase connected successfully');
        }
      } catch (err) {
        console.error('Supabase test error:', err);
      }
    };
    
    testSupabase();
  }, []);

  // Keyboard shortcuts for scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + End - scroll to bottom
      if ((e.ctrlKey || e.metaKey) && e.key === 'End') {
        e.preventDefault();
        scrollToBottom();
      }
      // Ctrl/Cmd + Home - scroll to top  
      if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
        e.preventDefault();
        messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isCerebrasConfigured()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsLoading(true);
    setError(null);

    try {
      // Use RAG to answer from the Business Valuation PDF
      const ragResponse = await askRAG({
        question: currentInput,
        pdf_id: 'business-valuation',
        currentPage: currentPage
      });

      if (ragResponse.error) {
        setError(ragResponse.error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Sorry, I encountered an error: ${ragResponse.error}. Please try again.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } else {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: ragResponse.answer,
          timestamp: new Date(),
          citations: ragResponse.citations
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('RAG error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an unexpected error. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setError("Failed to get AI response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const insertCurrentPage = () => {
    const pageText = ` [Page ${currentPage}] `;
    setInputMessage(prev => prev + pageText);
  };

  const handleIngestPdf = async () => {
    setIsIngesting(true);
    setError(null);

    try {
      // Try multiple possible paths for the PDF file
      const possiblePaths = [
        '/modules/business-valuation/Financial Clarify Intro to Business Module 1.pdf',
        '/public/modules/business-valuation/Financial Clarify Intro to Business Module 1.pdf',
        './modules/business-valuation/Financial Clarify Intro to Business Module 1.pdf'
      ];

      let response;
      let lastError;
      
      for (const path of possiblePaths) {
        try {
          console.log(`Attempting to fetch PDF from: ${path}`);
          response = await fetch(path);
          if (response.ok) {
            console.log(`Successfully fetched PDF from: ${path}`);
            break;
          } else {
            console.warn(`Failed to fetch from ${path}: ${response.status}`);
            lastError = `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (fetchError) {
          console.warn(`Fetch error for ${path}:`, fetchError);
          lastError = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error';
        }
      }

      if (!response || !response.ok) {
        throw new Error(`Failed to fetch PDF from any path. Last error: ${lastError}`);
      }

      console.log('Starting PDF buffer processing...');
      const pdfBuffer = await response.arrayBuffer();
      console.log(`PDF buffer size: ${pdfBuffer.byteLength} bytes`);
      
      const result = await ingestPdf(new Uint8Array(pdfBuffer), 'business-valuation');

      if (result.success) {
        const successMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `✅ PDF ingestion completed successfully! Processed ${result.chunksProcessed} chunks. You can now ask questions about the Business Valuation content.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
      } else {
        throw new Error(result.error || 'Ingestion failed');
      }
    } catch (error) {
      console.error('Ingestion error:', error);
      
      let errorMsg = 'Unknown error';
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      // More specific error messages
      let helpText = '';
      if (errorMsg.includes('Failed to extract text from PDF')) {
        helpText = ' The PDF might be image-based or corrupted. Try a different PDF or check the console for more details.';
      } else if (errorMsg.includes('Failed to generate embedding')) {
        helpText = ' There was an issue processing the text for search. Check your network connection.';
      } else if (errorMsg.includes('Failed to fetch PDF')) {
        helpText = ' Could not load the PDF file. Make sure the file exists in public/modules/business-valuation/.';
      } else if (errorMsg.includes('Supabase')) {
        helpText = ' Database connection failed. Make sure you ran the SETUP_DATABASE.sql script.';
      }
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `❌ Failed to ingest PDF: ${errorMsg}${helpText}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setError("PDF ingestion failed");
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">AI Study Assistant</h3>
              <p className="text-sm text-muted-foreground">Business-focused explanations and summaries</p>
            </div>
          </div>
          {!isCerebrasConfigured() && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-xs">
              <AlertCircle className="h-3 w-3" />
              <span>Cerebras API Key Missing</span>
            </div>
          )}
          {isCerebrasConfigured() && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => testCerebrasConnection()}
                className="text-xs"
              >
                Test Cerebras
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleIngestPdf}
                disabled={isIngesting}
                className="text-xs"
              >
                {isIngesting ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Ingesting...
                  </>
                ) : (
                  <>
                    <Database className="h-3 w-3 mr-1" />
                    Ingest PDF
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-800 rounded-md text-xs flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 relative scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Top scroll indicator */}
        {showTopIndicator && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-primary/20 to-transparent z-10 pointer-events-none" />
        )}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <Card className={`max-w-[80%] ${
              message.role === "user" 
                ? "bg-gradient-primary text-white" 
                : "bg-card border-border"
            }`}>
              <CardContent className="p-3">
                <div className="flex items-start space-x-2">
                  {message.role === "assistant" && (
                    <Bot className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                  )}
                  {message.role === "user" && (
                    <User className="h-4 w-4 mt-1 text-white flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm leading-relaxed ${
                      message.role === "user" ? "text-white" : "text-foreground"
                    }`}>
                      {message.content}
                    </p>
                    <p className={`text-xs mt-2 ${
                      message.role === "user" ? "text-white/70" : "text-muted-foreground"
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-card border-border">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <div className="flex items-center space-x-1">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
        
        {/* Scroll to bottom button */}
        {showScrollButton && (
          <div className="absolute bottom-4 right-4">
            <Button
              onClick={scrollToBottom}
              size="sm"
              className="rounded-full p-2 shadow-lg bg-primary hover:bg-primary/90"
              title="Scroll to bottom"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-muted/30">
        
        <div className="flex items-end space-x-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask questions about the Business Valuation PDF - I'll answer with page references..."
            className="flex-1 min-h-[2.5rem] max-h-32 resize-none"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || !isCerebrasConfigured()}
            className="bg-gradient-primary"
            title={!isCerebrasConfigured() ? "Cerebras API key required" : "Send message"}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPane;