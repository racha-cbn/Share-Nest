import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { postsTable, insertPostSchema, updatePostSchema } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (_req, res, next) => {
  try {
    const posts = await db
      .select()
      .from(postsTable)
      .orderBy(desc(postsTable.createdAt));
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [post] = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, id));
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = insertPostSchema.parse(req.body);
    const [post] = await db.insert(postsTable).values(data).returning();
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = updatePostSchema.parse(req.body);
    const [post] = await db
      .update(postsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(postsTable.id, id))
      .returning();
    if (!post) {
      res.status(404).json({ error: "Post not found" });
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
    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
