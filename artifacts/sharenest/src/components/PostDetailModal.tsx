import { type Post } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock, Tag, Phone, Mail } from "lucide-react";

interface PostDetailModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onContact: (post: Post) => void;
}

export function PostDetailModal({ post, isOpen, onClose, onContact }: PostDetailModalProps) {
  if (!post) return null;

  const isOffre = post.type === "offre";
  const initials = post.authorName.split(" ").map((n) => n[0]).join("").toUpperCase();
  const formattedDate = new Date(post.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const statusColor: Record<Post["status"], string> = {
    disponible: "bg-green-100 text-green-800 border-green-200",
    réservé: "bg-yellow-100 text-yellow-800 border-yellow-200",
    terminé: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={isOffre ? "bg-primary/10 text-primary border-primary/20" : "bg-accent/20 text-orange-700 border-accent/30"}
            >
              {isOffre ? "OFFRE" : "DEMANDE"}
            </Badge>
            <Badge variant="outline" className={statusColor[post.status]}>
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </Badge>
            {post.urgency && post.type === "demande" && (
              <Badge variant="secondary" className="text-xs">{post.urgency}</Badge>
            )}
          </div>
          <DialogTitle className="text-xl leading-tight mt-2">{post.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <p className="text-muted-foreground leading-relaxed">{post.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="w-4 h-4 shrink-0" />
              <span>{post.category}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{post.city}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground col-span-2">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Publié le {formattedDate}</span>
            </div>
          </div>

          <div className="border-t pt-4 flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.authorName}</div>
              {post.authorPhone && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  {post.authorPhone}
                </div>
              )}
            </div>
          </div>

          {post.status === "disponible" && (
            <Button
              className={`w-full ${isOffre ? "bg-primary hover:bg-primary/90" : "bg-accent hover:bg-accent/90 text-accent-foreground"}`}
              onClick={() => { onClose(); onContact(post); }}
            >
              {isOffre ? "Demander cet objet / service" : "Proposer mon aide"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
