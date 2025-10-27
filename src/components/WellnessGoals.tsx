import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_value: number;
  current_value: number;
  goal_type: string;
  completed: boolean;
}

const WellnessGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", target: 7 });

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    const { data, error } = await supabase
      .from("wellness_goals")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load goals");
    } else {
      setGoals(data || []);
    }
  };

  const addGoal = async () => {
    if (!newGoal.title.trim()) {
      toast.error("Please enter a goal title");
      return;
    }

    const { error } = await supabase.from("wellness_goals").insert({
      user_id: user?.id,
      title: newGoal.title,
      target_value: newGoal.target,
      goal_type: "custom",
    });

    if (error) {
      toast.error("Failed to add goal");
    } else {
      toast.success("Goal added!");
      setNewGoal({ title: "", target: 7 });
      setShowAddGoal(false);
      loadGoals();
    }
  };

  const updateProgress = async (goalId: string, newValue: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const completed = newValue >= goal.target_value;

    const { error } = await supabase
      .from("wellness_goals")
      .update({ current_value: newValue, completed })
      .eq("id", goalId);

    if (error) {
      toast.error("Failed to update progress");
    } else {
      if (completed) {
        toast.success("🎉 Goal completed!");
      }
      loadGoals();
    }
  };

  const deleteGoal = async (goalId: string) => {
    const { error } = await supabase.from("wellness_goals").delete().eq("id", goalId);

    if (error) {
      toast.error("Failed to delete goal");
    } else {
      toast.success("Goal deleted");
      loadGoals();
    }
  };

  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <CardTitle>Wellness Goals</CardTitle>
          </div>
          <Button size="sm" variant="calm" onClick={() => setShowAddGoal(!showAddGoal)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>Track your wellness objectives</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddGoal && (
          <div className="p-4 border rounded-lg space-y-3 bg-accent/5">
            <Input
              placeholder="Goal title (e.g., '7-day meditation streak')"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Target (days)"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) })}
            />
            <div className="flex gap-2">
              <Button size="sm" variant="calm" onClick={addGoal} className="flex-1">
                Add Goal
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setShowAddGoal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {goals.length === 0 && !showAddGoal && (
          <p className="text-center text-muted-foreground py-4">No goals yet. Create one to get started!</p>
        )}

        {goals.map((goal) => (
          <div key={goal.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{goal.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {goal.current_value} / {goal.target_value} days
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteGoal(goal.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            <Progress value={(goal.current_value / goal.target_value) * 100} />
            {!goal.completed && (
              <Button
                size="sm"
                variant="calm"
                className="w-full"
                onClick={() => updateProgress(goal.id, goal.current_value + 1)}
              >
                Mark Today Complete
              </Button>
            )}
            {goal.completed && (
              <div className="text-center text-primary font-semibold">✓ Goal Completed!</div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WellnessGoals;
