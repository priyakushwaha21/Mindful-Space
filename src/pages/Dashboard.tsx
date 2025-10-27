import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, MessageCircle, TrendingUp, Sparkles, LogOut, Wind, Brain, Activity, BarChart3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [recentMood, setRecentMood] = useState<any>(null);
  const [affirmation, setAffirmation] = useState("");

  const affirmations = [
    "You are worthy of love and belonging. Your feelings are valid.",
    "Every small step forward is progress. Be proud of yourself.",
    "You have the strength to overcome any challenge that comes your way.",
    "It's okay to rest. Self-care is not selfish.",
    "You are doing better than you think. Keep going.",
    "Your mental health matters. You matter.",
  ];

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
      setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
    }
  }, [user]);

  const loadDashboardData = async () => {
    const { data } = await supabase
      .from("mood_logs")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    setRecentMood(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const getMoodEmoji = (score: number) => {
    if (score >= 8) return "😊";
    if (score >= 6) return "🙂";
    if (score >= 4) return "😐";
    return "😔";
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MindfulSpace</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/mood">
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Mood
              </Button>
            </Link>
            <Link to="/journal">
              <Button variant="ghost" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Journal
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="ghost" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome back, {user.user_metadata?.full_name || "Friend"} {recentMood && getMoodEmoji(recentMood.mood_score)}
          </h1>
          <p className="text-muted-foreground text-lg">
            {recentMood 
              ? `Your last mood: ${recentMood.mood} (${recentMood.mood_score}/10)` 
              : "How are you feeling today?"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Log Mood</CardTitle>
              <CardDescription>Track how you're feeling</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/mood">
                <Button variant="calm" className="w-full">
                  Add Entry
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle>Write Journal</CardTitle>
              <CardDescription>Express your thoughts</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/journal">
                <Button variant="calm" className="w-full">
                  Start Writing
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Chat Companion</CardTitle>
              <CardDescription>Talk with your AI friend</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/chat">
                <Button variant="calm" className="w-full">
                  Start Chat
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-[var(--shadow-soft)] bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Daily Affirmation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-6 leading-relaxed">"{affirmation}"</p>
              <Button 
                variant="secondary" 
                onClick={() => setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)])}
              >
                Get New Affirmation
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Quick Stats
              </CardTitle>
              <CardDescription>Your wellness at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link to="/analytics">
                  <div className="p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors cursor-pointer">
                    <p className="text-sm text-muted-foreground">View detailed analytics</p>
                    <p className="text-2xl font-bold mt-1">Track Progress →</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4">
                <Wind className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Breathing Exercise</CardTitle>
              <CardDescription>Calm your mind in 5 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="calm" className="w-full">
                Start Exercise
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Mindfulness</CardTitle>
              <CardDescription>Practice being present</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="calm" className="w-full">
                Begin Session
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle>Wellness Goals</CardTitle>
              <CardDescription>Set and track your goals</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="calm" className="w-full">
                Manage Goals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
