import { Router, type IRouter } from "express";
import { insertPostSchema, updatePostSchema } from "@workspace/db";

// Mock data for development
let mockPosts = [
  {
    id: 1,
    type: "offre",
    title: "Canapé 3 places en bon état",
    description: "Je donne un canapé 3 places, couleur beige. À venir récupérer sur place.",
    category: "Meubles",
    city: "Alger",
    urgency: null,
    authorName: "Amine K.",
    authorEmail: "amine@example.com",
    authorPhone: null,
    status: "disponible",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    type: "demande",
    title: "Besoin d'aide pour montage meuble",
    description: "Bonjour, je cherche quelqu'un pour m'aider à monter une armoire IKEA. Je suis étudiant et je n'ai pas les outils.",
    category: "Services",
    city: "Oran",
    urgency: "Moyen",
    authorName: "Sarah M.",
    authorEmail: "sarah@example.com",
    authorPhone: null,
    status: "disponible",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const router: IRouter = Router();

// GET /api/posts - Get all posts
router.get("/", async (_req, res) => {
  try {
    return res.json(mockPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET /api/posts/:id - Get a specific post
router.get("/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const post = mockPosts.find(p => p.id === postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({ error: "Failed to fetch post" });
  }
});

// POST /api/posts - Create a new post
router.post("/", async (req, res) => {
  try {
    const postData = insertPostSchema.parse(req.body);
    const newPost = {
      id: Math.max(...mockPosts.map(p => p.id)) + 1,
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockPosts.push(newPost);

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ error: "Failed to create post" });
  }
});

// PUT /api/posts/:id - Update a post
router.put("/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const updateData = updatePostSchema.parse(req.body);

    const postIndex = mockPosts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    mockPosts[postIndex] = {
      ...mockPosts[postIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return res.json(mockPosts[postIndex]);
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ error: "Failed to update post" });
  }
});

// DELETE /api/posts/:id - Delete a post
router.delete("/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const postIndex = mockPosts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    mockPosts.splice(postIndex, 1);

    return res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
