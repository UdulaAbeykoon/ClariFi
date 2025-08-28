import { searchSimilarChunks } from './embeddingService';
import { getChatCompletion } from './cerebrasClient';

interface RagResponse {
  answer: string;
  citations: Array<{
    page_start: number;
    page_end: number;
  }>;
  error?: string;
}

interface RagRequest {
  question: string;
  pdf_id: string;
  currentPage?: number;
}

const SYSTEM_PROMPT = `You are a precise business study assistant specializing in business valuation concepts.

CRITICAL INSTRUCTIONS:
- Give DIRECT, CONCISE answers (1-2 sentences max)
- NO unnecessary explanations, introductions, or fluff
- Use ONLY the provided textbook context - cite specific examples when mentioned
- If the context contains specific examples (like "bakery oven", "SaaS startup"), reference them directly
- DO NOT include page numbers in your response text - the system will show accurate source pages separately
- Answer with authority - never hedge with "appears to be" or "seems like"
- Structure: [Direct answer]. [Example from text if relevant].

Example format: "NPV calculates present value of future cash flows minus initial investment. The bakery oven example shows NPV of -$493, indicating rejection."`;

export async function askRAG(request: RagRequest): Promise<RagResponse> {
  try {
    const { question, pdf_id, currentPage } = request;
    console.log('RAG request:', { question, pdf_id, currentPage });
    
    // Step 1: Search for relevant chunks
    console.log('Searching for chunks...');
    const chunks = await searchSimilarChunks(question, pdf_id, 8, 0.1, currentPage); // Lower threshold for custom embeddings
    console.log('Search results:', chunks?.length || 0, 'chunks found');
    
    if (!chunks || chunks.length === 0) {
      console.log('No chunks found - PDF might not be ingested yet');
      return {
        answer: "I don't have any content from the Business Valuation PDF yet. Please click 'Ingest PDF' first to load the document content, then ask your question again.",
        citations: []
      };
    }
    
    // Always proceed with available chunks (no similarity threshold check)
    const topSimilarity = chunks[0]?.similarity || 0;
    console.log('Top similarity score:', topSimilarity);
    console.log('Proceeding with', chunks.length, 'chunks regardless of similarity score');
    
    // Step 2: Build context from chunks
    const context = chunks
      .map((chunk, index) => 
        `[Context ${index + 1}, Pages ${chunk.page_start}-${chunk.page_end}]: ${chunk.content}`
      )
      .join('\n\n');
    
    // Step 3: Create chat messages
    const messages = [
      {
        role: 'system' as const,
        content: SYSTEM_PROMPT
      },
      {
        role: 'user' as const,
        content: `TEXTBOOK CONTEXT:

${context}

QUESTION: ${question}

Answer using ONLY the context above. Be direct and concise. Reference specific examples from the text when available.`
      }
    ];
    
    // Step 4: Get response from Cerebras
    const response = await getChatCompletion(messages, {
      temperature: 0.2,
      max_tokens: 500,
      useSystemPrompt: false // We're providing our own system prompt
    });
    
    if (response.error) {
      return {
        answer: "I encountered an error processing your question. Please try again.",
        citations: [],
        error: response.error
      };
    }
    
    // Step 5: Extract citations from chunks
    const citations = chunks
      .map(chunk => ({
        page_start: chunk.page_start,
        page_end: chunk.page_end
      }))
      // Remove duplicate page ranges
      .filter((citation, index, self) => 
        self.findIndex(c => 
          c.page_start === citation.page_start && c.page_end === citation.page_end
        ) === index
      )
      .slice(0, 5); // Limit to top 5 page references
    
    return {
      answer: response.content || "I couldn't generate a response. Please try again.",
      citations
    };
    
  } catch (error) {
    console.error('RAG service error:', error);
    return {
      answer: "I encountered an error processing your question. Please try again.",
      citations: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Streaming version for real-time responses (if needed later)
export async function askRAGStream(
  request: RagRequest,
  onChunk: (chunk: string) => void
): Promise<RagResponse> {
  // For now, just return the regular response
  // This could be enhanced with streaming support from Cerebras
  const response = await askRAG(request);
  onChunk(response.answer);
  return response;
}