import { apiRequest } from "./queryClient";
import type { Programme, InsertProgramme, Projet, InsertProjet } from "@shared/schema";

export const api = {
  // Programmes
  programmes: {
    getAll: async (): Promise<Programme[]> => {
      const res = await apiRequest("GET", "/api/programmes");
      return res.json();
    },
    
    getById: async (id: number): Promise<Programme> => {
      const res = await apiRequest("GET", `/api/programmes/${id}`);
      return res.json();
    },
    
    create: async (data: InsertProgramme): Promise<Programme> => {
      const res = await apiRequest("POST", "/api/programmes", data);
      return res.json();
    },
    
    update: async (id: number, data: Partial<InsertProgramme>): Promise<Programme> => {
      const res = await apiRequest("PUT", `/api/programmes/${id}`, data);
      return res.json();
    },
    
    delete: async (id: number): Promise<void> => {
      await apiRequest("DELETE", `/api/programmes/${id}`);
    },
  },
  
  // Projets
  projets: {
    getAll: async (programmeId?: number): Promise<Projet[]> => {
      const url = programmeId ? `/api/projets?programmeId=${programmeId}` : "/api/projets";
      const res = await apiRequest("GET", url);
      return res.json();
    },
    
    getById: async (id: number): Promise<Projet> => {
      const res = await apiRequest("GET", `/api/projets/${id}`);
      return res.json();
    },
    
    create: async (data: InsertProjet): Promise<Projet> => {
      const res = await apiRequest("POST", "/api/projets", data);
      return res.json();
    },
    
    update: async (id: number, data: Partial<InsertProjet>): Promise<Projet> => {
      const res = await apiRequest("PUT", `/api/projets/${id}`, data);
      return res.json();
    },
    
    delete: async (id: number): Promise<void> => {
      await apiRequest("DELETE", `/api/projets/${id}`);
    },
  },
  
  // Stats
  stats: {
    get: async () => {
      const res = await apiRequest("GET", "/api/stats");
      return res.json();
    },
  },
};
