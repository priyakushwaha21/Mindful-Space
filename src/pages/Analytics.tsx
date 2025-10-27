import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowLeft, TrendingUp, Calendar, Heart, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Analytics = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState<any[]>([]);
  const [journalCount, setJournalCount] = useState(0);
  const [avgMoodScore, setAvgMoodScore] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    const { data: moods } = await supabase
      .from("mood_logs")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: true })
      .limit(30);

    const { data: journals, count } = await supabase
      .from("journal_entries")
      .select("*", { count: "exact" })
      .eq("user_id", user?.id);

    if (moods) {
      const chartData = moods.map((m) => ({
        date: new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        score: m.mood_score,
        mood: m.mood,
      }));
      setMoodData(chartData);
      
      const avg = moods.reduce((acc, m) => acc + m.mood_score, 0) / moods.length;
      setAvgMoodScore(Math.round(avg * 10) / 10);
    }

    setJournalCount(count || 0);
  };

  if (loading) return null;
  if (!user) return null;

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
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Wellness Analytics</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Wellness Journey</h1>
          <p className="text-muted-foreground text-lg">Track your progress and insights</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
                <Heart className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgMoodScore || "N/A"}/10</div>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Mood Entries</CardTitle>
                <Calendar className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{moodData.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total logged</p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{journalCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Total written</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle>Mood Trend</CardTitle>
              <CardDescription>Your emotional journey over time</CardDescription>
            </CardHeader>
            <CardContent>
              {moodData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={[0, 10]} className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-12">No mood data yet. Start tracking your moods!</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
              <CardDescription>Most frequent emotional states</CardDescription>
            </CardHeader>
            <CardContent>
              {moodData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={[0, 10]} className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="score" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-12">No mood data yet. Start tracking your moods!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;