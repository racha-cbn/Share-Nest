import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@workspace/db";
import { usersTable, insertUserSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { env } from "../config/env";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const data = insertUserSchema.parse(req.body);
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, data.email));
    if (existing.length > 0) {
      res.status(409).json({ error: "Cet email est déjà utilisé" });
      return;
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const [user] = await db.insert(usersTable).values({ ...data, password: hashedPassword }).returning();
    const token = jwt.sign({ userId: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, city: user.city, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      res.status(400).json({ error: "Email et mot de passe requis" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) {
      res.status(401).json({ error: "Email ou mot de passe incorrect" });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Email ou mot de passe incorrect" });
      return;
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, city: user.city, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Non autorisé" });
      return;
    }
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: number };
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId));
    if (!user) {
      res.status(404).json({ error: "Utilisateur non trouvé" });
      return;
    }
    res.json({ id: user.id, name: user.name, email: user.email, city: user.city, role: user.role });
  } catch (err) {
    next(err);
  }
});

export default router;
