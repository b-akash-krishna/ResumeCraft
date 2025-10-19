import { useState } from "react";
// FIX: Using useLocation hook to safely access the navigate function.
import { Link, useLocation } from "wouter"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiRequest } from "@/lib/queryClient";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the navigate function from the hook
  const [, navigate] = useLocation(); // We only need the second element, navigate

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);
    setIsLoading(true);

    try {
      // API call to the backend registration endpoint
      const res = await apiRequest("POST", "/api/auth/register", {
        username,
        password,
      });

      const result = await res.json();
      
      console.log("Registration successful:", result.username);

      // In a real flow, you might automatically log them in or redirect
      // For now, show a success message
      setIsSuccess(true);
      setError(null);
      setUsername("");
      setPassword("");

      // Optional: Auto-navigate after a delay
      setTimeout(() => navigate("/login"), 2000);

    } catch (err: any) {
      console.error("Registration failed:", err.message);
      // Clean up the error message for display
      const message = err.message.replace(/400: Error: /, "").trim() || "Registration failed. Please try a different username.";
      setError(message);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Create Account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sign up to start optimizing your resume
            </p>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleRegister}>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading || isSuccess}
                  data-testid="input-username"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isSuccess}
                  data-testid="input-password"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive p-3 bg-destructive/10 border border-destructive/30 rounded-md" data-testid="alert-error">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {isSuccess && (
                <div className="flex items-center gap-2 text-sm text-chart-3 p-3 bg-chart-3/10 border border-chart-3/30 rounded-md font-medium" data-testid="alert-success">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Registration successful! Redirecting to login...</span>
                </div>
              )}

              <Button type="submit" className="w-full mt-2" disabled={isLoading || isSuccess} data-testid="button-register">
                {isLoading ? "Creating Account..." : "Register"}
              </Button>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login">
                  <span className="underline hover:text-primary cursor-pointer font-medium" data-testid="link-login">
                    Login
                  </span>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}