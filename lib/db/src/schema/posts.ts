import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "offre" | "demande"
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  city: text("city").notNull(),
  urgency: text("urgency"), // "Faible" | "Moyen" | "Urgent"
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  authorPhone: text("author_phone"),
  status: text("status").notNull().default("disponible"), // "disponible" | "réservé" | "terminé"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Define manual schemas to avoid Zod type issues
export const insertPostSchema = z.object({
  type: z.enum(["offre", "demande"]),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  city: z.string().min(1),
  urgency: z.enum(["Faible", "Moyen", "Urgent"]).optional(),
  authorName: z.string().min(1),
  authorEmail: z.string().email(),
  authorPhone: z.string().optional(),
});

export const updatePostSchema = z.object({
  status: z.enum(["disponible", "réservé", "terminé"])
});

export type InsertPost = z.infer<typeof insertPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
export type Post = typeof postsTable.$inferSelect;
