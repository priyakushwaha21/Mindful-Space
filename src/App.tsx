import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MoodTracker from "./pages/MoodTracker";
import Journal from "./pages/Journal";
import Chat from "./pages/Chat";
import Analytics from "./pages/Analytics";
import Wellness from "./pages/Wellness";
import Gamification from "./pages/Gamification";
import BreathingExercisePage from "./pages/BreathingExercisePage";
import MindfulnessPage from "./pages/MindfulnessPage";
import WellnessGoalsPage from "./pages/WellnessGoalsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mood" element={<MoodTracker />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/breathing-exercise" element={<BreathingExercisePage />} />
          <Route path="/mindfulness" element={<MindfulnessPage />} />
          <Route path="/wellness-goals" element={<WellnessGoalsPage />} />
          <Route path="/growth" element={<Gamification />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
