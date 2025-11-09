import {
  appProjects,
  customQuotes,
  repairQuotes,
  adminSettings,
  type AppProject,
  type InsertAppProject,
  type CustomQuote,
  type InsertCustomQuote,
  type RepairQuote,
  type InsertRepairQuote,
  type AdminSetting,
  type InsertAdminSetting
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // App Builder Projects
  createAppProject(project: InsertAppProject): Promise<AppProject>;
  getAppProject(id: string): Promise<AppProject | undefined>;
  updateAppProjectPayment(id: string, stripePaymentIntentId: string): Promise<AppProject>;
  getAllAppProjects(): Promise<AppProject[]>;

  // Custom Coding Quotes
  createCustomQuote(quote: InsertCustomQuote): Promise<CustomQuote>;
  getCustomQuote(id: string): Promise<CustomQuote | undefined>;
  getAllCustomQuotes(): Promise<CustomQuote[]>;
  updateCustomQuoteStatus(id: string, status: string): Promise<CustomQuote>;

  // Repair Service Quotes
  createRepairQuote(quote: InsertRepairQuote): Promise<RepairQuote>;
  getRepairQuote(id: string): Promise<RepairQuote | undefined>;
  getAllRepairQuotes(): Promise<RepairQuote[]>;
  updateRepairQuoteStatus(id: string, status: string): Promise<RepairQuote>;

  // Admin Settings
  saveSetting(setting: InsertAdminSetting): Promise<AdminSetting>;
  getSetting(key: string): Promise<AdminSetting | undefined>;
  getAllSettings(): Promise<AdminSetting[]>;
}

export class DatabaseStorage implements IStorage {
  // App Builder Projects
  async createAppProject(insertProject: InsertAppProject): Promise<AppProject> {
    const [project] = await db
      .insert(appProjects)
      .values(insertProject)
      .returning();
    return project;
  }

  async getAppProject(id: string): Promise<AppProject | undefined> {
    const [project] = await db
      .select()
      .from(appProjects)
      .where(eq(appProjects.id, id));
    return project || undefined;
  }

  async updateAppProjectPayment(id: string, stripePaymentIntentId: string): Promise<AppProject> {
    const [updated] = await db
      .update(appProjects)
      .set({
        isPaid: "true",
        stripePaymentIntentId,
      })
      .where(eq(appProjects.id, id))
      .returning();
    
    if (!updated) {
      throw new Error("Project not found");
    }
    return updated;
  }

  async getAllAppProjects(): Promise<AppProject[]> {
    return await db.select().from(appProjects);
  }

  // Custom Coding Quotes
  async createCustomQuote(insertQuote: InsertCustomQuote): Promise<CustomQuote> {
    const [quote] = await db
      .insert(customQuotes)
      .values(insertQuote)
      .returning();
    return quote;
  }

  async getCustomQuote(id: string): Promise<CustomQuote | undefined> {
    const [quote] = await db
      .select()
      .from(customQuotes)
      .where(eq(customQuotes.id, id));
    return quote || undefined;
  }

  async getAllCustomQuotes(): Promise<CustomQuote[]> {
    return await db.select().from(customQuotes);
  }

  async updateCustomQuoteStatus(id: string, status: string): Promise<CustomQuote> {
    const [updated] = await db
      .update(customQuotes)
      .set({ status })
      .where(eq(customQuotes.id, id))
      .returning();
    
    if (!updated) {
      throw new Error("Quote not found");
    }
    return updated;
  }

  // Repair Service Quotes
  async createRepairQuote(insertQuote: InsertRepairQuote): Promise<RepairQuote> {
    const [quote] = await db
      .insert(repairQuotes)
      .values(insertQuote)
      .returning();
    return quote;
  }

  async getRepairQuote(id: string): Promise<RepairQuote | undefined> {
    const [quote] = await db
      .select()
      .from(repairQuotes)
      .where(eq(repairQuotes.id, id));
    return quote || undefined;
  }

  async getAllRepairQuotes(): Promise<RepairQuote[]> {
    return await db.select().from(repairQuotes);
  }

  async updateRepairQuoteStatus(id: string, status: string): Promise<RepairQuote> {
    const [updated] = await db
      .update(repairQuotes)
      .set({ status })
      .where(eq(repairQuotes.id, id))
      .returning();
    
    if (!updated) {
      throw new Error("Quote not found");
    }
    return updated;
  }

  // Admin Settings
  async saveSetting(insertSetting: InsertAdminSetting): Promise<AdminSetting> {
    const [existing] = await db
      .select()
      .from(adminSettings)
      .where(eq(adminSettings.key, insertSetting.key));

    if (existing) {
      const [updated] = await db
        .update(adminSettings)
        .set({
          value: insertSetting.value,
          updatedAt: new Date(),
        })
        .where(eq(adminSettings.id, existing.id))
        .returning();
      return updated;
    }

    const [newSetting] = await db
      .insert(adminSettings)
      .values(insertSetting)
      .returning();
    return newSetting;
  }

  async getSetting(key: string): Promise<AdminSetting | undefined> {
    const [setting] = await db
      .select()
      .from(adminSettings)
      .where(eq(adminSettings.key, key));
    return setting || undefined;
  }

  async getAllSettings(): Promise<AdminSetting[]> {
    return await db.select().from(adminSettings);
  }
}

export const storage = new DatabaseStorage();
