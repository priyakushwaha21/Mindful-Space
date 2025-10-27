import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Play, Pause } from "lucide-react";

const mindfulnessExercises = [
  {
    title: "Body Scan",
    duration: "10 minutes",
    description: "Bring awareness to each part of your body, from toes to head.",
  },
  {
    title: "Mindful Breathing",
    duration: "5 minutes",
    description: "Focus on the natural rhythm of your breath.",
  },
  {
    title: "Present Moment",
    duration: "7 minutes",
    description: "Notice what you can see, hear, feel, smell, and taste right now.",
  },
  {
    title: "Gratitude Reflection",
    duration: "5 minutes",
    description: "Think of three things you're grateful for today.",
  },
];

const Mindfulness = () => {
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <CardTitle>Mindfulness Sessions</CardTitle>
        </div>
        <CardDescription>Practice being present</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mindfulnessExercises.map((exercise, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              selectedExercise === index
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => {
              setSelectedExercise(index);
              setIsPlaying(false);
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{exercise.title}</h4>
                <p className="text-sm text-muted-foreground">{exercise.duration}</p>
              </div>
              {selectedExercise === index && (
                <Button
                  size="sm"
                  variant="calm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(!isPlaying);
                  }}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              )}
            </div>
            {selectedExercise === index && (
              <p className="text-sm mt-2">{exercise.description}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Mindfulness;
