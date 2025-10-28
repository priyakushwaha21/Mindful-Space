import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import BreathingExercise from "@/components/BreathingExercise";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BreathingExercisePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">💨</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 sm:pt-24 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/wellness")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Wellness
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Breathing Exercise 💨
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Practice mindful breathing to calm your mind
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <BreathingExercise />
        </div>
      </div>
    </div>
  );
};

export default BreathingExercisePage;
