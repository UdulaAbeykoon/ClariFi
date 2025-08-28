import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ingestPdf } from '../src/lib/pdfIngestion.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  try {
    console.log('🚀 Starting PDF ingestion for Business Valuation module...');
    
    // Path to the business valuation PDF
    const pdfPath = join(__dirname, '..', 'public', 'modules', 'business-valuation', 'Financial Clarify Intro to Business Module 1.pdf');
    const pdfId = 'business-valuation';
    
    console.log(`📄 Reading PDF from: ${pdfPath}`);
    
    // Read the PDF file
    const pdfBuffer = readFileSync(pdfPath);
    console.log(`✅ PDF loaded (${pdfBuffer.length} bytes)`);
    
    // Ingest the PDF
    const result = await ingestPdf(pdfBuffer, pdfId);
    
    if (result.success) {
      console.log(`🎉 Ingestion completed successfully!`);
      console.log(`📊 Processed ${result.chunksProcessed} chunks`);
      console.log(`💾 Data stored in Supabase with pdf_id: "${pdfId}"`);
    } else {
      console.error(`❌ Ingestion failed: ${result.error}`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Fatal error during ingestion:', error);
    process.exit(1);
  }
}

main();