export type PostType = "offre" | "demande";
export type PostStatus = "disponible" | "réservé" | "terminé";

export interface Post {
  id: string;
  type: PostType;
  title: string;
  description: string;
  category: string;
  city: string;
  urgency?: "Faible" | "Moyen" | "Urgent";
  authorName: string;
  authorInitials: string;
  avatarColor: string;
  timeAgo: string;
  status: PostStatus;
}

export const CATEGORIES = [
  "Meubles",
  "Vêtements",
  "Alimentation",
  "Électronique",
  "Services",
  "Médicaments",
  "Autre"
];

export const CITIES = [
  "Alger",
  "Oran",
  "Constantine",
  "Tlemcen",
  "Sétif",
  "Annaba",
  "Béjaïa",
  "Blida",
  "Batna",
  "Tizi Ouzou"
];

export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    type: "offre",
    title: "Canapé 3 places en bon état",
    description: "Je donne un canapé 3 places, couleur beige. À venir récupérer sur place.",
    category: "Meubles",
    city: "Alger",
    authorName: "Amine K.",
    authorInitials: "AK",
    avatarColor: "bg-blue-500",
    timeAgo: "il y a 2 heures",
    status: "disponible"
  },
  {
    id: "2",
    type: "demande",
    title: "Besoin d'aide pour montage meuble",
    description: "Bonjour, je cherche quelqu'un pour m'aider à monter une armoire IKEA. Je suis étudiant et je n'ai pas les outils.",
    category: "Services",
    city: "Oran",
    urgency: "Moyen",
    authorName: "Sarah M.",
    authorInitials: "SM",
    avatarColor: "bg-pink-500",
    timeAgo: "il y a 4 heures",
    status: "disponible"
  },
  {
    id: "3",
    type: "offre",
    title: "Vêtements bébé garçon (0-6 mois)",
    description: "Lot de vêtements pour bébé en très bon état. Bodys, pyjamas, pulls.",
    category: "Vêtements",
    city: "Constantine",
    authorName: "Lydia B.",
    authorInitials: "LB",
    avatarColor: "bg-purple-500",
    timeAgo: "il y a 5 heures",
    status: "disponible"
  },
  {
    id: "4",
    type: "demande",
    title: "Recherche médicaments pour diabète",
    description: "Je suis à la recherche de Metformine. Rupture de stock dans ma pharmacie.",
    category: "Médicaments",
    city: "Tizi Ouzou",
    urgency: "Urgent",
    authorName: "Karim T.",
    authorInitials: "KT",
    avatarColor: "bg-orange-500",
    timeAgo: "il y a 1 jour",
    status: "disponible"
  },
  {
    id: "5",
    type: "offre",
    title: "Donne panier de légumes frais",
    description: "J'ai acheté trop de légumes au marché. Je donne un panier (tomates, courgettes, oignons) pour éviter le gaspillage.",
    category: "Alimentation",
    city: "Blida",
    authorName: "Farid H.",
    authorInitials: "FH",
    avatarColor: "bg-green-500",
    timeAgo: "il y a 1 jour",
    status: "disponible"
  },
  {
    id: "6",
    type: "demande",
    title: "Ancien PC portable pour école",
    description: "Je cherche un vieux PC fonctionnel pour mon petit frère pour l'école.",
    category: "Électronique",
    city: "Annaba",
    urgency: "Faible",
    authorName: "Nassim D.",
    authorInitials: "ND",
    avatarColor: "bg-indigo-500",
    timeAgo: "il y a 2 jours",
    status: "disponible"
  },
  {
    id: "7",
    type: "offre",
    title: "Soutien en mathématiques",
    description: "Professeur de maths retraité, j'offre des heures de soutien scolaire pour collégiens en difficulté.",
    category: "Services",
    city: "Sétif",
    authorName: "Mohamed R.",
    authorInitials: "MR",
    avatarColor: "bg-red-500",
    timeAgo: "il y a 2 jours",
    status: "disponible"
  },
  {
    id: "8",
    type: "offre",
    title: "Poussette en excellent état",
    description: "Poussette utilisée 6 mois, propre et fonctionnelle.",
    category: "Autre",
    city: "Béjaïa",
    authorName: "Amina Y.",
    authorInitials: "AY",
    avatarColor: "bg-teal-500",
    timeAgo: "il y a 3 jours",
    status: "disponible"
  },
  {
    id: "9",
    type: "demande",
    title: "Chaises pour salle à manger",
    description: "Je viens d'emménager et il me manque 2 ou 4 chaises. Peu importe la couleur.",
    category: "Meubles",
    city: "Tlemcen",
    urgency: "Moyen",
    authorName: "Yanis C.",
    authorInitials: "YC",
    avatarColor: "bg-cyan-500",
    timeAgo: "il y a 3 jours",
    status: "disponible"
  },
  {
    id: "10",
    type: "offre",
    title: "Téléviseur 32 pouces",
    description: "Ancien modèle mais marche parfaitement. Pas de télécommande.",
    category: "Électronique",
    city: "Batna",
    authorName: "Khadija S.",
    authorInitials: "KS",
    avatarColor: "bg-yellow-500",
    timeAgo: "il y a 4 jours",
    status: "réservé"
  },
  {
    id: "11",
    type: "demande",
    title: "Vestes d'hiver femme",
    description: "L'hiver approche et je cherche des manteaux ou vestes taille M.",
    category: "Vêtements",
    city: "Alger",
    urgency: "Faible",
    authorName: "Imene F.",
    authorInitials: "IF",
    avatarColor: "bg-emerald-500",
    timeAgo: "il y a 5 jours",
    status: "disponible"
  },
  {
    id: "12",
    type: "offre",
    title: "Repas chauds pour sans-abris",
    description: "Nous avons préparé 20 repas. Distribution prévue ce soir près de la grande mosquée.",
    category: "Alimentation",
    city: "Oran",
    authorName: "Association El Kheir",
    authorInitials: "AE",
    avatarColor: "bg-primary",
    timeAgo: "il y a 5 jours",
    status: "terminé"
  }
];
