# Supabase Setup Guide for ClariFi

## Step 1: Apply Database Migration

1. **Go to your Supabase project**: https://lopwawyfmzvekrhvzply.supabase.co
2. **Navigate to SQL Editor**: Click "SQL Editor" in the left sidebar
3. **Create a new query** and copy-paste this SQL:

```sql
-- Drop the existing notes table and create a new one for Supabase auth
DROP TABLE IF EXISTS public.notes;

-- Create notes table with proper structure for Supabase auth
CREATE TABLE public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doc_id TEXT NOT NULL,
  page_number INTEGER,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
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

-- Create indexes for better performance
CREATE INDEX idx_notes_user_id ON public.notes(user_id);
CREATE INDEX idx_notes_doc_id ON public.notes(doc_id);
CREATE INDEX idx_notes_updated_at ON public.notes(updated_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_notes_updated_at 
  BEFORE UPDATE ON public.notes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. **Click "RUN"** to execute the migration

## Step 2: Enable Email Authentication in Supabase

1. **Go to Authentication → Settings** in your Supabase dashboard
2. **Under Auth Providers**, ensure **Email** is enabled (it should be by default)
3. **Configure email templates** (optional):
   - Go to Authentication → Email Templates
   - Customize the confirmation and password reset emails if desired

## Step 3: Test the Setup

1. Make sure your frontend is running: `npm run dev`
2. Visit http://localhost:8081
3. Click "Sign In" and create a new account with email/password
4. Check your email for the confirmation link (if email confirmation is enabled)
5. Sign in with your credentials
6. Try creating a note to test the full flow

## Troubleshooting

- Check the browser console for any error messages
- Make sure RLS policies are enabled in Supabase (they should be after running the SQL above)
- If email confirmation is not working, check your email settings in Authentication → Settings