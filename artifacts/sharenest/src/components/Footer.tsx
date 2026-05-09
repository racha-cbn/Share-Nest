import { HeartHandshake } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t py-12 mt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <HeartHandshake className="h-6 w-6" />
            <span className="font-bold text-xl">Sharenest</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Une plateforme de solidarité en Algérie. Partagez, donnez et demandez de l'aide dans votre ville.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-foreground mb-4">À propos</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Notre mission</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Comment ça marche ?</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">L'équipe</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-4">Aide & Sécurité</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Règles de sécurité</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Signaler un problème</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-4">Contact</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Nous contacter</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Partenariats associatifs</a></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Sharenest. Tous droits réservés.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-primary">Conditions d'utilisation</a>
          <a href="#" className="hover:text-primary">Confidentialité</a>
        </div>
      </div>
    </footer>
  );
}
