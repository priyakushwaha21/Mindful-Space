import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const updateUserStats = async (userId: string) => {
  // Get current stats
  let { data: stats } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  // Create stats if they don't exist
  if (!stats) {
    const { data: newStats } = await supabase
      .from("user_stats")
      .insert({ user_id: userId })
      .select()
      .single();
    stats = newStats;
  }

  if (!stats) return;

  // Count mood logs and journal entries
  const { count: moodCount } = await supabase
    .from("mood_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const { count: journalCount } = await supabase
    .from("journal_entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Check for streak
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  
  const { data: todayLog } = await supabase
    .from("mood_logs")
    .select("created_at")
    .eq("user_id", userId)
    .gte("created_at", today)
    .maybeSingle();

  let currentStreak = stats.current_streak;
  
  if (todayLog) {
    if (stats.last_activity_date === yesterday || !stats.last_activity_date) {
      currentStreak += 1;
    }
  } else if (stats.last_activity_date !== today) {
    currentStreak = 0;
  }

  const longestStreak = Math.max(currentStreak, stats.longest_streak);
  const growthPoints = (moodCount || 0) * 5 + (journalCount || 0) * 10 + currentStreak * 20;
  const growthLevel = Math.floor(growthPoints / 100) + 1;

  // Update stats
  await supabase
    .from("user_stats")
    .update({
      current_streak: currentStreak,
      longest_streak: longestStreak,
      total_mood_logs: moodCount || 0,
      total_journal_entries: journalCount || 0,
      growth_points: growthPoints,
      growth_level: growthLevel,
      last_activity_date: today,
    })
    .eq("user_id", userId);

  // Check and award achievements
  await checkAchievements(userId, {
    currentStreak,
    moodCount: moodCount || 0,
    journalCount: journalCount || 0,
  });
};

const checkAchievements = async (
  userId: string,
  stats: { currentStreak: number; moodCount: number; journalCount: number }
) => {
  const { data: existingAchievements } = await supabase
    .from("achievements")
    .select("achievement_type")
    .eq("user_id", userId);

  const earned = new Set(existingAchievements?.map((a) => a.achievement_type) || []);

  // 7-day streak
  if (stats.currentStreak >= 7 && !earned.has("streak_7")) {
    await supabase.from("achievements").insert({
      user_id: userId,
      achievement_type: "streak_7",
      achievement_name: "7-Day Reflection Streak 🌙",
      achievement_description: "Logged mood for 7 consecutive days",
      icon: "trophy",
    });
    toast.success("🎉 Achievement Unlocked: 7-Day Reflection Streak!");
  }

  // 10 journal entries
  if (stats.journalCount >= 10 && !earned.has("journal_10")) {
    await supabase.from("achievements").insert({
      user_id: userId,
      achievement_type: "journal_10",
      achievement_name: "Empathy Star 🌟",
      achievement_description: "Completed 10 journal entries",
      icon: "star",
    });
    toast.success("🎉 Achievement Unlocked: Empathy Star!");
  }

  // First mood log
  if (stats.moodCount === 1 && !earned.has("first_mood")) {
    await supabase.from("achievements").insert({
      user_id: userId,
      achievement_type: "first_mood",
      achievement_name: "First Step 🌱",
      achievement_description: "Logged your first mood",
      icon: "zap",
    });
    toast.success("🎉 Achievement Unlocked: First Step!");
  }
};
