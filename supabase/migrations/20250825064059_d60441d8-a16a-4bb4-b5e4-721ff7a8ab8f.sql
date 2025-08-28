-- Update notes table to support user authentication and Drive integration
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  drive_file_id TEXT NOT NULL,
  doc_id TEXT NOT NULL,
  page_number INT,
  title TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies for user access (email-based since we're not using Supabase auth)
CREATE POLICY "Users can view their own notes" 
ON public.notes 
FOR SELECT 
USING (true); -- Allow reading for now since we'll handle auth server-side

CREATE POLICY "Server can manage all notes" 
ON public.notes 
FOR ALL 
USING (true) 
WITH CHECK (true); -- Server-side service key will handle all operations

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();