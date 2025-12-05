import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  plan: text("plan").notNull().default("free"),
  isAdmin: boolean("is_admin").notNull().default(false),
  suspended: boolean("suspended").notNull().default(false),
  suspendedAt: timestamp("suspended_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userApiKeys = pgTable("user_api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  encryptedKey: text("encrypted_key").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertApiKeySchema = createInsertSchema(userApiKeys).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type UserApiKey = typeof userApiKeys.$inferSelect;

export type LLMProvider = "openai" | "anthropic" | "google";
export type ImageProvider = "pexels" | "unsplash" | "pixabay";

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type PlanType = "free" | "monthly" | "lifetime";

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull().default("sales_letter"),
  theme: text("theme").notNull().default("classic_red"),
  sections: jsonb("sections").notNull().default([]),
  freeformElements: jsonb("freeform_elements").notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Freeform element types for drag-and-drop positioning
export type FreeformElementType = 'text' | 'image';

export interface FreeformElement {
  id: string;
  type: FreeformElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  content: string;
  styles?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    padding?: string;
    borderRadius?: string;
  };
}

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectSchema = createInsertSchema(projects).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type ProjectType = "sales_letter" | "jv_page";
export type ThemeType = 
  | "classic_red"
  | "clean_blue" 
  | "money_green"
  | "dark_authority"
  | "sunset_orange"
  | "tech_purple"
  | "black_gold"
  | "fresh_teal"
  | "fire_red"
  | "ocean_blue"
  | "neon_gamer"
  | "minimalist_white";
export type SectionType = 
  | "hero" 
  | "subheadline" 
  | "video" 
  | "bullets" 
  | "feature_grid" 
  | "bonus_stack" 
  | "testimonial" 
  | "guarantee" 
  | "faq" 
  | "cta" 
  | "divider" 
  | "jv_commissions" 
  | "jv_calendar" 
  | "jv_prizes";

export interface PageSection {
  id: string;
  type: SectionType;
  position: number;
  data: Record<string, unknown>;
}

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
