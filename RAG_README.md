# RAG Implementation for Business Valuation PDF

This implementation adds Retrieval-Augmented Generation (RAG) functionality to the Ask AI tab, enabling it to answer questions strictly from the Business Valuation PDF using Cerebras.

## Environment Setup

### Required API Keys

Add these environment variables to your `.env` file:

```env
# Required keys
VITE_SUPABASE_URL="your-supabase-url"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
VITE_CEREBRAS_API_KEY="your-cerebras-api-key"

# No OpenAI key needed - using custom embeddings!
```

### Database Setup

1. **Enable pgvector in Supabase**:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

2. **Run migrations**:
   ```bash
   # Apply database migrations (manually run these SQL files in your Supabase SQL editor)
   supabase/migrations/001_setup_pgvector.sql
   supabase/migrations/002_search_function.sql
   ```

## Usage

### 1. Ingest PDF Content

- Click the **"Ingest PDF"** button in the Ask AI tab
- This processes the Business Valuation PDF and stores chunks with embeddings
- Only needs to be done once (or when PDF content changes)

### 2. Ask Questions

- Ask questions about content in the Business Valuation PDF
- Get concise answers with page citations
- Answers are grounded strictly in the PDF content

## How It Works

### Ingestion Pipeline
1. **Text Extraction**: PDF → Markdown text using pdf-parse
2. **Chunking**: Split into 400-800 token chunks with 80-token overlap
3. **Embeddings**: Generate custom text embeddings (384D) using character frequency, word patterns, and business term analysis
4. **Storage**: Store in Supabase pgvector with metadata

### Retrieval Pipeline
1. **Query Embedding**: Convert user question to embedding
2. **Vector Search**: Find top 8 similar chunks (cosine similarity > 0.7)
3. **Context Building**: Combine relevant chunks with page metadata
4. **LLM Generation**: Use Cerebras with strict system prompt
5. **Citation**: Return answer with page references

## Key Features

- **Grounded Responses**: Answers only from PDF content
- **Page Citations**: Every answer includes source page numbers
- **Concise Output**: ≤6 sentences, plain language
- **Fallback Handling**: Polite refusal for out-of-scope questions
- **Real-time UI**: Streaming responses with citation display

## Technical Details

- **Embedding Model**: Custom text analysis (384 dimensions) - no external API needed!
- **LLM**: Cerebras Llama-3.1-8b (temperature=0.2)
- **Vector DB**: Supabase pgvector with ivfflat index
- **Chunking**: Sentence-based with token estimation
- **Deduplication**: Content hashing for idempotent ingestion

## File Structure

```
src/lib/
├── embeddingService.ts    # OpenAI embeddings + Supabase storage
├── pdfIngestion.ts        # PDF processing and chunking
├── ragService.ts          # RAG orchestration
└── cerebrasClient.ts      # Enhanced with options support

supabase/migrations/
├── 001_setup_pgvector.sql # Database schema
└── 002_search_function.sql # Vector search function

scripts/
└── ingest-pdf.js          # Standalone ingestion script
```

## Testing

1. **Verify API Keys**: Check that all environment variables are set
2. **Test Ingestion**: Click "Ingest PDF" and verify success message
3. **Test Queries**: Ask questions like:
   - "What is business valuation?"
   - "How do you calculate NPV?"
   - "What are the main valuation methods?"
4. **Verify Citations**: Check that answers include page references
5. **Test Fallback**: Ask out-of-scope questions to verify polite refusal

## Troubleshooting

- **Ingestion fails**: Check Cerebras API key and Supabase connection
- **No results**: Ensure PDF was ingested successfully
- **Poor answers**: Check that question relates to PDF content
- **Missing citations**: Verify chunks have page metadata
- **"Failed to generate query embedding"**: Custom embeddings are working - this is expected behavior during development