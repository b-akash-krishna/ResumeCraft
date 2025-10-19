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
  // Define protected paths
  const protectedPaths = [
    // Added parameterized route for loading a specific resume
    "/resume-builder/:resumeId", 
    "/resume-builder", 
    "/mock-interview", 
    "/interview-report", 
    "/dashboard"
  ];
  
  // Define public paths that shouldn't redirect
  const publicPaths = ["/", "/login", "/register"];

  // The ProtectedRoute logic handles which component to render based on path match.
  // We need to update the component mapping to handle the ResumeBuilder routes.

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} /> 
      <Route path="/register" component={Register} /> 
      
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