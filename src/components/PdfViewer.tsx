import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  FileText
} from "lucide-react";
import { usePdfContext } from "../contexts/PdfContext";

interface PdfViewerProps {
  moduleSlug?: string;
}

const PdfViewer = ({ moduleSlug }: PdfViewerProps) => {
  const { currentPage, setCurrentPage, totalPages, setTotalPages } = usePdfContext();
  const [zoom, setZoom] = useState(100);
  const [pageInput, setPageInput] = useState("1");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync page input with current page
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // PDF file mapping for each module
  const modulePdfs: { [key: string]: string } = {
    "business-valuation": "/modules/business-valuation/Financial Clarify Intro to Business Module 1.pdf"
  };

  const pdfUrl = moduleSlug ? modulePdfs[moduleSlug] : null;

  // Listen for scroll events in the PDF iframe to auto-update page number
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !pdfUrl) return;

    const handleMessage = (event: MessageEvent) => {
      // Listen for postMessage from PDF viewer about current page
      if (event.data && typeof event.data === 'object' && event.data.type === 'pageChanged') {
        const newPage = event.data.page;
        if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Also try to detect page changes through iframe content
    const checkPageChange = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          // Try to get the current page from the PDF viewer's URL hash
          const currentSrc = iframe.contentWindow?.location.href;
          if (currentSrc) {
            const pageMatch = currentSrc.match(/page=(\d+)/);
            if (pageMatch) {
              const detectedPage = parseInt(pageMatch[1]);
              if (detectedPage !== currentPage && detectedPage >= 1 && detectedPage <= totalPages) {
                setCurrentPage(detectedPage);
              }
            }
          }
        }
      } catch (e) {
        // Cross-origin restrictions prevent accessing iframe content
        // This is expected for PDF files
      }
    };

    // Check periodically for page changes
    const interval = setInterval(checkPageChange, 1000);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(interval);
    };
  }, [pdfUrl, currentPage, totalPages, setCurrentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setPageInput(newPage.toString());
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setPageInput(newPage.toString());
    }
  };

  const handlePageJump = () => {
    const page = parseInt(pageInput);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(50, prev - 25));
  };

  return (
    <div className="flex flex-col h-full">
      {/* PDF Controls */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Input
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={handlePageJump}
              onKeyDown={(e) => e.key === "Enter" && handlePageJump()}
              className="w-16 text-center text-sm"
            />
            <span className="text-sm text-muted-foreground">of {totalPages}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
            {zoom}%
          </span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Display Area */}
      <div className="flex-1 bg-muted/10 overflow-hidden">
        {pdfUrl ? (
          <div className="w-full h-full overflow-auto">
            <iframe
              ref={iframeRef}
              key={`pdf-${zoom}`}
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&page=${currentPage}&zoom=${zoom}`}
              className="border-none"
              style={{ 
                width: `${zoom}%`,
                height: `${zoom}%`,
                minWidth: '100%',
                minHeight: '100%'
              }}
              title="PDF Viewer"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
            <FileText className="h-16 w-16 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No PDF Available</h3>
            <p className="text-sm text-center">
              {moduleSlug 
                ? "PDF not found for this module. Please add a PDF file to the modules folder."
                : "Select a module to view its PDF content."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;