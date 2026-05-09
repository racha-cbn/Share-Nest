import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_POSTS, Post } from "@/data/posts";
import { Pencil, Trash2, CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  // Simulate logged-in user posts (authorInitials is mostly arbitrary here just to filter)
  const myPosts = MOCK_POSTS.slice(0, 5); // Just take the first 5 for demo
  
  const [posts, setPosts] = useState<Post[]>(myPosts);
  const { toast } = useToast();

  const myOffres = posts.filter(p => p.type === "offre");
  const myDemandes = posts.filter(p => p.type === "demande");

  const handleStatusChange = (id: string, newStatus: Post["status"]) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status: newStatus } : p));
    toast({
      title: "Statut mis à jour",
      description: `L'annonce a été marquée comme "${newStatus}".`,
    });
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
    toast({
      title: "Annonce supprimée",
      description: "L'annonce a été retirée de la plateforme.",
      variant: "destructive"
    });
  };

  const StatusBadge = ({ status }: { status: Post["status"] }) => {
    switch (status) {
      case "disponible":
        return <Badge className="bg-green-500 hover:bg-green-600">Disponible</Badge>;
      case "réservé":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Réservé</Badge>;
      case "terminé":
        return <Badge variant="outline" className="text-gray-500 bg-gray-100">Terminé</Badge>;
      default:
        return null;
    }
  };

  const renderPostList = (postList: Post[]) => {
    if (postList.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">Aucune annonce</h3>
          <p className="text-muted-foreground mt-2">Vous n'avez pas encore publié dans cette catégorie.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {postList.map(post => (
          <Card key={post.id} className="flex flex-col sm:flex-row overflow-hidden shadow-sm">
            <div className="flex-1">
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <div className="text-sm text-muted-foreground mt-1">{post.timeAgo} • {post.city}</div>
                </div>
                <StatusBadge status={post.status} />
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
              </CardContent>
            </div>
            
            <div className="bg-gray-50/50 sm:w-48 sm:border-l border-t sm:border-t-0 p-4 flex sm:flex-col justify-end gap-2 items-stretch">
              {post.status !== "terminé" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-green-700 hover:text-green-800 hover:bg-green-50"
                  onClick={() => handleStatusChange(post.id, "terminé")}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Terminer
                </Button>
              )}
              <Button variant="outline" size="sm" className="flex-1">
                <Pencil className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(post.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mon Tableau de bord</h1>
            <p className="text-muted-foreground mt-2">Gérez vos annonces et suivez vos échanges.</p>
          </div>
        </div>

        <Tabs defaultValue="offres" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
            <TabsTrigger value="offres" data-testid="tab-offres">
              Mes Offres ({myOffres.length})
            </TabsTrigger>
            <TabsTrigger value="demandes" data-testid="tab-demandes">
              Mes Demandes ({myDemandes.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="offres" className="mt-0">
            {renderPostList(myOffres)}
          </TabsContent>
          
          <TabsContent value="demandes" className="mt-0">
            {renderPostList(myDemandes)}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
