import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client (will be undefined if env vars not set)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Notes API functions
export const notesApi = {
  // List notes for a document
  async listNotes(docId) {
    if (!supabase) {
      console.warn('Supabase not configured - using mock data');
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('doc_id', docId)
      .order('updated_at', { ascending: false });
    
    return { data, error };
  },

  // Get a specific note
  async getNote(id) {
    if (!supabase) {
      console.warn('Supabase not configured');
      return { data: null, error: 'Supabase not configured' };
    }
    
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  // Create or update a note
  async upsertNote(note) {
    if (!supabase) {
      console.warn('Supabase not configured - simulating save');
      return { data: note, error: null };
    }
    
    const { data, error } = await supabase
      .from('notes')
      .upsert(note)
      .select()
      .single();
    
    return { data, error };
  },

  // Delete a note
  async deleteNote(id) {
    if (!supabase) {
      console.warn('Supabase not configured');
      return { data: null, error: null };
    }
    
    const { data, error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);
    
    return { data, error };
  }
};

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};