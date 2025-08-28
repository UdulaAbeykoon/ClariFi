import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, PenTool, Save, AlertTriangle } from "lucide-react";
import SaveStatus from "./SaveStatus";
import NotesDrawer from "./NotesDrawer";
import { api, type Note } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface AppNote extends Note {
  content: string;
  isTemp?: boolean;
}

const NotesPane = () => {
  const { user, loading, initialized } = useAuth();
  
  // Core state
  const [notes, setNotes] = useState<AppNote[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // UI state
  const [isDrawerOpen, setIsDrawerOpen] = useState(() => {
    const stored = localStorage.getItem('clarifi-notes-drawer-open');
    return stored ? JSON.parse(stored) : true;
  });
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showTitleDialog, setShowTitleDialog] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  
  const moduleSlug = "business-valuation"; // Get from route params in real implementation
  
  const selectedNote = notes.find(n => n.fileId === selectedNoteId) || null;

  const fetchNotes = useCallback(async () => {
    if (!user?.id) return;
    console.log('📥 fetchNotes called - this might interfere with temp notes');
    try {
      const notesList = await api.listNotes(moduleSlug);
      console.log('📥 Fetched notes from API:', notesList);
      const notesWithContent = await Promise.all(
        notesList.map(async (note) => {
          try {
            const content = await api.getNote(note.fileId);
            return {
              ...note,
              content: content.body
            };
          } catch (error) {
            console.error(`Failed to load content for note ${note.fileId}:`, error);
            return {
              ...note,
              content: ""
            };
          }
        })
      );
      const sortedNotes = notesWithContent.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      console.log('📥 Setting notes to:', sortedNotes);
      setNotes(prev => {
        // Preserve any temp notes that might be in progress
        const tempNotes = prev.filter(note => note.isTemp);
        const merged = [...tempNotes, ...sortedNotes];
        console.log('📥 Merged notes (temp + fetched):', merged);
        return merged;
      });
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setError('Failed to load notes');
    }
  }, [user?.id, moduleSlug]);
  
  // Fetch notes on mount and when user/module changes
  // Use a ref to prevent unnecessary re-fetches
  const initialFetchDone = React.useRef(false);
  const lastFetchParams = React.useRef<{user: string | null, moduleSlug: string}>({ user: null, moduleSlug: '' });
  
  useEffect(() => {
    if (!user) {
      setNotes([]);
      setSelectedNoteId(null);
      initialFetchDone.current = false;
      return;
    }
    
    // Only fetch if this is the first time or if user/module actually changed
    const currentParams = { user: user.id, moduleSlug };
    const hasParamsChanged = (
      lastFetchParams.current.user !== currentParams.user ||
      lastFetchParams.current.moduleSlug !== currentParams.moduleSlug
    );
    
    if (!initialFetchDone.current || hasParamsChanged) {
      initialFetchDone.current = true;
      lastFetchParams.current = currentParams;
      fetchNotes();
    }
  }, [user?.id, moduleSlug]); // Removed fetchNotes to prevent infinite loops

  const handleNoteSelect = useCallback((noteId: string) => {
    if (isDirty && selectedNoteId) {
      const confirmSwitch = window.confirm('You have unsaved changes. Are you sure you want to switch notes?');
      if (!confirmSwitch) return;
    }
    setSelectedNoteId(noteId);
    setIsDirty(false);
    setError("");
    setSaveMessage("");
  }, [isDirty, selectedNoteId]);

  const openTitleDialog = () => {
    setNewNoteTitle("");
    setShowTitleDialog(true);
  };

  const handleCreateNoteWithTitle = async (title: string) => {
    if (!user || isCreating || !title.trim()) return;
    
    setIsCreating(true);
    setError("");
    setShowTitleDialog(false);
    
    const tempId = `temp-${Date.now()}`;
    const tempNote: AppNote = {
      fileId: tempId,
      title: title.trim(),
      content: "",
      docId: moduleSlug,
      pageNumber: 1,
      updatedAt: new Date().toISOString(),
      isTemp: true
    };
    
    // Optimistic UI update - add to beginning of list
    setNotes(prev => [tempNote, ...prev]);
    setSelectedNoteId(tempId);
    setIsDrawerOpen(true);
    localStorage.setItem('clarifi-notes-drawer-open', 'true');
    
    // Background Supabase insert
    try {
      console.log('🔄 Creating note with API...');
      const result = await api.createNote({
        title: tempNote.title,
        docId: moduleSlug,
        pageNumber: 1,
        body: ""
      });
      
      console.log('✅ API createNote success:', result);
      
      // Replace temp note with real note, ensuring it stays at top
      setNotes(prev => {
        console.log('🔄 Replacing temp note with real note...');
        const updated = prev.map(note => 
          note.fileId === tempId
            ? { ...note, fileId: result.fileId, updatedAt: result.updatedAt, isTemp: false }
            : note
        );
        console.log('✅ Notes after replacement:', updated);
        return updated;
      });
      setSelectedNoteId(result.fileId);
      console.log('✅ Note creation completed successfully');
      
    } catch (error) {
      console.error('❌ Failed to create note:', error);
      console.log('❌ Error details:', error.message);
      console.log('🚨 KEEPING temp note for debugging - normally would remove it');
      
      // Instead of removing the temp note immediately, show error but keep it visible for debugging
      // setNotes(prev => prev.filter(note => note.fileId !== tempId));
      // setSelectedNoteId(null);
      
      setError(`Failed to create note: ${error.message}`);
      
      // TODO: In production, uncomment the lines above to remove failed temp notes
    } finally {
      setIsCreating(false);
    }
  };

  const handleSave = async () => {
    if (!selectedNote || !user || !isDirty || isSaving) return;
    
    setIsSaving(true);
    setError("");
    setSaveMessage("");
    
    try {
      const now = new Date().toISOString();
      
      if (selectedNote.isTemp) {
        // This is an error case - temp notes should have been converted to real notes
        // in handleCreateNote. Handle it gracefully by treating as regular update
        const result = await api.updateNote(selectedNote.fileId, {
          title: selectedNote.title,
          body: selectedNote.content
        });
        
        setNotes(prev => prev.map(note => 
          note.fileId === selectedNote.fileId
            ? { ...note, isTemp: false, title: selectedNote.title, content: selectedNote.content, updatedAt: result.updatedAt }
            : note
        ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
        
      } else {
        // Update existing note
        const result = await api.updateNote(selectedNote.fileId, {
          title: selectedNote.title,
          body: selectedNote.content
        });
        
        // Update notes list with new timestamp and resort
        setNotes(prev => prev.map(note => 
          note.fileId === selectedNote.fileId
            ? { ...note, title: selectedNote.title, content: selectedNote.content, updatedAt: result.updatedAt }
            : note
        ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
      }
      
      setIsDirty(false);
      setSaveMessage("Saved ✓");
      
      // Clear success message after 2 seconds
      setTimeout(() => setSaveMessage(""), 2000);
      
    } catch (error) {
      console.error('Failed to save note:', error);
      setError('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (field: 'title' | 'content', value: string) => {
    if (!selectedNote) return;
    
    setNotes(prev => prev.map(note => 
      note.fileId === selectedNote.fileId
        ? { ...note, [field]: value }
        : note
    ));
    setIsDirty(true);
    setError("");
  };

  const handleDeleteNote = async (fileId: string) => {
    if (!user) return;
    
    const noteToDelete = notes.find(n => n.fileId === fileId);
    if (!noteToDelete) return;
    
    try {
      // Remove from UI immediately
      setNotes(prev => prev.filter(note => note.fileId !== fileId));
      
      if (selectedNoteId === fileId) {
        setSelectedNoteId(null);
        setIsDirty(false);
      }
      
      // Delete from database if it's not a temp note
      if (!noteToDelete.isTemp) {
        await api.deleteNote(fileId);
      }
      
    } catch (error) {
      console.error('Failed to delete note:', error);
      // Restore note to list on error
      setNotes(prev => [noteToDelete, ...prev].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ));
      setError('Failed to delete note. Please try again.');
    }
  };

  // Show loading state until auth is initialized
  if (!initialized || loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-muted animate-pulse mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Loading...</h3>
          <p className="text-muted-foreground">Initializing your notes...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <PenTool className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Sign in to Access Notes</h3>
          <p className="text-muted-foreground">Please sign in to create and manage your notes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Notes Drawer */}
      <NotesDrawer 
        docId={moduleSlug}
        notes={notes}
        onNoteSelect={handleNoteSelect}
        selectedNoteId={selectedNoteId}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with New Note Button */}
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <Button 
              onClick={openTitleDialog} 
              size="sm" 
              className="gap-2"
              disabled={isCreating}
            >
              <Plus className="h-4 w-4" />
              {isCreating ? "Creating..." : "New Note"}
            </Button>
            
            {selectedNote && (
              <div className="text-sm text-muted-foreground">
                Editing: <span className="font-medium">{selectedNote.title}</span>
              </div>
            )}
          </div>
          
          {/* Show database setup error if present */}
          {error && error.includes('Failed to create note') && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900 mb-2">Database Setup Required</h4>
                  <p className="text-sm text-red-800 mb-3">
                    The notes table doesn't exist in your Supabase database. Please run this SQL:
                  </p>
                  <div className="bg-red-100 p-3 rounded border text-xs font-mono text-red-900 mb-3 overflow-x-auto whitespace-pre-line">
{`-- Step 1: Create the notes table
CREATE TABLE public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  doc_id TEXT NOT NULL,
  page_number INTEGER,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 2: Enable RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies
CREATE POLICY "notes_select_policy" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notes_insert_policy" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_update_policy" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notes_delete_policy" ON public.notes FOR DELETE USING (auth.uid() = user_id);`}
                  </div>
                  <div className="flex gap-2 mb-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const sql = `-- Step 1: Create the notes table
CREATE TABLE public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  doc_id TEXT NOT NULL,
  page_number INTEGER,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 2: Enable RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies
CREATE POLICY "notes_select_policy" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notes_insert_policy" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_update_policy" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notes_delete_policy" ON public.notes FOR DELETE USING (auth.uid() = user_id);`;
                        navigator.clipboard.writeText(sql);
                        alert('SQL copied to clipboard!');
                      }}
                      className="text-xs"
                    >
                      📋 Copy SQL
                    </Button>
                    <Button 
                      size="sm" 
                      asChild
                      className="text-xs"
                    >
                      <a href={`https://supabase.com/dashboard/project/${import.meta.env.VITE_SUPABASE_PROJECT_ID}/sql/new`} target="_blank" rel="noopener noreferrer">
                        🔗 Open SQL Editor
                      </a>
                    </Button>
                  </div>
                  <p className="text-sm text-red-800">
                    <strong>IMPORTANT:</strong> If you already ran SQL that failed, first run: <code>DROP TABLE IF EXISTS public.notes;</code><br/>
                    <br/>
                    1. Click "Copy SQL" above, then "Open SQL Editor"<br/>
                    2. Paste the SQL and click "Run"<br/>
                    3. Refresh this page
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Note Editor */}
        {selectedNote ? (
          <>
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <Input
                  value={selectedNote.title}
                  onChange={(e) => handleContentChange('title', e.target.value)}
                  className="text-lg font-medium border-none bg-transparent p-0 focus:ring-0"
                  placeholder="Note title..."
                />
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSave}
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    disabled={!isDirty || isSaving}
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  {saveMessage && (
                    <span className="text-sm text-green-600 font-medium">{saveMessage}</span>
                  )}
                  {error && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNote(selectedNote.fileId)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Page {selectedNote.pageNumber} • Business Valuation Module
              </div>
            </div>

            <div className="flex-1 p-4 flex flex-col">
              <div className="mb-2 text-sm text-muted-foreground">
                Write your notes from the PDF here. Click "Save" to store them in Supabase.
              </div>
              <Textarea
                value={selectedNote.content}
                onChange={(e) => handleContentChange('content', e.target.value)}
                placeholder="Start writing your notes from the PDF here..."
                className="flex-1 w-full resize-none border border-border rounded-md p-3 focus:ring-2 focus:ring-primary/20 text-base leading-relaxed min-h-[400px]"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <PenTool className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Note Selected</h3>
              <p className="text-muted-foreground">Select a note from the drawer or create a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* Title Input Dialog */}
      <Dialog open={showTitleDialog} onOpenChange={setShowTitleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="note-title">Note Title</Label>
              <Input
                id="note-title"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Enter note title..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newNoteTitle.trim()) {
                    handleCreateNoteWithTitle(newNoteTitle);
                  } else if (e.key === 'Escape') {
                    setShowTitleDialog(false);
                  }
                }}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowTitleDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleCreateNoteWithTitle(newNoteTitle)}
                disabled={!newNoteTitle.trim() || isCreating}
              >
                {isCreating ? "Creating..." : "Create Note"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default NotesPane;