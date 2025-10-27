import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Star, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Achievement {
  id: string;
  achievement_name: string;
  achievement_description: string | null;
  earned_at: string;
  icon: string | null;
}

const achievementIcons: Record<string, any> = {
  trophy: Trophy,
  award: Award,
  star: Star,
  zap: Zap,
};

const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    const { data } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", user?.id)
      .order("earned_at", { ascending: false });

    setAchievements(data || []);
  };

  const allAchievements = [
    { name: "7-Day Reflection Streak 🌙", description: "Logged mood for 7 consecutive days", locked: true },
    { name: "Consistent Calm Badge 🧘‍♀️", description: "Maintained 5+ mood score for 7 days", locked: true },
    { name: "Empathy Star 🌟", description: "Completed 10 journal entries", locked: true },
    { name: "Mindfulness Master ✨", description: "Completed 20 mindfulness sessions", locked: true },
    { name: "Goal Achiever 🎯", description: "Completed your first wellness goal", locked: true },
  ];

  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <CardTitle>Achievements & Rewards</CardTitle>
        </div>
        <CardDescription>Your wellness milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {achievements.map((achievement) => {
            const IconComponent = achievementIcons[achievement.icon || "trophy"];
            return (
              <div
                key={achievement.id}
                className="p-4 rounded-lg border border-primary bg-primary/5 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{achievement.achievement_name}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.achievement_description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Earned: {new Date(achievement.earned_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}

          {allAchievements.map((achievement, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border bg-muted/20 flex items-center gap-3 opacity-50"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Trophy className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{achievement.name}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                <p className="text-xs text-muted-foreground mt-1">🔒 Locked</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Achievements;
