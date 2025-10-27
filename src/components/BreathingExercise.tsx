import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind } from "lucide-react";

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setPhase((p) => {
            if (p === "inhale") return "hold";
            if (p === "hold") return "exhale";
            return "inhale";
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const phaseText = {
    inhale: "Breathe In",
    hold: "Hold",
    exhale: "Breathe Out",
  };

  const phaseColor = {
    inhale: "from-primary to-primary-glow",
    hold: "from-accent to-secondary",
    exhale: "from-secondary to-accent",
  };

  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-primary" />
          <CardTitle>Breathing Exercise</CardTitle>
        </div>
        <CardDescription>4-4-4 breathing technique</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isActive && (
          <div className="flex flex-col items-center gap-4">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${phaseColor[phase]} flex items-center justify-center animate-pulse`}>
              <span className="text-4xl font-bold text-primary-foreground">{countdown}</span>
            </div>
            <p className="text-2xl font-semibold">{phaseText[phase]}</p>
          </div>
        )}
        <Button 
          variant={isActive ? "secondary" : "calm"} 
          className="w-full"
          onClick={() => {
            setIsActive(!isActive);
            if (!isActive) {
              setPhase("inhale");
              setCountdown(4);
            }
          }}
        >
          {isActive ? "Stop" : "Start Exercise"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BreathingExercise;
