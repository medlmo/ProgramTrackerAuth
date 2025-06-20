import { programmes, projets, type Programme, type InsertProgramme, type Projet, type InsertProjet, users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Programmes
  getProgrammes(): Promise<Programme[]>;
  getProgramme(id: number): Promise<Programme | undefined>;
  createProgramme(programme: InsertProgramme): Promise<Programme>;
  updateProgramme(id: number, programme: Partial<InsertProgramme>): Promise<Programme | undefined>;
  deleteProgramme(id: number): Promise<boolean>;
  
  // Projets
  getProjets(): Promise<Projet[]>;
  getProjet(id: number): Promise<Projet | undefined>;
  getProjetsByProgramme(programmeId: number): Promise<Projet[]>;
  createProjet(projet: InsertProjet): Promise<Projet>;
  updateProjet(id: number, projet: Partial<InsertProjet>): Promise<Projet | undefined>;
  deleteProjet(id: number): Promise<boolean>;
  
  // Users (existing)
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Programmes methods
  async getProgrammes(): Promise<Programme[]> {
    return await db.select().from(programmes);
  }

  async getProgramme(id: number): Promise<Programme | undefined> {
    const [programme] = await db.select().from(programmes).where(eq(programmes.id, id));
    return programme || undefined;
  }

  async createProgramme(insertProgramme: InsertProgramme): Promise<Programme> {
    const [programme] = await db
      .insert(programmes)
      .values(insertProgramme)
      .returning();
    return programme;
  }

  async updateProgramme(id: number, updateData: Partial<InsertProgramme>): Promise<Programme | undefined> {
    const [programme] = await db
      .update(programmes)
      .set(updateData)
      .where(eq(programmes.id, id))
      .returning();
    return programme || undefined;
  }

  async deleteProgramme(id: number): Promise<boolean> {
    // Also delete associated projets
    await db.delete(projets).where(eq(projets.programmeId, id));
    
    const result = await db.delete(programmes).where(eq(programmes.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Projets methods
  async getProjets(): Promise<Projet[]> {
    return await db.select().from(projets);
  }

  async getProjet(id: number): Promise<Projet | undefined> {
    const [projet] = await db.select().from(projets).where(eq(projets.id, id));
    return projet || undefined;
  }

  async getProjetsByProgramme(programmeId: number): Promise<Projet[]> {
    return await db.select().from(projets).where(eq(projets.programmeId, programmeId));
  }

  async createProjet(insertProjet: InsertProjet): Promise<Projet> {
    const [projet] = await db
      .insert(projets)
      .values(insertProjet)
      .returning();
    return projet;
  }

  async updateProjet(id: number, updateData: Partial<InsertProjet>): Promise<Projet | undefined> {
    const [projet] = await db
      .update(projets)
      .set(updateData)
      .where(eq(projets.id, id))
      .returning();
    return projet || undefined;
  }

  async deleteProjet(id: number): Promise<boolean> {
    const result = await db.delete(projets).where(eq(projets.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Users methods (corrigé)
  async getUser(id: number): Promise<any | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || undefined;
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0] || undefined;
  }

  async createUser(insertUser: any): Promise<any> {
    // For now, returning the user object as user management is not implemented with database
    return { ...insertUser, id: 1 };
  }
}

export const storage = new DatabaseStorage();
