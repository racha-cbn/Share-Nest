import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
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
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ImagePlus, X, Loader2 } from "lucide-react";

const formSchema = z.object({
  type: z.enum(["offre", "demande"]),
  title: z.string().min(5, { message: "Le titre doit contenir au moins 5 caractères." }),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères." }),
  category: z.string().min(1, { message: "Veuillez sélectionner une catégorie." }),
  city: z.string().min(1, { message: "Veuillez sélectionner une ville." }),
  urgency: z.string().optional(),
  delivery: z.boolean().default(false),
  anonymous: z.boolean().default(false),
  authorName: z.string().min(2, { message: "Votre nom est requis." }),
  authorEmail: z.string().email({ message: "Email valide requis." }),
  authorPhone: z.string().optional(),
});

export default function Publier() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "offre",
      title: "",
      description: "",
      category: "",
      city: user?.city || "",
      urgency: "Faible",
      delivery: false,
      anonymous: false,
      authorName: user?.name || "",
      authorEmail: user?.email || "",
      authorPhone: "",
    },
  });

  const type = form.watch("type");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Fichier trop grand", description: "La photo ne doit pas dépasser 5 Mo.", variant: "destructive" });
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      await apiClient.createPost({
        type: values.type,
        title: values.title,
        description: values.description,
        category: values.category,
        city: values.city,
        urgency: values.urgency as "Faible" | "Moyen" | "Urgent" | undefined,
        authorName: values.anonymous ? "Anonyme" : values.authorName,
        authorEmail: values.authorEmail,
        authorPhone: values.authorPhone || undefined,
        image: imageFile || undefined,
      });
      toast({
        title: "Annonce publiée !",
        description: "Votre annonce est maintenant visible par la communauté.",
      });
      setTimeout(() => setLocation("/"), 1200);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de publier l'annonce.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
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
                            {CATEGORIES.map((cat) => (
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
                            {CITIES.map((city) => (
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

                {/* ── Image Upload ──────────────────────────────── */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Photo (optionnelle)</Label>
                  {imagePreview ? (
                    <div className="relative w-full max-w-sm">
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        className="w-full h-52 object-cover rounded-lg border border-border/50"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center transition-colors"
                        aria-label="Supprimer la photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full max-w-sm h-36 border-2 border-dashed border-border/60 rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                    >
                      <ImagePlus className="w-8 h-8" />
                      <span className="text-sm font-medium">Ajouter une photo</span>
                      <span className="text-xs">JPG, PNG, WebP — max 5 Mo</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

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

                {!user && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium">Vos coordonnées</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="authorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Votre nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Amine K." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="authorEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Votre email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="nom@exemple.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="authorPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone (optionnel)</FormLabel>
                          <FormControl>
                            <Input placeholder="0550 123 456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-delivery" />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">Livraison ou déplacement possible</FormLabel>
                            <FormDescription>Je peux me déplacer pour apporter l'objet ou rendre le service.</FormDescription>
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
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-anonymous" />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">Publier anonymement</FormLabel>
                          <FormDescription>Votre nom ne sera pas affiché publiquement.</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className={`w-full text-lg ${type === "offre" ? "bg-primary hover:bg-primary/90" : "bg-accent hover:bg-accent/90 text-accent-foreground"}`}
                  disabled={submitting}
                  data-testid="btn-submit-publish"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Publication en cours...
                    </>
                  ) : (
                    "Publier l'annonce"
                  )}
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
