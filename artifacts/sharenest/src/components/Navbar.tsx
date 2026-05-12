import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { HeartHandshake, User, PlusCircle, LogOut, LayoutDashboard, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { apiClient } from "@/lib/api";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const initials =
    user?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  useEffect(() => {
    if (!user) { setUnreadCount(0); return; }
    apiClient.getMessages()
      .then((msgs) => {
        const count = msgs.filter((m) => m.isRead === "false" && m.receiverId === user.email).length;
        setUnreadCount(count);
      })
      .catch(() => {});
  }, [user, location]);

  const navLink = (href: string, label: string, testId: string) => (
    <Link href={href}>
      <span
        className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
          location === href ? "text-primary" : "text-muted-foreground"
        }`}
        data-testid={testId}
      >
        {label}
      </span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
            <HeartHandshake className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-foreground">Sharenest</span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLink("/", "Accueil", "nav-home")}
          {navLink("/publier", "Publier", "nav-publish")}
          {user && navLink("/tableau-de-bord", "Tableau de bord", "nav-dashboard")}
          {user && (
            <Link href="/messages">
              <span
                className={`relative text-sm font-medium transition-colors hover:text-primary cursor-pointer flex items-center gap-1 ${
                  location === "/messages" ? "text-primary" : "text-muted-foreground"
                }`}
                data-testid="nav-messages"
              >
                <MessageCircle className="w-4 h-4" />
                Messages
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-3 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Mobile messages icon */}
          {user && (
            <Link href="/messages">
              <Button variant="ghost" size="icon" className="relative md:hidden">
                <MessageCircle className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-background" />
                )}
              </Button>
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-primary text-white text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground font-normal">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/tableau-de-bord">
                  <DropdownMenuItem className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Tableau de bord
                  </DropdownMenuItem>
                </Link>
                <Link href="/messages">
                  <DropdownMenuItem className="cursor-pointer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Messages
                    {unreadCount > 0 && (
                      <span className="ml-auto inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex" data-testid="btn-login">
                <User className="mr-2 h-4 w-4" />
                Connexion
              </Button>
            </Link>
          )}

          <Link href="/publier">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="btn-cta-publish">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Publier</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
