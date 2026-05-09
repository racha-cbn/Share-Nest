import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CITIES, CATEGORIES } from "@/data/posts";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLocation } from "wouter";

const formSchema = z.object({
  type: z.enum(["offre", "demande"]),
  title: z.string().min(5, {
    message: "Le titre doit contenir au moins 5 caractères.",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
  category: z.string().min(1, { message: "Veuillez sélectionner une catégorie." }),
  city: z.string().min(1, { message: "Veuillez sélectionner une ville." }),
  urgency: z.string().optional(),
  delivery: z.boolean().default(false),
  anonymous: z.boolean().default(false),
});

export default function Publier() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "offre",
      title: "",
      description: "",
      category: "",
      city: "",
      urgency: "Faible",
      delivery: false,
      anonymous: false,
    },
  });

  const type = form.watch("type");

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Annonce publiée !",
      description: "Votre annonce est maintenant visible par la communauté.",
    });
    setTimeout(() => setLocation("/"), 1500);
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Publier une annonce</h1>
          <p className="text-muted-foreground mt-2">Partagez avec vos voisins ou demandez un coup de main.</p>
        </div>

        <Card className="shadow-sm border-border/50">
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Type Selection */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold">Type d'annonce</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <RadioGroupItem value="offre" id="offre" className="peer sr-only" />
                                <Label
                                  htmlFor="offre"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                >
                                  <span className="font-semibold text-lg text-primary mb-1">Offrir</span>
                                  <span className="text-xs text-muted-foreground text-center font-normal">Je donne un objet ou je propose mon aide</span>
                                </Label>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <RadioGroupItem value="demande" id="demande" className="peer sr-only" />
                                <Label
                                  htmlFor="demande"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 cursor-pointer transition-all"
                                >
                                  <span className="font-semibold text-lg text-orange-600 mb-1">Demander</span>
                                  <span className="text-xs text-muted-foreground text-center font-normal">J'ai besoin d'un objet ou d'un service</span>
                                </Label>
                              </div>
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-pub-category">
                              <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-pub-city">
                              <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CITIES.map(city => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre de l'annonce</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Donne canapé 3 places, Cherche prof de maths..." {...field} data-testid="input-pub-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description détaillée</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez l'objet ou le service en détail (état, dimensions, disponibilités...)" 
                          className="min-h-[120px]"
                          {...field} 
                          data-testid="input-pub-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {type === "demande" && (
                  <FormField
                    control={form.control}
                    name="urgency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Niveau d'urgence</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-pub-urgency">
                              <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Faible">Faible - Pas pressé</SelectItem>
                            <SelectItem value="Moyen">Moyen - Dans les prochains jours</SelectItem>
                            <SelectItem value="Urgent">Urgent - Dès que possible</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium">Options supplémentaires</h3>
                  
                  {type === "offre" && (
                    <FormField
                      control={form.control}
                      name="delivery"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-white">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-delivery"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              Livraison ou déplacement possible
                            </FormLabel>
                            <FormDescription>
                              Je peux me déplacer pour apporter l'objet ou rendre le service.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="anonymous"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-white">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-anonymous"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            Publier anonymement
                          </FormLabel>
                          <FormDescription>
                            Votre nom ne sera pas affiché publiquement (uniquement aux personnes que vous acceptez).
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className={`w-full text-lg ${type === "offre" ? "bg-primary hover:bg-primary/90" : "bg-accent hover:bg-accent/90 text-accent-foreground"}`}
                  data-testid="btn-submit-publish"
                >
                  Publier l'annonce
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
