import {
  type AppProject,
  type InsertAppProject,
  type CustomQuote,
  type InsertCustomQuote,
  type RepairQuote,
  type InsertRepairQuote,
  type AdminSetting,
  type InsertAdminSetting
} from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private appProjects: Map<string, AppProject>;
  private customQuotes: Map<string, CustomQuote>;
  private repairQuotes: Map<string, RepairQuote>;
  private adminSettings: Map<string, AdminSetting>;

  constructor() {
    this.appProjects = new Map();
    this.customQuotes = new Map();
    this.repairQuotes = new Map();
    this.adminSettings = new Map();
  }

  // App Builder Projects
  async createAppProject(insertProject: InsertAppProject): Promise<AppProject> {
    const id = randomUUID();
    const project: AppProject = {
      ...insertProject,
      id,
      createdAt: new Date(),
      stripePaymentIntentId: null,
    };
    this.appProjects.set(id, project);
    return project;
  }

  async getAppProject(id: string): Promise<AppProject | undefined> {
    return this.appProjects.get(id);
  }

  async updateAppProjectPayment(id: string, stripePaymentIntentId: string): Promise<AppProject> {
    const project = this.appProjects.get(id);
    if (!project) {
      throw new Error("Project not found");
    }
    const updated: AppProject = {
      ...project,
      isPaid: "true",
      stripePaymentIntentId,
    };
    this.appProjects.set(id, updated);
    return updated;
  }

  async getAllAppProjects(): Promise<AppProject[]> {
    return Array.from(this.appProjects.values());
  }

  // Custom Coding Quotes
  async createCustomQuote(insertQuote: InsertCustomQuote): Promise<CustomQuote> {
    const id = randomUUID();
    const quote: CustomQuote = {
      ...insertQuote,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.customQuotes.set(id, quote);
    return quote;
  }

  async getCustomQuote(id: string): Promise<CustomQuote | undefined> {
    return this.customQuotes.get(id);
  }

  async getAllCustomQuotes(): Promise<CustomQuote[]> {
    return Array.from(this.customQuotes.values());
  }

  async updateCustomQuoteStatus(id: string, status: string): Promise<CustomQuote> {
    const quote = this.customQuotes.get(id);
    if (!quote) {
      throw new Error("Quote not found");
    }
    const updated: CustomQuote = { ...quote, status };
    this.customQuotes.set(id, updated);
    return updated;
  }

  // Repair Service Quotes
  async createRepairQuote(insertQuote: InsertRepairQuote): Promise<RepairQuote> {
    const id = randomUUID();
    const quote: RepairQuote = {
      ...insertQuote,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.repairQuotes.set(id, quote);
    return quote;
  }

  async getRepairQuote(id: string): Promise<RepairQuote | undefined> {
    return this.repairQuotes.get(id);
  }

  async getAllRepairQuotes(): Promise<RepairQuote[]> {
    return Array.from(this.repairQuotes.values());
  }

  async updateRepairQuoteStatus(id: string, status: string): Promise<RepairQuote> {
    const quote = this.repairQuotes.get(id);
    if (!quote) {
      throw new Error("Quote not found");
    }
    const updated: RepairQuote = { ...quote, status };
    this.repairQuotes.set(id, updated);
    return updated;
  }

  // Admin Settings
  async saveSetting(insertSetting: InsertAdminSetting): Promise<AdminSetting> {
    const existing = Array.from(this.adminSettings.values()).find(
      (s) => s.key === insertSetting.key
    );

    if (existing) {
      const updated: AdminSetting = {
        ...existing,
        value: insertSetting.value,
        updatedAt: new Date(),
      };
      this.adminSettings.set(existing.id, updated);
      return updated;
    }

    const id = randomUUID();
    const setting: AdminSetting = {
      ...insertSetting,
      id,
      updatedAt: new Date(),
    };
    this.adminSettings.set(id, setting);
    return setting;
  }

  async getSetting(key: string): Promise<AdminSetting | undefined> {
    return Array.from(this.adminSettings.values()).find((s) => s.key === key);
  }

  async getAllSettings(): Promise<AdminSetting[]> {
    return Array.from(this.adminSettings.values());
  }
}

export const storage = new MemStorage();
