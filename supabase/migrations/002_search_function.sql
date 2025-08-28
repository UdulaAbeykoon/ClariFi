-- Create search function for vector similarity
CREATE OR REPLACE FUNCTION search_pdf_chunks(
  query_embedding VECTOR(384), -- Custom text embedding has 384 dimensions
  pdf_id TEXT,
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
  WHERE pc.pdf_id = search_pdf_chunks.pdf_id
    AND (pc.embedding <=> query_embedding) * -1 + 1 >= similarity_threshold
  ORDER BY pc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;