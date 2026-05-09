import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { HeartHandshake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Connexion réussie",
      description: "Bienvenue sur Sharenest !",
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-border/50">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <HeartHandshake className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Heureux de vous revoir</CardTitle>
            <CardDescription>
              Connectez-vous pour continuer à partager.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nom@exemple.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-login-email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <a href="#" className="text-sm text-primary hover:underline" tabIndex={-1}>
                    Mot de passe oublié ?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-login-password"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 mt-2" data-testid="btn-submit-login">
                Se connecter
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4 mt-2">
            <div className="text-sm text-muted-foreground">
              Vous n'avez pas de compte ?{" "}
              <Link href="/register">
                <span className="text-primary font-medium hover:underline cursor-pointer" data-testid="link-to-register">
                  Inscrivez-vous
                </span>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
