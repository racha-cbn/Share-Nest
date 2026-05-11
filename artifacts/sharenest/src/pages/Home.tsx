import { useState, useEffect } from "react";
import heroBg from "@assets/image_1778366786089.png";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/PostCard";
import { ContactModal } from "@/components/ContactModal";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { CATEGORIES, Post } from "@/data/posts";
import { apiClient, type Post as ApiPost } from "@/lib/api";
import { HeartHandshake, HelpingHand } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [typeFilter, setTypeFilter] = useState("toutes");
  const [categoryFilter, setCategoryFilter] = useState("toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPost, setSelectedPost] = useState<ApiPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await apiClient.getPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleContactClick = (post: ApiPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const filteredPosts = posts.filter((post: ApiPost) => {
    if (typeFilter !== "toutes" && post.type !== typeFilter) return false;
    if (categoryFilter !== "toutes" && post.category !== categoryFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.city.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})`, backgroundColor: "#e2e8f0" }}
        />

        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Partagez. Donnez. Aidez.
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-medium">
              La plateforme de solidarité entre voisins en Algérie.
              Offrez ce dont vous ne vous servez plus ou demandez un coup de main.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/publier">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto" data-testid="hero-btn-publier">
                  <HeartHandshake className="mr-2 h-5 w-5" />
                  Publier une offre
                </Button>
              </Link>
              <Link href="/publier">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white text-white hover:text-primary border-white/40 font-semibold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl backdrop-blur-sm transition-all w-full sm:w-auto" data-testid="hero-btn-demander">
                  <HelpingHand className="mr-2 h-5 w-5" />
                  Faire une demande
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Row */}
      <section className="bg-white border-b py-6 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar items-center justify-start md:justify-center">
            <Button
              variant={categoryFilter === "toutes" ? "default" : "outline"}
              className="rounded-full whitespace-nowrap"
              onClick={() => setCategoryFilter("toutes")}
            >
              Toutes
            </Button>
            {CATEGORIES.map(cat => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? "default" : "outline"}
                className="rounded-full whitespace-nowrap"
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Feed */}
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <FilterBar
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPosts.map((post, i) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={i}
                  onContactClick={handleContactClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-border">
              <HeartHandshake className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">Aucune annonce trouvée</h3>
              <p className="text-muted-foreground mt-2">Essayez de modifier vos filtres de recherche.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setTypeFilter("toutes");
                  setCategoryFilter("toutes");
                  setSearchQuery("");
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ContactModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
