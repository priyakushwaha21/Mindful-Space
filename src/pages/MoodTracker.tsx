import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Heart, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const MoodTracker = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [intensity, setIntensity] = useState([5]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSaveMood = async () => {
    if (!selectedMood) {
      toast.error("Please select a mood");
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from("mood_logs").insert({
      user_id: user?.id,
      mood: selectedMood,
      mood_score: intensity[0],
      note: notes || null,
    });

    setIsSaving(false);
    if (error) {
      toast.error("Error saving mood: " + error.message);
    } else {
      toast.success("Mood logged successfully!");
      setSelectedMood("");
      setIntensity([5]);
      setNotes("");
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  };

  const moods = [
    { emoji: "😊", label: "Happy", color: "from-yellow-400 to-orange-400" },
    { emoji: "😌", label: "Calm", color: "from-blue-400 to-cyan-400" },
    { emoji: "😔", label: "Sad", color: "from-blue-500 to-indigo-500" },
    { emoji: "😰", label: "Anxious", color: "from-purple-400 to-pink-400" },
    { emoji: "😡", label: "Angry", color: "from-red-400 to-orange-500" },
    { emoji: "😴", label: "Tired", color: "from-gray-400 to-gray-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MindfulSpace</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">How are you feeling?</h1>
          <p className="text-muted-foreground text-lg">Take a moment to check in with yourself</p>
        </div>

        <Card className="shadow-[var(--shadow-glow)]">
          <CardHeader>
            <CardTitle>Today's Mood</CardTitle>
            <CardDescription>Select the emotion that best describes how you feel right now</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-3 gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    selectedMood === mood.label
                      ? "border-primary shadow-[var(--shadow-glow)] bg-gradient-to-br " + mood.color + " bg-opacity-10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-5xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium">{mood.label}</div>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Intensity Level</label>
                <span className="text-sm text-muted-foreground">{intensity[0]}/10</span>
              </div>
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </label>
              <Textarea
                id="notes"
                placeholder="What's on your mind? Describe what you're feeling..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-32 resize-none"
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSaveMood} className="flex-1" size="lg" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Entry"}
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
    </div>
  );
};

export default MoodTracker;
