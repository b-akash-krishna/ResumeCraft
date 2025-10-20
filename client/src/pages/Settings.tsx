import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Key, Save, AlertCircle } from "lucide-react";

export default function Settings() {
    const { toast } = useToast();
    const [apiKey, setApiKey] = useState("");
    const [isSaved, setIsSaved] = useState(false);

    // Placeholder for demonstrating local API key storage
    const LOCAL_AI_KEY = "mock_ai_api_key";

    useEffect(() => {
        // Load existing key from local storage on component mount
        const storedKey = localStorage.getItem(LOCAL_AI_KEY);
        if (storedKey) {
            setApiKey(storedKey);
            setIsSaved(true);
        }
    }, []);

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem(LOCAL_AI_KEY, apiKey.trim());
            setIsSaved(true);
            toast({
                title: "API Key Saved",
                description: "Key stored locally for testing AI features.",
            });
        } else {
            localStorage.removeItem(LOCAL_AI_KEY);
            setIsSaved(false);
            toast({
                title: "Key Removed",
                description: "AI functionality will now rely on backend environment settings.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-8">
                        <h1 className="text-4xl font-bold">Application Settings</h1>
                        <p className="text-lg text-muted-foreground">
                            Configure environment variables for debugging and development.
                        </p>
                    </div>

                    <Card className="p-8">
                        <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Key className="w-6 h-6 text-primary" />
                                OpenAI API Key (Local Test)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="api-key">Key (Stored in Browser LocalStorage)</Label>
                                <Input
                                    id="api-key"
                                    type="password"
                                    placeholder="sk-..."
                                    value={apiKey}
                                    onChange={(e) => {
                                        setApiKey(e.target.value);
                                        setIsSaved(false);
                                    }}
                                />
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                                <span>Note: This **DOES NOT** fix the backend 500 error. The backend MUST have the key set in its environment.</span>
                            </div>

                            <Button onClick={handleSave} className="gap-2" disabled={isSaved}>
                                <Save className="w-4 h-4" />
                                {isSaved ? "Key Saved" : "Save Key Locally"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}