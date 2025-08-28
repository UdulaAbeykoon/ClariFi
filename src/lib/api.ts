import { supabase } from '../integrations/supabase/client';

class ApiClient {
  // Auth methods
  async getCurrentUser() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!session?.user) throw new Error('Not authenticated');
    
    const user = session.user;
    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      picture: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`
    };
  }

  async signInWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
  }

  async signUpWithEmail(email: string, password: string, name?: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0]
        }
      }
    });
    if (error) throw error;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Notes methods using Supabase directly
  async listNotes(moduleSlug?: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');
    const user = session.user;

    let query = supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (moduleSlug) {
      query = query.eq('doc_id', moduleSlug);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data.map(note => ({
      fileId: note.id,
      title: note.title,
      docId: note.doc_id,
      pageNumber: note.page_number || 1,
      updatedAt: note.updated_at
    }));
  }

  async getNote(noteId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');
    const user = session.user;

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return {
      frontmatter: {
        title: data.title,
        doc_id: data.doc_id,
        page_number: data.page_number || 1,
        updated_at: data.updated_at
      },
      body: data.content || ""
    };
  }

  async createNote(note: { title: string; docId: string; pageNumber: number; body: string }) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');
    const user = session.user;

    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: note.title,
        doc_id: note.docId,
        page_number: note.pageNumber,
        content: note.body
      })
      .select()
      .single();

    if (error) throw error;

    return {
      fileId: data.id,
      updatedAt: data.updated_at
    };
  }

  async updateNote(noteId: string, updates: { title?: string; body?: string }) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');
    const user = session.user;

    const updateData: Record<string, string> = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.body !== undefined) updateData.content = updates.body;

    const { data, error } = await supabase
      .from('notes')
      .update(updateData)
      .eq('id', noteId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return {
      updatedAt: data.updated_at
    };
  }

  async deleteNote(noteId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Not authenticated');
    const user = session.user;

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id);

    if (error) throw error;

    return { success: true };
  }
}

export const api = new ApiClient();

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface Note {
  fileId: string;
  title: string;
  docId: string;
  pageNumber: number;
  updatedAt: string;
}

export interface NoteContent {
  frontmatter: {
    title: string;
    doc_id: string;
    page_number: number;
    updated_at: string;
  };
  body: string;
}