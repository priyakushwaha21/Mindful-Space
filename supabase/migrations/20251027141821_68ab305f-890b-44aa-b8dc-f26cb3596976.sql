-- Create mood_logs table for tracking user moods
CREATE TABLE IF NOT EXISTS public.mood_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mood TEXT NOT NULL,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own mood logs" 
ON public.mood_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood logs" 
ON public.mood_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood logs" 
ON public.mood_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood logs" 
ON public.mood_logs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own journal entries" 
ON public.journal_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries" 
ON public.journal_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" 
ON public.journal_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" 
ON public.journal_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_journal_entries_updated_at
BEFORE UPDATE ON public.journal_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();