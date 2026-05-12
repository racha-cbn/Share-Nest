import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CITIES } from "@/data/posts";
import { HeartHandshake, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState("donor");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) {
      toast({ title: "Erreur", description: "Veuillez sélectionner une ville.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await apiClient.register({ name, email, password, city, role });
      login(token, user);
      toast({
        title: "Inscription réussie !",
        description: `Bienvenue dans la communauté Sharenest, ${user.name} !`,
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-xl shadow-lg border-border/50">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="mx-auto w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-2">
              <HeartHandshake className="h-6 w-6 text-accent" />
            </div>
            <CardTitle className="text-2xl font-bold">Rejoindre la communauté</CardTitle>
            <CardDescription>Créez votre compte pour commencer à partager dans votre ville.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    placeholder="Amine K."
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-testid="input-register-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger id="city" data-testid="select-register-city">
                      <SelectValue placeholder="Sélectionnez une ville" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-register-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-register-password"
                />
              </div>

              <div className="space-y-3 pt-2 border-t mt-4">
                <Label>Je souhaite principalement :</Label>
                <RadioGroup value={role} onValueChange={setRole} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="donor" id="r1" />
                    <Label htmlFor="r1" className="flex-1 cursor-pointer font-normal">Donner et partager des objets/services</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="requester" id="r2" />
                    <Label htmlFor="r2" className="flex-1 cursor-pointer font-normal">Demander de l'aide ou des objets</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 mt-4"
                disabled={loading}
                data-testid="btn-submit-register"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création du compte...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4 mt-2">
            <div className="text-sm text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <Link href="/login">
                <span className="text-primary font-medium hover:underline cursor-pointer" data-testid="link-to-login">
                  Connectez-vous
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
