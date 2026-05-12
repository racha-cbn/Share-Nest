import { Router } from "express";
import { db } from "@workspace/db";
import { messagesTable } from "@workspace/db/schema";
import { eq, or, desc } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { z } from "zod";

const router = Router();

function parseUser(req: any): { userId: number; email: string } | null {
  const auth = req.headers.authorization as string | undefined;
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(auth.slice(7), env.JWT_SECRET) as { userId: number; email: string };
  } catch {
    return null;
  }
}

const sendSchema = z.object({
  postId: z.string(),
  receiverId: z.string(),
  content: z.string().min(1, "Le message ne peut pas être vide"),
  senderName: z.string().optional(),
  senderEmail: z.string().optional(),
});

router.post("/", async (req, res, next) => {
  try {
    const data = sendSchema.parse(req.body);
    const user = parseUser(req);
    const senderId = user ? String(user.userId) : (data.senderEmail || "anonymous");
    const senderName = data.senderName || (user ? user.email : "Anonyme");
    const senderEmail = data.senderEmail || (user ? user.email : "");

    const [msg] = await db.insert(messagesTable).values({
      senderId,
      senderName,
      senderEmail,
      receiverId: data.receiverId,
      postId: data.postId,
      content: data.content,
    }).returning();
    res.status(201).json(msg);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const user = parseUser(req);
    if (!user) {
      res.status(401).json({ error: "Non autorisé" });
      return;
    }
    const userId = String(user.userId);
    const messages = await db.select().from(messagesTable)
      .where(or(eq(messagesTable.senderId, userId), eq(messagesTable.receiverId, user.email)))
      .orderBy(desc(messagesTable.createdAt));
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/read", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [msg] = await db.update(messagesTable)
      .set({ isRead: "true" })
      .where(eq(messagesTable.id, id))
      .returning();
    res.json(msg);
  } catch (err) {
    next(err);
  }
});

export default router;
