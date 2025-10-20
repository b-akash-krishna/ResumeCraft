import { Switch, Route, useRoute, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import ResumeBuilder from "@/pages/ResumeBuilder";
import MockInterview from "@/pages/MockInterview";
import InterviewReport from "@/pages/InterviewReport";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login"; 
import Register from "@/pages/Register"; 
import Settings from "@/pages/Settings"; // <--- ADDED IMPORT
import NotFound from "@/pages/not-found";

// Component that wraps protected routes
function ProtectedRoute({ path, component: Component }: { path: string; component: React.ComponentType | ((params: any) => JSX.Element) }) {
  const [match, params] = useRoute(path);
  const isAuthenticated = !!localStorage.getItem("auth_token");

  if (match) {
    if (!isAuthenticated) {
      // Redirect to login if token is missing
      return <Redirect to="/login" />;
    }
    // Render the component if authenticated, passing URL parameters
    return <Component {...params} />;
  }

  return null;
}

function Router() {
  
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} /> 
      <Route path="/register" component={Register} /> 
      <Route path="/settings" component={Settings} /> {/* <--- ADDED ROUTE */}
      
      {/* Protected Routes - Use ProtectedRoute wrapper */}
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/mock-interview" component={MockInterview} />
      <ProtectedRoute path="/interview-report" component={InterviewReport} />
      
      {/* ResumeBuilder Routes (New/Edit) */}
      <ProtectedRoute path="/resume-builder" component={ResumeBuilder} />
      <ProtectedRoute path="/resume-builder/:resumeId" component={ResumeBuilder} />

      {/* Catch-all Not Found Route */}
      <Route component={NotFound} />
    </Switch>
  );
  
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;