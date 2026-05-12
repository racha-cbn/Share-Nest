import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { postsTable, insertPostSchema, updatePostSchema } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router: IRouter = Router();

router.get("/", async (req, res, next) => {
  try {
    const { authorEmail } = req.query as { authorEmail?: string };
    let posts;
    if (authorEmail) {
      posts = await db.select().from(postsTable)
        .where(eq(postsTable.authorEmail, authorEmail))
        .orderBy(desc(postsTable.createdAt));
    } else {
      posts = await db.select().from(postsTable).orderBy(desc(postsTable.createdAt));
    }
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [post] = await db.select().from(postsTable).where(eq(postsTable.id, id));
    if (!post) {
      res.status(404).json({ error: "Annonce introuvable" });
      return;
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const data = insertPostSchema.parse(req.body);
    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = `/api/uploads/${req.file.filename}`;
    }
    const [post] = await db.insert(postsTable).values({ ...data, imageUrl }).returning();
    res.status(201).json(post);
  } catch (err) {
    // Clean up uploaded file if validation failed
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = updatePostSchema.parse(req.body);
    const [post] = await db.update(postsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(postsTable.id, id))
      .returning();
    if (!post) {
      res.status(404).json({ error: "Annonce introuvable" });
      return;
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(postsTable).where(eq(postsTable.id, id));
    res.json({ message: "Annonce supprimée" });
  } catch (err) {
    next(err);
  }
});

export default router;
