import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Brain, Target, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const Wellness = () => {
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
            <span className="text-2xl">🧘‍♀️</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const wellnessFeatures = [
    {
      icon: Wind,
      title: "Breathing Exercise",
      description: "Practice 4-4-4 breathing technique to calm your mind and reduce stress",
      link: "/breathing-exercise",
      gradient: "from-primary to-primary-glow",
    },
    {
      icon: Brain,
      title: "Mindfulness Sessions",
      description: "Guided meditation and mindfulness practices for inner peace",
      link: "/mindfulness",
      gradient: "from-secondary to-accent",
    },
    {
      icon: Target,
      title: "Wellness Goals",
      description: "Set, track, and achieve your personal wellness objectives",
      link: "/wellness-goals",
      gradient: "from-accent to-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 sm:pt-24 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Wellness Center 🧘‍♀️
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Take care of your mind and body
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {wellnessFeatures.map((feature) => (
            <Link key={feature.link} to={feature.link}>
              <Card className="h-full shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardHeader>
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-sm sm:text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-primary group-hover:gap-4 transition-all duration-300">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wellness;
