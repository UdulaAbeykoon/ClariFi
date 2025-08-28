import { supabase } from '../integrations/supabase/client';

const checkRagTables = async () => {
  try {
    console.log('🔍 Checking RAG tables...');
    
    // Check if pdf_chunks table exists
    const { data, error } = await supabase
      .from('pdf_chunks')
      .select('count')
      .limit(1);
    
    if (error && error.code === '42P01') {
      // Table doesn't exist
      console.log('❌ PDF chunks table does not exist');
      console.log('');
      console.log('🔧 TO FIX: Please run the SETUP_DATABASE.sql file in your Supabase SQL Editor');
      console.log('📍 Steps:');
      console.log('1. Go to https://supabase.com/dashboard/project/' + import.meta.env.VITE_SUPABASE_PROJECT_ID);
      console.log('2. Click "SQL Editor" in the sidebar');
      console.log('3. Copy content from SETUP_DATABASE.sql file and paste it');
      console.log('4. Click "Run"');
      console.log('5. Refresh this page');
      console.log('');
      return false;
    } else if (error) {
      console.error('❌ RAG database error:', error);
      return false;
    }
    
    console.log('✅ RAG tables exist and are accessible');
    return true;
    
  } catch (error) {
    console.error('❌ RAG setup check failed:', error);
    return false;
  }
};

export const setupDatabase = async () => {
  try {
    console.log('=== SETTING UP DATABASE ===');
    
    // First check RAG tables (don't require auth)
    await checkRagTables();
    
    // Check if user is authenticated for notes
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.log('❌ Not authenticated - please sign in first for notes functionality');
      console.log('📝 RAG functionality will still work without authentication');
      return false;
    }
    
    console.log('✅ User authenticated:', session.user.email);
    
    // Try to query the notes table to see if it exists
    const { data, error } = await supabase
      .from('notes')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      // Table doesn't exist
      console.log('❌ Notes or RAG tables are missing');
      console.log('');
      console.log('🔧 TO FIX: Please run the complete SETUP_DATABASE.sql file');
      console.log('📍 Steps:');
      console.log('1. Go to https://supabase.com/dashboard/project/' + import.meta.env.VITE_SUPABASE_PROJECT_ID);
      console.log('2. Click "SQL Editor" in the sidebar');
      console.log('3. Copy content from SETUP_DATABASE.sql and paste it');
      console.log('4. Click "Run"');
      console.log('5. Refresh this page');
      console.log('');
      console.log('💡 The SETUP_DATABASE.sql file contains BOTH:');
      console.log('   - Notes functionality (for taking notes)');
      console.log('   - RAG functionality (for AI search)');
      console.log('');
      return false;
      
    } else if (error) {
      console.error('❌ Database error:', error);
      return false;
    }
    
    console.log('✅ Notes table exists and is accessible');
    console.log('✅ Database is ready for notes functionality');
    return true;
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    return false;
  }
};

// Auto-run in development after a delay to let auth initialize
if (import.meta.env.DEV) {
  setTimeout(setupDatabase, 3000);
}