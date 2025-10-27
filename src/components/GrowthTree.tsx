import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface UserStats {
  growth_level: number;
  growth_points: number;
  current_streak: number;
  total_mood_logs: number;
  total_journal_entries: number;
}

const GrowthTree = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    let { data, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", user?.id)
      .maybeSingle();

    if (!data && !error) {
      // Create initial stats
      const { data: newStats } = await supabase
        .from("user_stats")
        .insert({ user_id: user?.id })
        .select()
        .single();
      data = newStats;
    }

    if (data) {
      setStats(data);
    }
  };

  const getTreeHeight = () => {
    if (!stats) return 50;
    return Math.min(50 + stats.growth_level * 30, 300);
  };

  const getLeafCount = () => {
    if (!stats) return 3;
    return Math.min(3 + Math.floor(stats.growth_points / 10), 20);
  };

  const getFlowerCount = () => {
    if (!stats) return 0;
    return Math.floor(stats.current_streak / 7);
  };

  return (
    <Card className="shadow-[var(--shadow-soft)] bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-primary" />
          <CardTitle>Emotional Growth Tree</CardTitle>
        </div>
        <CardDescription>Your wellness journey visualized</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full h-64 flex items-end justify-center">
            {/* Tree trunk */}
            <div
              className="w-12 bg-gradient-to-t from-primary/40 to-primary/20 rounded-t-lg transition-all duration-500"
              style={{ height: `${getTreeHeight()}px` }}
            />
            
            {/* Leaves */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ marginTop: `-${getTreeHeight() / 2}px` }}>
                {Array.from({ length: getLeafCount() }).map((_, i) => (
                  <Leaf
                    key={i}
                    className="absolute text-primary animate-pulse"
                    style={{
                      left: `${Math.cos((i * 2 * Math.PI) / getLeafCount()) * 60}px`,
                      top: `${Math.sin((i * 2 * Math.PI) / getLeafCount()) * 60}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Flowers for streaks */}
            {Array.from({ length: getFlowerCount() }).map((_, i) => (
              <span
                key={i}
                className="absolute text-2xl animate-bounce"
                style={{
                  left: `${30 + i * 20}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                🌸
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full text-center">
            <div className="p-3 rounded-lg bg-accent/10">
              <p className="text-2xl font-bold text-primary">{stats?.growth_level || 1}</p>
              <p className="text-xs text-muted-foreground">Level</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10">
              <p className="text-2xl font-bold text-primary">{stats?.growth_points || 0}</p>
              <p className="text-xs text-muted-foreground">Growth Points</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10">
              <p className="text-2xl font-bold text-primary">{stats?.current_streak || 0}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10">
              <p className="text-2xl font-bold text-primary">{getLeafCount()}</p>
              <p className="text-xs text-muted-foreground">Leaves</p>
            </div>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            Keep logging your mood and journaling to grow your tree! 🌱
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthTree;
