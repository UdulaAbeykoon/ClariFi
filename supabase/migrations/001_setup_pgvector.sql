-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create pdf_chunks table for storing document embeddings
CREATE TABLE IF NOT EXISTS pdf_chunks (
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

-- Create indexes for efficient vector similarity search
CREATE INDEX IF NOT EXISTS pdf_chunks_embedding_idx ON pdf_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS pdf_chunks_pdf_id_idx ON pdf_chunks(pdf_id);
CREATE INDEX IF NOT EXISTS pdf_chunks_content_hash_idx ON pdf_chunks(content_hash);
CREATE INDEX IF NOT EXISTS pdf_chunks_page_idx ON pdf_chunks(page_start, page_end);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_pdf_chunks_updated_at BEFORE UPDATE ON pdf_chunks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS policies
ALTER TABLE pdf_chunks ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (adjust based on your auth requirements)
CREATE POLICY "Allow all operations on pdf_chunks" ON pdf_chunks
  FOR ALL USING (true) WITH CHECK (true);