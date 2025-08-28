import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface EmbeddingResponse {
  embedding: number[];
  error?: string;
}

// Simple text-based embedding using character frequency analysis
// This is a basic implementation - in production you'd want a proper embedding service
function generateSimpleEmbedding(text: string): number[] {
  const cleanText = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  
  // Create a 384-dimensional embedding based on text characteristics
  const embedding = new Array(384).fill(0);
  
  // Character frequency features
  const charCounts = new Array(26).fill(0);
  for (let i = 0; i < cleanText.length; i++) {
    const code = cleanText.charCodeAt(i) - 97;
    if (code >= 0 && code < 26) {
      charCounts[code]++;
    }
  }
  
  // Normalize and map to first part of embedding
  const totalChars = cleanText.length;
  for (let i = 0; i < 26; i++) {
    embedding[i] = totalChars > 0 ? charCounts[i] / totalChars : 0;
  }
  
  // Word length distribution
  const lengthDist = new Array(20).fill(0);
  words.forEach(word => {
    const len = Math.min(word.length - 1, 19);
    if (len >= 0) lengthDist[len]++;
  });
  
  const totalWords = words.length;
  for (let i = 0; i < 20; i++) {
    embedding[26 + i] = totalWords > 0 ? lengthDist[i] / totalWords : 0;
  }
  
  // Common business terms (semantic features)
  const businessTerms = [
    'business', 'valuation', 'financial', 'revenue', 'profit', 'market', 'investment',
    'analysis', 'cash', 'flow', 'equity', 'asset', 'liability', 'growth', 'risk',
    'return', 'capital', 'earnings', 'company', 'value', 'price', 'cost', 'income',
    'balance', 'statement', 'ratio', 'performance', 'strategy', 'management', 'operation'
  ];
  
  businessTerms.forEach((term, idx) => {
    const count = (cleanText.match(new RegExp(term, 'g')) || []).length;
    if (idx < 100) { // Map to embedding dimensions 46-145
      embedding[46 + idx] = totalWords > 0 ? count / totalWords : 0;
    }
  });
  
  // Fill remaining dimensions with text statistics
  embedding[146] = words.length / Math.max(text.length, 1); // word density
  embedding[147] = text.split('.').length / Math.max(text.length, 1); // sentence density
  embedding[148] = (text.match(/[0-9]/g) || []).length / Math.max(text.length, 1); // number density
  
  // Random noise for remaining dimensions (to ensure uniqueness)
  const hash = text.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  for (let i = 149; i < 384; i++) {
    embedding[i] = (Math.sin(hash * (i + 1)) + 1) / 2000; // Small random component
  }
  
  // Normalize the embedding vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] = embedding[i] / magnitude;
    }
  }
  
  return embedding;
}

export async function generateEmbedding(text: string): Promise<EmbeddingResponse> {
  try {
    console.log('Generating simple embedding for text:', text.substring(0, 100) + '...');
    const embedding = generateSimpleEmbedding(text);
    
    return {
      embedding: embedding
    };
  } catch (error) {
    console.error('Embedding generation failed:', error);
    return {
      embedding: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function storeChunk(
  content: string,
  contentHash: string,
  pdfId: string,
  pageStart: number,
  pageEnd: number,
  headingPath?: string,
  tokenCount?: number
) {
  try {
    // Generate embedding
    const embeddingResponse = await generateEmbedding(content);
    
    if (embeddingResponse.error || embeddingResponse.embedding.length === 0) {
      throw new Error('Failed to generate embedding');
    }

    // Store in database with upsert to handle duplicates
    const { data, error } = await supabase
      .from('pdf_chunks')
      .upsert({
        content,
        content_hash: contentHash,
        pdf_id: pdfId,
        page_start: pageStart,
        page_end: pageEnd,
        heading_path: headingPath,
        token_count: tokenCount,
        embedding: embeddingResponse.embedding
      }, {
        onConflict: 'content_hash'
      });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error storing chunk:', error);
    throw error;
  }
}

// Simple keyword search function for better matching
async function keywordSearch(query: string, pdfId: string, limit: number, currentPage?: number) {
  try {
    // Extract keywords from query, including shorter common business terms
    const keywords = query.toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 1) // Include shorter words like "is", "of"
      .slice(0, 8); // Increase to 8 keywords for better coverage
    
    console.log('Searching for keywords:', keywords);
    
    if (keywords.length === 0) return [];
    
    // Create more flexible search patterns
    const searchPatterns = [];
    
    // Add exact phrase search if query is short
    if (query.length < 50) {
      searchPatterns.push(`content.ilike.%${query.toLowerCase()}%`);
    }
    
    // Add individual keyword searches
    keywords.forEach(keyword => {
      searchPatterns.push(`content.ilike.%${keyword}%`);
    });
    
    // Search for chunks containing any of the patterns
    const { data: chunks, error } = await supabase
      .from('pdf_chunks')
      .select('id, content, pdf_id, page_start, page_end, heading_path')
      .eq('pdf_id', pdfId)
      .or(searchPatterns.join(','))
      .limit(limit * 3); // Get more results for better scoring
    
    if (error) {
      console.error('Keyword search error:', error);
      return [];
    }
    
    if (!chunks || chunks.length === 0) {
      return [];
    }
    
    // Score chunks based on keyword and phrase matches
    const scoredChunks = chunks.map(chunk => {
      const content = chunk.content.toLowerCase();
      let score = 0;
      
      // Higher score for exact phrase matches
      if (query.length < 50 && content.includes(query.toLowerCase())) {
        score += 10; // Big bonus for exact phrase match
      }
      
      // Score for individual keyword matches
      keywords.forEach(keyword => {
        const matches = (content.match(new RegExp(keyword, 'gi')) || []).length;
        score += matches * 2; // Weight each keyword match
      });
      
      // Bonus for multiple keyword matches in same chunk
      const uniqueKeywordsFound = keywords.filter(keyword => 
        content.includes(keyword)
      ).length;
      score += uniqueKeywordsFound * 3; // Bonus for diversity
      
      // Major bonus if chunk is from current page
      if (currentPage && chunk.page_start <= currentPage && chunk.page_end >= currentPage) {
        score += 15; // Big bonus for current page content
        console.log(`Current page bonus applied for chunk on pages ${chunk.page_start}-${chunk.page_end}`);
      }
      
      return {
        ...chunk,
        similarity: score // Use raw score for better ranking
      };
    });
    
    // Sort by score and return top results
    const sortedChunks = scoredChunks
      .sort((a, b) => b.similarity - a.similarity)
      .filter(chunk => chunk.similarity > 0); // Only return chunks with some relevance
    
    console.log('Keyword search scored chunks:', sortedChunks.map(c => ({
      score: c.similarity,
      preview: c.content.substring(0, 100)
    })));
    
    return sortedChunks.slice(0, limit);
    
  } catch (error) {
    console.error('Keyword search failed:', error);
    return [];
  }
}

export async function searchSimilarChunks(
  query: string,
  pdfId: string,
  limit: number = 8,
  threshold: number = 0.7,
  currentPage?: number
) {
  try {
    console.log('Searching for:', query);
    
    // First try keyword matching for better results
    const keywordResults = await keywordSearch(query, pdfId, limit, currentPage);
    if (keywordResults.length > 0) {
      console.log('Found', keywordResults.length, 'results via keyword search');
      if (currentPage) {
        console.log('Search prioritized content from page', currentPage);
      }
      return keywordResults;
    }
    
    console.log('No keyword results found, falling back to embedding search...');
    
    // Generate embedding for the query
    const embeddingResponse = await generateEmbedding(query);
    
    if (embeddingResponse.error || embeddingResponse.embedding.length === 0) {
      console.error('Embedding generation failed:', embeddingResponse.error);
      throw new Error('Failed to generate query embedding');
    }

    console.log('Generated embedding, length:', embeddingResponse.embedding.length);
    console.log('Calling search function with params:', { pdfId, threshold, limit });

    // Try using the database function first, fallback to manual search if it fails
    let data, error;
    
    try {
      const result = await supabase.rpc('search_pdf_chunks', {
        query_embedding: embeddingResponse.embedding,
        target_pdf_id: pdfId,
        similarity_threshold: threshold,
        match_count: limit
      });
      data = result.data;
      error = result.error;
    } catch (rpcError) {
      console.warn('RPC function not available, falling back to manual search:', rpcError);
      
      // Fallback: manual search without RPC function
      const { data: chunks, error: fetchError } = await supabase
        .from('pdf_chunks')
        .select('id, content, pdf_id, page_start, page_end, heading_path, embedding')
        .eq('pdf_id', pdfId)
        .limit(limit * 2); // Get more to calculate similarity manually
      
      if (fetchError) {
        console.error('Manual search error:', fetchError);
        throw fetchError;
      }
      
      if (!chunks || chunks.length === 0) {
        console.log('No chunks found for pdf_id:', pdfId);
        
        // Debug: Check what pdf_ids are actually in the database
        const { data: allChunks } = await supabase
          .from('pdf_chunks')
          .select('pdf_id, id')
          .limit(10);
        
        console.log('Available chunks in database:', allChunks);
        console.log('Looking for pdf_id:', pdfId);
        
        return [];
      }
      
      // Calculate cosine similarity manually
      const queryEmbedding = embeddingResponse.embedding;
      const similarities = chunks.map(chunk => {
        if (!chunk.embedding || chunk.embedding.length !== queryEmbedding.length) {
          return { ...chunk, similarity: 0 };
        }
        
        const chunkEmbedding = chunk.embedding;
        let dotProduct = 0;
        let queryMagnitude = 0;
        let chunkMagnitude = 0;
        
        for (let i = 0; i < queryEmbedding.length; i++) {
          dotProduct += queryEmbedding[i] * chunkEmbedding[i];
          queryMagnitude += queryEmbedding[i] * queryEmbedding[i];
          chunkMagnitude += chunkEmbedding[i] * chunkEmbedding[i];
        }
        
        queryMagnitude = Math.sqrt(queryMagnitude);
        chunkMagnitude = Math.sqrt(chunkMagnitude);
        
        const similarity = (queryMagnitude && chunkMagnitude) 
          ? dotProduct / (queryMagnitude * chunkMagnitude)
          : 0;
        
        return { ...chunk, similarity };
      });
      
      // Filter by threshold and sort by similarity
      const filteredByThreshold = similarities
        .filter(chunk => chunk.similarity >= threshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
      
      // If no results with threshold, return top results anyway (for demo purposes)
      if (filteredByThreshold.length === 0) {
        console.log('No results above threshold, returning top results anyway');
        data = similarities
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, Math.min(3, similarities.length)); // Return top 3 regardless of similarity
      } else {
        data = filteredByThreshold;
      }
      
      error = null;
    }

    if (error) {
      console.error('Supabase search error:', error);
      throw error;
    }

    console.log('Search completed, results:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error searching chunks:', error);
    throw error;
  }
}