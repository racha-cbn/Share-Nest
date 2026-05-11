import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export type Category = typeof categoriesTable.$inferSelect;
