import { type Post } from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Tag, ImageOff } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface PostCardProps {
  post: Post;
  index: number;
  onContactClick: (post: Post) => void;
  onDetailsClick?: (post: Post) => void;
}

const avatarColors = [
  "bg-blue-500", "bg-pink-500", "bg-purple-500", "bg-orange-500",
  "bg-green-500", "bg-indigo-500", "bg-red-500", "bg-teal-500",
  "bg-cyan-500", "bg-yellow-500", "bg-emerald-500",
];

export function PostCard({ post, index, onContactClick, onDetailsClick }: PostCardProps) {
  const isOffre = post.type === "offre";
  const initials = post.authorName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const avatarColor = avatarColors[post.id % avatarColors.length];
  const timeAgo = new Date(post.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.5) }}
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow border-border/50">

        {/* ── Post image ───────────────────────── */}
        {post.imageUrl && !imgError ? (
          <div className="relative w-full h-44 overflow-hidden bg-gray-100">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={() => setImgError(true)}
            />
            <div className="absolute top-2 left-2">
              <Badge
                variant="outline"
                className={`backdrop-blur-sm bg-white/80 ${isOffre
                  ? "text-primary border-primary/30"
                  : "text-orange-700 border-accent/30"}`}
              >
                {isOffre ? "OFFRE" : "DEMANDE"}
              </Badge>
            </div>
          </div>
        ) : null}

        <CardHeader className="p-4 pb-2">
          {(!post.imageUrl || imgError) && (
            <div className="flex justify-between items-start mb-2">
              <Badge
                variant="outline"
                className={isOffre
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-accent/20 text-orange-700 border-accent/30"}
              >
                {isOffre ? "OFFRE" : "DEMANDE"}
              </Badge>
              {post.urgency && post.type === "demande" && (
                <Badge variant="secondary" className="text-xs font-normal">{post.urgency}</Badge>
              )}
            </div>
          )}
          {post.imageUrl && !imgError && post.urgency && post.type === "demande" && (
            <div className="mb-2">
              <Badge variant="secondary" className="text-xs font-normal">{post.urgency}</Badge>
            </div>
          )}
          <h3 className="font-semibold text-lg line-clamp-2 leading-tight">{post.title}</h3>
        </CardHeader>

        <CardContent className="p-4 pt-2 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.description}</p>

          <div className="space-y-2 mt-auto text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>{post.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{post.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex flex-col gap-4">
          <div className="flex items-center gap-2 w-full pt-4 border-t">
            <Avatar className="w-8 h-8">
              <AvatarFallback className={`${avatarColor} text-white text-xs`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{post.authorName}</span>
          </div>

          <div className="flex gap-2 w-full">
            <Button
              className={`flex-1 ${isOffre ? "bg-primary hover:bg-primary/90" : "bg-accent hover:bg-accent/90 text-accent-foreground"}`}
              onClick={() => onContactClick(post)}
              data-testid={`btn-contact-${post.id}`}
            >
              {isOffre ? "Demander" : "Proposer"}
            </Button>
            <Button
              variant="outline"
              className="px-3"
              onClick={() => onDetailsClick?.(post)}
              data-testid={`btn-details-${post.id}`}
            >
              Détails
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
