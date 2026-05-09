import { useState } from "react";
import { Post } from "@/data/posts";
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
import { HeartHandshake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ post, isOpen, onClose }: ContactModalProps) {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  if (!post) return null;

  const isOffre = post.type === "offre";
  const actionText = isOffre ? "Demander cet objet/service" : "Proposer votre aide";
  
  const handleSend = () => {
    if (!message.trim()) return;
    
    toast({
      title: "Message envoyé avec succès !",
      description: `Votre message a été transmis à ${post.authorName}.`,
    });
    
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HeartHandshake className={`w-5 h-5 ${isOffre ? "text-primary" : "text-accent"}`} />
            {actionText}
          </DialogTitle>
          <DialogDescription>
            Concernant l'annonce : <span className="font-semibold text-foreground">{post.title}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
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
            disabled={!message.trim()}
            data-testid="btn-send-message"
          >
            Envoyer le message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
