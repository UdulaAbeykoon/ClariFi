import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Clock, ChevronRight, ChevronDown } from "lucide-react";
import { api, type Note } from "@/lib/api";

interface NotesDrawerProps {
  docId: string;
  notes: Note[];
  onNoteSelect: (noteId: string) => void;
  selectedNoteId?: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotesDrawer = ({ docId, notes, onNoteSelect, selectedNoteId, isOpen, onOpenChange }: NotesDrawerProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem('clarifi-notes-drawer-open', JSON.stringify(isOpen));
  }, [isOpen]);


  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`border-r border-border bg-muted/30 flex flex-col transition-all duration-200 ${
      isOpen ? 'w-80' : 'w-12'
    }`}>
      {/* Toggle Button */}
      <div className="p-2 border-b border-border">
        <Button
          onClick={() => onOpenChange(!isOpen)}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
        >
          {isOpen ? (
            <>
              <ChevronDown className="h-4 w-4" />
              <span>Notes ({notes.length})</span>
            </>
          ) : (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-xs">Notes</span>
            </>
          )}
        </Button>
      </div>

      {isOpen && (
        <>
          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {searchQuery ? 'No matching notes' : 'No notes yet'}
              </div>
            ) : (
              filteredNotes.map((note) => (
                <Card
                  key={note.fileId}
                  className={`m-2 cursor-pointer border-2 transition-all duration-200 ${
                    selectedNoteId === note.fileId
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/50 hover:shadow-sm"
                  }`}
                  onClick={() => onNoteSelect(note.fileId)}
                >
                  <CardContent className="p-3">
                    <h4 className="font-medium text-foreground text-sm truncate mb-1">
                      {note.title}
                    </h4>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Page {note.pageNumber}</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(note.updatedAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotesDrawer;