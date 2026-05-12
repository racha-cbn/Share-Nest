import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Post, type Message } from "@/lib/api";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  Trash2, CheckCircle2, Clock, Loader2, HeartHandshake,
  MessageCircle, Inbox, Mail, MailOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setLoadingPosts(false);
      setLoadingMessages(false);
      return;
    }

    apiClient.getPosts(user.email)
      .then(setPosts)
      .catch(() => toast({ title: "Erreur", description: "Impossible de charger vos annonces.", variant: "destructive" }))
      .finally(() => setLoadingPosts(false));

    apiClient.getMessages()
      .then(setMessages)
      .catch(() => toast({ title: "Erreur", description: "Impossible de charger vos messages.", variant: "destructive" }))
      .finally(() => setLoadingMessages(false));
  }, [user]);

  const myOffres = posts.filter((p) => p.type === "offre");
  const myDemandes = posts.filter((p) => p.type === "demande");
  const unreadCount = messages.filter((m) => m.isRead === "false" && m.receiverId === user?.email).length;

  const handleStatusChange = async (id: number, newStatus: Post["status"]) => {
    try {
      const updated = await apiClient.updatePost(id, { status: newStatus });
      setPosts(posts.map((p) => (p.id === id ? updated : p)));
      toast({ title: "Statut mis à jour", description: `Annonce marquée comme "${newStatus}".` });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deletePost(id);
      setPosts(posts.filter((p) => p.id !== id));
      toast({ title: "Annonce supprimée", variant: "destructive" });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      const updated = await apiClient.markMessageRead(id);
      setMessages(messages.map((m) => (m.id === id ? updated : m)));
    } catch {
      // silently ignore
    }
  };

  const StatusBadge = ({ status }: { status: Post["status"] }) => {
    switch (status) {
      case "disponible": return <Badge className="bg-green-500 hover:bg-green-600">Disponible</Badge>;
      case "réservé": return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Réservé</Badge>;
      case "terminé": return <Badge variant="outline" className="text-gray-500 bg-gray-100">Terminé</Badge>;
      default: return null;
    }
  };

  const renderPostList = (postList: Post[]) => {
    if (loadingPosts) {
      return <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>;
    }
    if (postList.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">Aucune annonce</h3>
          <p className="text-muted-foreground mt-2">Vous n'avez pas encore publié dans cette catégorie.</p>
          <Link href="/publier">
            <Button className="mt-4 bg-primary hover:bg-primary/90">Publier une annonce</Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {postList.map((post) => (
          <Card key={post.id} className="flex flex-col sm:flex-row overflow-hidden shadow-sm">
            <div className="flex-1">
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    {new Date(post.createdAt).toLocaleDateString("fr-FR")} • {post.city}
                  </div>
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
                  variant="outline" size="sm"
                  className="flex-1 text-green-700 hover:text-green-800 hover:bg-green-50"
                  onClick={() => handleStatusChange(post.id, "terminé")}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Terminer
                </Button>
              )}
              {post.status === "disponible" && (
                <Button
                  variant="outline" size="sm"
                  className="flex-1 text-yellow-700 hover:bg-yellow-50"
                  onClick={() => handleStatusChange(post.id, "réservé")}
                >
                  Réserver
                </Button>
              )}
              <Button
                variant="outline" size="sm"
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

  const renderMessages = () => {
    if (loadingMessages) {
      return <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>;
    }
    if (messages.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
          <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">Aucun message</h3>
          <p className="text-muted-foreground mt-2">Les messages reçus sur vos annonces apparaîtront ici.</p>
        </div>
      );
    }

    const received = messages.filter((m) => m.receiverId === user?.email);
    const sent = messages.filter((m) => m.senderId === String(user?.id));

    return (
      <div className="space-y-6">
        {received.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              Reçus ({received.length})
            </h3>
            <div className="grid gap-3">
              {received.map((msg) => (
                <MessageCard
                  key={msg.id}
                  msg={msg}
                  type="received"
                  onRead={handleMarkRead}
                />
              ))}
            </div>
          </div>
        )}

        {sent.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Envoyés ({sent.length})
            </h3>
            <div className="grid gap-3">
              {sent.map((msg) => (
                <MessageCard
                  key={msg.id}
                  msg={msg}
                  type="sent"
                  onRead={handleMarkRead}
                />
              ))}
            </div>
          </div>
        )}

        {received.length === 0 && sent.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed">
            <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">Aucun message</h3>
            <p className="text-muted-foreground mt-2">Les messages apparaîtront ici.</p>
          </div>
        )}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-4">
          <HeartHandshake className="h-16 w-16 text-muted-foreground opacity-40" />
          <h2 className="text-xl font-semibold">Connectez-vous pour accéder à votre tableau de bord</h2>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90">Se connecter</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mon Tableau de bord</h1>
            <p className="text-muted-foreground mt-1">
              Bonjour, <span className="font-medium text-foreground">{user.name}</span> — {user.city}
            </p>
          </div>
          <Link href="/publier">
            <Button className="bg-primary hover:bg-primary/90">+ Nouvelle annonce</Button>
          </Link>
        </div>

        <Tabs defaultValue="offres" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mb-8">
            <TabsTrigger value="offres" data-testid="tab-offres">
              Offres ({myOffres.length})
            </TabsTrigger>
            <TabsTrigger value="demandes" data-testid="tab-demandes">
              Demandes ({myDemandes.length})
            </TabsTrigger>
            <TabsTrigger value="messages" data-testid="tab-messages" className="relative">
              <MessageCircle className="w-4 h-4 mr-1" />
              Messages
              {unreadCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="offres" className="mt-0">{renderPostList(myOffres)}</TabsContent>
          <TabsContent value="demandes" className="mt-0">{renderPostList(myDemandes)}</TabsContent>
          <TabsContent value="messages" className="mt-0">{renderMessages()}</TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

function MessageCard({
  msg,
  type,
  onRead,
}: {
  msg: Message;
  type: "received" | "sent";
  onRead: (id: number) => void;
}) {
  const isUnread = msg.isRead === "false" && type === "received";
  const date = new Date(msg.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card
      className={`shadow-sm transition-all ${isUnread ? "border-primary/40 bg-primary/5" : "border-border/50 bg-white"}`}
      onClick={() => isUnread && onRead(msg.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`mt-0.5 shrink-0 ${isUnread ? "text-primary" : "text-muted-foreground"}`}>
              {isUnread ? <Mail className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">
                  {type === "received" ? msg.senderName : `À : ${msg.receiverId}`}
                </span>
                {type === "received" && msg.senderEmail && (
                  <span className="text-xs text-muted-foreground">({msg.senderEmail})</span>
                )}
                {isUnread && (
                  <Badge className="bg-primary text-white text-xs py-0 h-5">Nouveau</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Annonce n°{msg.postId}
              </p>
              <p className="text-sm mt-2 text-foreground leading-relaxed">{msg.content}</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{date}</span>
        </div>
        {isUnread && (
          <div className="mt-3 pt-3 border-t flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={(e) => { e.stopPropagation(); onRead(msg.id); }}
            >
              Marquer comme lu
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
