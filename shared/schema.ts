import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// App Builder Component Type
export const componentTypeEnum = z.enum([
  "hero",
  "header",
  "contact-form",
  "about-section",
  "image-gallery",
  "footer",
  "feature-grid",
  "testimonials",
  "pricing-table",
  "cta-section"
]);

export type ComponentType = z.infer<typeof componentTypeEnum>;

// Component Tier Configuration
export const componentTiers: Record<ComponentType, "basic" | "premium"> = {
  "hero": "basic",
  "header": "basic",
  "contact-form": "premium",
  "about-section": "basic",
  "image-gallery": "premium",
  "footer": "basic",
  "feature-grid": "basic",
  "testimonials": "premium",
  "pricing-table": "premium",
  "cta-section": "basic"
};

// Component Pricing Configuration
export const componentPricing: Record<ComponentType, number> = {
  "hero": 29,
  "header": 19,
  "contact-form": 49,
  "about-section": 24,
  "image-gallery": 44,
  "footer": 19,
  "feature-grid": 29,
  "testimonials": 39,
  "pricing-table": 54,
  "cta-section": 24
};

// Base price for any app build
export const BASE_APP_PRICE = 49;

// App Builder Projects
export const appProjects = pgTable("app_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectName: text("project_name").notNull(),
  components: jsonb("components").$type<ComponentType[]>().notNull().default([]),
  totalPrice: integer("total_price").notNull(),
  isPaid: text("is_paid").notNull().default("false"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAppProjectSchema = createInsertSchema(appProjects).omit({
  id: true,
  createdAt: true,
});

export type InsertAppProject = z.infer<typeof insertAppProjectSchema>;
export type AppProject = typeof appProjects.$inferSelect;

// Custom Coding Quote Requests
export const customQuotes = pgTable("custom_quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  projectDescription: text("project_description").notNull(),
  budget: text("budget"),
  timeline: text("timeline"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCustomQuoteSchema = createInsertSchema(customQuotes).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertCustomQuote = z.infer<typeof insertCustomQuoteSchema>;
export type CustomQuote = typeof customQuotes.$inferSelect;

// Repair Service Quote Requests
export const repairQuotes = pgTable("repair_quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  websiteUrl: text("website_url"),
  issueDescription: text("issue_description").notNull(),
  priority: text("priority").notNull().default("normal"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRepairQuoteSchema = createInsertSchema(repairQuotes).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertRepairQuote = z.infer<typeof insertRepairQuoteSchema>;
export type RepairQuote = typeof repairQuotes.$inferSelect;

// Admin Settings (for storing payment configuration)
export const adminSettings = pgTable("admin_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAdminSettingSchema = createInsertSchema(adminSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertAdminSetting = z.infer<typeof insertAdminSettingSchema>;
export type AdminSetting = typeof adminSettings.$inferSelect;
