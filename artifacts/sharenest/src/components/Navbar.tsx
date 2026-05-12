import { Link, useLocation } from "wouter";
import { HeartHandshake, User, PlusCircle, LogOut, LayoutDashboard } from "lucide-react";
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

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
            <HeartHandshake className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-foreground">Sharenest</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/">
            <span className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${location === "/" ? "text-primary" : "text-muted-foreground"}`} data-testid="nav-home">
              Accueil
            </span>
          </Link>
          <Link href="/publier">
            <span className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${location === "/publier" ? "text-primary" : "text-muted-foreground"}`} data-testid="nav-publish">
              Publier
            </span>
          </Link>
          {user && (
            <Link href="/tableau-de-bord">
              <span className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${location === "/tableau-de-bord" ? "text-primary" : "text-muted-foreground"}`} data-testid="nav-dashboard">
                Tableau de bord
              </span>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-primary text-white text-xs">
                      {initials}
                    </AvatarFallback>
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
              Publier
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
