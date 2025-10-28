import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, MessageCircle, TrendingUp, Sparkles, LogOut, Wind, Brain, Activity, BarChart3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

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
      <Navbar />
      
      <div className="pt-20 sm:pt-24 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome back, {user.user_metadata?.full_name || "Friend"} {recentMood && getMoodEmoji(recentMood.mood_score)}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            {recentMood 
              ? `Your last mood: ${recentMood.mood} (${recentMood.mood_score}/10)` 
              : "How are you feeling today?"}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
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

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4">
                <Wind className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Breathing Exercise</CardTitle>
              <CardDescription>Calm your mind in 5 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/wellness">
                <Button variant="calm" className="w-full">
                  Start Exercise
                </Button>
              </Link>
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
              <Link to="/wellness">
                <Button variant="calm" className="w-full">
                  Begin Session
                </Button>
              </Link>
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
              <Link to="/wellness">
                <Button variant="calm" className="w-full">
                  Manage Goals
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Link to="/growth">
            <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 cursor-pointer bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">🌱</div>
                    <div>
                      <h3 className="text-xl font-bold">View Your Growth Tree & Achievements</h3>
                      <p className="text-sm text-muted-foreground">Track your wellness journey and unlock rewards</p>
                    </div>
                  </div>
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
