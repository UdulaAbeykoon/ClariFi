-- Run this SQL in your Supabase SQL Editor to set up the complete ClariFi system
-- This includes both Notes functionality and RAG (AI search) functionality

-- Step 1: Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;

-- Step 2: Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS pdf_chunks;
DROP TABLE IF EXISTS public.notes;

-- PART A: NOTES FUNCTIONALITY
-- Step 3: Create notes table with proper structure for Supabase auth
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doc_id TEXT NOT NULL,
  page_number INTEGER,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 4: Enable RLS (Row Level Security) for notes
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies for notes RLS
CREATE POLICY "Users can view their own notes" 
  ON public.notes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" 
  ON public.notes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
  ON public.notes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
  ON public.notes FOR DELETE 
  USING (auth.uid() = user_id);

-- Step 6: Create indexes for notes performance
CREATE INDEX idx_notes_user_id ON public.notes(user_id);
CREATE INDEX idx_notes_doc_id ON public.notes(doc_id);
CREATE INDEX idx_notes_updated_at ON public.notes(updated_at DESC);

-- PART B: RAG (AI SEARCH) FUNCTIONALITY  
-- Step 7: Create pdf_chunks table
CREATE TABLE pdf_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  content_hash TEXT UNIQUE NOT NULL,
  pdf_id TEXT NOT NULL,
  page_start INTEGER NOT NULL,
  page_end INTEGER NOT NULL,
  heading_path TEXT,
  token_count INTEGER,
  embedding VECTOR(384), -- Custom text embedding dimensions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 8: Create indexes for efficient search
CREATE INDEX IF NOT EXISTS pdf_chunks_embedding_idx ON pdf_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS pdf_chunks_pdf_id_idx ON pdf_chunks(pdf_id);
CREATE INDEX IF NOT EXISTS pdf_chunks_content_hash_idx ON pdf_chunks(content_hash);
CREATE INDEX IF NOT EXISTS pdf_chunks_page_idx ON pdf_chunks(page_start, page_end);

-- PART C: SHARED FUNCTIONALITY
-- Step 9: Function to update updated_at timestamp (shared by both tables)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 10: Create triggers for both tables
DROP TRIGGER IF EXISTS update_notes_updated_at ON public.notes;
CREATE TRIGGER update_notes_updated_at 
  BEFORE UPDATE ON public.notes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pdf_chunks_updated_at ON pdf_chunks;
CREATE TRIGGER update_pdf_chunks_updated_at BEFORE UPDATE ON pdf_chunks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 11: Enable RLS for pdf_chunks
ALTER TABLE pdf_chunks ENABLE ROW LEVEL SECURITY;

-- Step 12: Create policy for public access to pdf_chunks (adjust as needed)
DROP POLICY IF EXISTS "Allow all operations on pdf_chunks" ON pdf_chunks;
CREATE POLICY "Allow all operations on pdf_chunks" ON pdf_chunks
  FOR ALL USING (true) WITH CHECK (true);

-- Step 13: Create search function for vector similarity
CREATE OR REPLACE FUNCTION search_pdf_chunks(
  query_embedding VECTOR(384), -- Custom text embedding has 384 dimensions
  target_pdf_id TEXT,
  similarity_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 8
)
RETURNS TABLE(
  id UUID,
  content TEXT,
  pdf_id TEXT,
  page_start INTEGER,
  page_end INTEGER,
  heading_path TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pc.id,
    pc.content,
    pc.pdf_id,
    pc.page_start,
    pc.page_end,
    pc.heading_path,
    (pc.embedding <=> query_embedding) * -1 + 1 AS similarity
  FROM pdf_chunks pc
  WHERE pc.pdf_id = target_pdf_id
    AND (pc.embedding <=> query_embedding) * -1 + 1 >= similarity_threshold
  ORDER BY pc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Step 14: Verify setup
SELECT 'Complete ClariFi database setup completed successfully!' as status;

-- Summary of what was created:
-- ✅ Notes table with RLS policies (for authenticated note-taking)
-- ✅ PDF chunks table with vector embeddings (for AI search)
-- ✅ Indexes for optimal performance
-- ✅ Triggers for automatic timestamp updates
-- ✅ Search function for RAG (Retrieval-Augmented Generation)

-- Next steps:
-- 1. Refresh your ClariFi application
-- 2. Click "Ingest PDF" to process the business valuation document
-- 3. Start asking questions about the PDF content!