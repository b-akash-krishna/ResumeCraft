import { useState } from "react";
// FIX: Replace direct navigate import with useLocation hook to guarantee access to navigate function
import { Link, useLocation } from "wouter"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiRequest } from "@/lib/queryClient"; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the navigate function from the hook
  const [, navigate] = useLocation(); // We only need the second element, navigate

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // API call to the backend login endpoint
      const res = await apiRequest("POST", "/api/auth/login", {
        username,
        password,
      });

      // Parse the JSON response, which contains the token
      const result = await res.json() as { id: string, username: string, token: string };
      
      // Store the JWT token as required
      localStorage.setItem("auth_token", result.token);
      console.log("Login successful, token stored.");

      // Navigate to dashboard upon success
      navigate("/dashboard");

    } catch (err: any) {
      console.error("Login failed:", err.message);
      // Clean up the error message for display
      const message = err.message.replace(/401: /, "").trim() || "Login failed. Please check your credentials.";
      setError(message);
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
            <CardTitle className="text-3xl">Welcome Back</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sign in to access your resumes and interviews
            </p>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleLogin}>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  data-testid="input-password"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive p-3 bg-destructive/10 border border-destructive/30 rounded-md" data-testid="alert-error">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full mt-2" disabled={isLoading} data-testid="button-login">
                {isLoading ? "Signing In..." : "Login"}
              </Button>

              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link href="/register">
                  <span className="underline hover:text-primary cursor-pointer font-medium" data-testid="link-register">
                    Register
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