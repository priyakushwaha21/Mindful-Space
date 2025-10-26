import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { BookOpen, ArrowLeft, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Journal = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) return null;
  if (!user) return null;

  const prompts = [
    "What am I grateful for today?",
    "What challenged me and how did I handle it?",
    "What made me smile today?",
    "What do I need to let go of?",
  ];

  const handleSave = () => {
    if (!content.trim()) {
      toast.error("Please write something before saving");
      return;
    }
    toast.success("Journal entry saved!");
    // Will save to database once Lovable Cloud is connected
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-secondary-foreground" />
            </div>
            <span className="text-xl font-bold">MindfulSpace</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Journal</h1>
          <p className="text-muted-foreground text-lg">Express your thoughts freely</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-[var(--shadow-glow)]">
              <CardHeader>
                <CardTitle>New Entry</CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title (Optional)
                  </label>
                  <Input
                    id="title"
                    placeholder="Give your entry a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Your Thoughts
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Start writing..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-96 resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleSave} className="flex-1" size="lg">
                    Save Entry
                  </Button>
                  <Link to="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full" size="lg">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-[var(--shadow-soft)] bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Writing Prompts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {prompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setContent(prompt + "\n\n")}
                    className="w-full text-left p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors border border-border hover:border-primary/50"
                  >
                    <p className="text-sm">{prompt}</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle className="text-lg">Recent Entries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground text-center py-4">
                  Your journal entries will appear here
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
