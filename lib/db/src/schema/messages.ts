import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: text("sender_id").notNull(),
  senderName: text("sender_name").notNull().default("Anonyme"),
  senderEmail: text("sender_email").notNull().default(""),
  receiverId: text("receiver_id").notNull(),
  postId: text("post_id").notNull(),
  content: text("content").notNull(),
  isRead: text("is_read").default("false").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Message = typeof messagesTable.$inferSelect;
