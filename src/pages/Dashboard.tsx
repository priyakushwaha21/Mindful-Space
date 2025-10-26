import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, MessageCircle, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const moodData = [
    { day: "Mon", mood: "😊", score: 8 },
    { day: "Tue", mood: "😌", score: 7 },
    { day: "Wed", mood: "😊", score: 8 },
    { day: "Thu", mood: "🙂", score: 6 },
    { day: "Fri", mood: "😊", score: 9 },
  ];

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
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-lg">How are you feeling today?</p>
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

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Mood Trends
              </CardTitle>
              <CardDescription>Your emotional journey this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moodData.map((entry) => (
                  <div key={entry.day} className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{entry.mood}</span>
                      <span className="font-medium">{entry.day}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                          style={{ width: `${entry.score * 10}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{entry.score}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)] bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Daily Affirmation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-6 leading-relaxed">
                "You are worthy of love and belonging. Your feelings are valid, 
                and it's okay to take time for yourself."
              </p>
              <Button variant="secondary">
                Get New Affirmation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
