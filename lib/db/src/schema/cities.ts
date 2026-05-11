import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const citiesTable = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export type City = typeof citiesTable.$inferSelect;
