import { useState } from "react";
import { type Post } from "@/lib/api";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeartHandshake, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ post, isOpen, onClose }: ContactModalProps) {
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  if (!post) return null;

  const isOffre = post.type === "offre";
  const actionText = isOffre ? "Demander cet objet/service" : "Proposer votre aide";

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!user && (!senderName.trim() || !senderEmail.trim())) {
      toast({ title: "Erreur", description: "Veuillez renseigner votre nom et email.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      await apiClient.sendMessage({
        postId: String(post.id),
        receiverId: post.authorEmail,
        content: message,
        senderName: user?.name || senderName,
        senderEmail: user?.email || senderEmail,
      });
      toast({
        title: "Message envoyé !",
        description: `Votre message a été transmis à ${post.authorName}.`,
      });
      setMessage("");
      setSenderName("");
      setSenderEmail("");
      onClose();
    } catch (error: any) {
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Impossible d'envoyer le message.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HeartHandshake className={`w-5 h-5 ${isOffre ? "text-primary" : "text-accent"}`} />
            {actionText}
          </DialogTitle>
          <DialogDescription>
            Concernant : <span className="font-semibold text-foreground">{post.title}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {!user && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Votre nom</Label>
                <Input
                  placeholder="Amine K."
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Votre email</Label>
                <Input
                  type="email"
                  placeholder="nom@exemple.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                />
              </div>
            </div>
          )}
          <Textarea
            placeholder={`Votre message à ${post.authorName}... Soyez poli et précis.`}
            className="min-h-[120px] resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            data-testid="textarea-message"
          />
          <p className="text-xs text-muted-foreground">
            Vos coordonnées seront partagées uniquement après acceptation de {post.authorName}.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="btn-cancel-contact">
            Annuler
          </Button>
          <Button
            className={isOffre ? "bg-primary hover:bg-primary/90" : "bg-accent hover:bg-accent/90 text-accent-foreground"}
            onClick={handleSend}
            disabled={!message.trim() || sending}
            data-testid="btn-send-message"
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              "Envoyer le message"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
