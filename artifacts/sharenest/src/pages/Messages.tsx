import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { apiClient, type Message } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HeartHandshake, Send, ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  otherName: string;
  otherEmail: string;
  postId: string;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

function buildConversations(messages: Message[], myUserId: number, myEmail: string): Conversation[] {
  const map = new Map<string, Conversation>();

  for (const msg of messages) {
    const iSent = msg.senderId === String(myUserId);
    const otherEmail = iSent ? msg.receiverId : msg.senderEmail;
    const otherName = iSent ? msg.receiverId : msg.senderName;
    const key = `${msg.postId}_${otherEmail}`;

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        otherName,
        otherEmail,
        postId: msg.postId,
        messages: [],
        lastMessage: msg,
        unreadCount: 0,
      });
    }

    const conv = map.get(key)!;
    conv.messages.push(msg);
    if (new Date(msg.createdAt) > new Date(conv.lastMessage.createdAt)) {
      conv.lastMessage = msg;
    }
    if (!iSent && msg.isRead === "false") {
      conv.unreadCount += 1;
    }
  }

  // Sort messages within each conversation oldest→newest
  for (const conv of map.values()) {
    conv.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // Sort conversations by last message newest→oldest
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return date.toLocaleDateString("fr-FR", { weekday: "short" });
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-orange-500",
  "bg-teal-500", "bg-indigo-500", "bg-rose-500", "bg-green-500",
];
function avatarColor(email: string) {
  let hash = 0;
  for (const c of email) hash = (hash * 31 + c.charCodeAt(0)) & 0xff;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");
  const bottomRef = useRef<HTMLDivElement>(null);

  const selectedConv = conversations.find((c) => c.id === selected) ?? null;

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    loadMessages();
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConv?.messages.length]);

  const loadMessages = async () => {
    try {
      const msgs = await apiClient.getMessages();
      setConversations(buildConversations(msgs, user!.id, user!.email));
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les messages.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConv = async (convId: string) => {
    setSelected(convId);
    setMobileView("thread");

    // Mark unread messages as read
    const conv = conversations.find((c) => c.id === convId);
    if (!conv) return;
    const unread = conv.messages.filter((m) => m.isRead === "false" && m.receiverId === user?.email);
    for (const msg of unread) {
      try {
        await apiClient.markMessageRead(msg.id);
      } catch { /* ignore */ }
    }
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, unreadCount: 0, messages: c.messages.map((m) => ({ ...m, isRead: "true" })) }
          : c
      )
    );
  };

  const handleSendReply = async () => {
    if (!reply.trim() || !selectedConv || !user || sending) return;
    setSending(true);
    try {
      const newMsg = await apiClient.sendMessage({
        postId: selectedConv.postId,
        receiverId: selectedConv.otherEmail,
        content: reply.trim(),
        senderName: user.name,
        senderEmail: user.email,
      });
      setReply("");
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selected
            ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg }
            : c
        )
      );
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <MessageCircle className="h-16 w-16 text-muted-foreground opacity-30" />
          <h2 className="text-xl font-semibold">Connectez-vous pour voir vos messages</h2>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90">Se connecter</Button>
          </Link>
        </main>
      </div>
    );
  }

  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-0 sm:px-4 py-0 sm:py-6 max-w-5xl">
        <div className="bg-white border border-border/50 rounded-none sm:rounded-xl shadow-sm overflow-hidden flex h-[calc(100dvh-65px)] sm:h-[600px]">

          {/* ── Conversation List ─────────────────────────────── */}
          <div className={`flex flex-col w-full sm:w-80 border-r border-border/50 ${mobileView === "thread" ? "hidden sm:flex" : "flex"}`}>
            {/* Header */}
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div>
                <h1 className="font-bold text-lg">Messages</h1>
                {totalUnread > 0 && (
                  <p className="text-xs text-muted-foreground">{totalUnread} non lu{totalUnread > 1 ? "s" : ""}</p>
                )}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">Aucune conversation pour l'instant.</p>
                  <Link href="/">
                    <Button variant="outline" size="sm">Voir les annonces</Button>
                  </Link>
                </div>
              ) : (
                conversations.map((conv) => {
                  const isActive = selected === conv.id;
                  const isSent = conv.lastMessage.senderId === String(user.id);
                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConv(conv.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-border/30 ${isActive ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
                    >
                      <Avatar className="w-11 h-11 shrink-0">
                        <AvatarFallback className={`${avatarColor(conv.otherEmail)} text-white text-sm font-semibold`}>
                          {getInitials(conv.otherName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-sm truncate ${conv.unreadCount > 0 ? "font-bold" : "font-medium"}`}>
                            {conv.otherName}
                          </span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                            {formatTime(conv.lastMessage.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-1 mt-0.5">
                          <p className={`text-xs truncate ${conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                            {isSent ? "Vous : " : ""}{conv.lastMessage.content}
                          </p>
                          {conv.unreadCount > 0 && (
                            <Badge className="bg-primary text-white text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full shrink-0">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">Annonce #{conv.postId}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Thread Panel ──────────────────────────────────── */}
          <div className={`flex-1 flex flex-col ${mobileView === "list" ? "hidden sm:flex" : "flex"}`}>
            {!selectedConv ? (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <HeartHandshake className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Vos messages</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Sélectionnez une conversation pour voir les messages.
                </p>
              </div>
            ) : (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-border/50 flex items-center gap-3 bg-white">
                  <button
                    onClick={() => setMobileView("list")}
                    className="sm:hidden p-1 -ml-1 rounded-md hover:bg-gray-100"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className={`${avatarColor(selectedConv.otherEmail)} text-white text-sm font-semibold`}>
                      {getInitials(selectedConv.otherName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{selectedConv.otherName}</p>
                    <p className="text-xs text-muted-foreground">Annonce #{selectedConv.postId}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-gray-50/50">
                  {selectedConv.messages.map((msg, i) => {
                    const isMine = msg.senderId === String(user.id);
                    const showDate =
                      i === 0 ||
                      new Date(msg.createdAt).toDateString() !==
                        new Date(selectedConv.messages[i - 1].createdAt).toDateString();

                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-3">
                            <span className="text-xs text-muted-foreground bg-white border border-border/40 rounded-full px-3 py-1">
                              {new Date(msg.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          <div className={`flex items-end gap-2 max-w-[75%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                            {!isMine && (
                              <Avatar className="w-7 h-7 shrink-0 mb-1">
                                <AvatarFallback className={`${avatarColor(selectedConv.otherEmail)} text-white text-xs`}>
                                  {getInitials(selectedConv.otherName)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <div
                                className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                  isMine
                                    ? "bg-primary text-white rounded-br-sm"
                                    : "bg-white border border-border/50 text-foreground rounded-bl-sm shadow-sm"
                                }`}
                              >
                                {msg.content}
                              </div>
                              <p className={`text-[10px] text-muted-foreground mt-1 ${isMine ? "text-right" : "text-left"}`}>
                                {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Reply Input */}
                <div className="p-3 border-t border-border/50 bg-white flex items-center gap-2">
                  <Input
                    placeholder="Écrire un message..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendReply()}
                    className="flex-1 rounded-full bg-gray-50 border-border/50 focus-visible:ring-primary/30"
                    disabled={sending}
                  />
                  <Button
                    size="icon"
                    className="rounded-full bg-primary hover:bg-primary/90 shrink-0"
                    onClick={handleSendReply}
                    disabled={!reply.trim() || sending}
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
