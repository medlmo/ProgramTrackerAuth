import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProgrammeSchema, insertProjetSchema, insertUserSchema, loginSchema, users } from "@shared/schema";
import { z } from "zod";
import { authenticateUser, requireAuth, requireEditor, requireViewer, requireAdmin, hashPassword, generateToken, type AuthenticatedRequest } from "./auth";
import { db } from "./db";
import { eq } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await authenticateUser(username, password);
      
      if (!user) {
        return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
      }

      const token = generateToken(user);
      
      // Set cookie for browser compatibility
      res.cookie('authToken', token, {
        httpOnly: false, // Allow JavaScript access for frontend
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
      });

      res.json({ 
        message: "Connexion réussie",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      console.error('Login error:', error);
      res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie('authToken');
    res.json({ message: "Déconnexion réussie" });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    const authReq = req as AuthenticatedRequest;
    res.json({
      user: authReq.user
    });
  });

  // User management routes (admin only)
  app.post("/api/users", requireAuth, requireAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const passwordHash = await hashPassword(userData.password);
      
      const newUser = await db.insert(users).values({
        username: userData.username,
        passwordHash,
        role: userData.role
      }).returning({
        id: users.id,
        username: users.username,
        role: users.role,
        createdAt: users.createdAt
      });

      res.status(201).json(newUser[0]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
    }
  });

  app.get("/api/users", requireAuth, requireAdmin, async (req, res) => {
    try {
      const allUsers = await db.select({
        id: users.id,
        username: users.username,
        role: users.role,
        createdAt: users.createdAt
      }).from(users);
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
  });

  app.delete("/api/users/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const authReq = req as AuthenticatedRequest;
      
      if (id === authReq.user?.id) {
        return res.status(400).json({ message: "Vous ne pouvez pas supprimer votre propre compte" });
      }

      await db.delete(users).where(eq(users.id, id));
      res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
    }
  });

  // Programmes routes
  app.get("/api/programmes", requireAuth, requireViewer, async (req, res) => {
    try {
      const programmes = await storage.getProgrammes();
      res.json(programmes);
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: "Erreur lors de la récupération des programmes" });
    }
  });

  app.get("/api/programmes/:id", requireViewer, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const programme = await storage.getProgramme(id);
      if (!programme) {
        return res.status(404).json({ message: "Programme non trouvé" });
      }
      res.json(programme);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération du programme" });
    }
  });

  app.post("/api/programmes", requireAuth, requireEditor, async (req, res) => {
    try {
      const validatedData = insertProgrammeSchema.parse(req.body);

      // Supprimer les chaînes vides pour les champs numériques
      const vd = validatedData as any;
      ["montantGlobal", "participationRegion"].forEach((key) => {
        if (vd[key] === "") delete vd[key];
      });

      const programme = await storage.createProgramme(validatedData);
      res.status(201).json(programme);
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: "Erreur lors de la création du programme", error: error.message });
    }
  });

  app.put("/api/programmes/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = z.object(insertProgrammeSchema._def.schema.shape).partial().parse(req.body);

      // Conversion explicite de la date si string
      if (validatedData.dateDebut && typeof validatedData.dateDebut === "string") {
        validatedData.dateDebut = new Date(validatedData.dateDebut);
      }
      // Supprimer les chaînes vides pour les champs numériques
      const vd = validatedData as any;
      ["montantGlobal", "participationRegion"].forEach((key) => {
        if (vd[key] === "") delete vd[key];
      });

      const programme = await storage.updateProgramme(id, validatedData);
      if (!programme) {
        return res.status(404).json({ message: "Programme non trouvé" });
      }
      res.json(programme);
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: "Erreur lors de la mise à jour du programme" });
    }
  });

  app.delete("/api/programmes/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProgramme(id);
      if (!deleted) {
        return res.status(404).json({ message: "Programme non trouvé" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du programme" });
    }
  });

  // Projets routes
  app.get("/api/projets", requireAuth, requireViewer, async (req, res) => {
    try {
      const { programmeId } = req.query;
      let projets;
      
      if (programmeId) {
        projets = await storage.getProjetsByProgramme(parseInt(programmeId as string));
      } else {
        projets = await storage.getProjets();
      }
      
      res.json(projets);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des projets" });
    }
  });

  app.get("/api/projets/:id", requireViewer, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const projet = await storage.getProjet(id);
      if (!projet) {
        return res.status(404).json({ message: "Projet non trouvé" });
      }
      res.json(projet);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération du projet" });
    }
  });

  app.post("/api/projets", requireAuth, requireEditor, async (req, res) => {
    try {
      const validatedData = insertProjetSchema.parse(req.body);

      // Supprimer les chaînes vides pour les champs numériques
      const vd = validatedData as any;
      ["montantGlobal", "participationRegion"].forEach((key) => {
        if (vd[key] === "") delete vd[key];
      });

      const projet = await storage.createProjet(validatedData);
      res.status(201).json(projet);
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: "Erreur lors de la création du projet" });
    }
  });

  app.put("/api/projets/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = z.object(insertProjetSchema._def.schema.shape).partial().parse(req.body);

      // Conversion explicite de la date si string
      if (validatedData.dateDebut && typeof validatedData.dateDebut === "string") {
        validatedData.dateDebut = new Date(validatedData.dateDebut);
      }
      // Supprimer les chaînes vides pour les champs numériques
      const vd = validatedData as any;
      ["montantGlobal", "participationRegion"].forEach((key) => {
        if (vd[key] === "") delete vd[key];
      });

      const projet = await storage.updateProjet(id, validatedData);
      if (!projet) {
        return res.status(404).json({ message: "Projet non trouvé" });
      }
      res.json(projet);
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: "Erreur lors de la mise à jour du projet" });
    }
  });

  app.delete("/api/projets/:id", requireAuth, requireEditor, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProjet(id);
      if (!deleted) {
        return res.status(404).json({ message: "Projet non trouvé" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du projet" });
    }
  });

  // Statistics endpoint
  app.get("/api/stats", requireAuth, requireViewer, async (req, res) => {
    try {
      const programmes = await storage.getProgrammes();
      const projets = await storage.getProjets();
      
      const totalProgrammes = programmes.length;
      const totalProjets = projets.length;
      const projetsActifs = projets.filter(p => p.etatAvancement === "En cours").length;
      
      const totalBudget = programmes.reduce((sum, p) => sum + parseFloat(p.montantGlobal || "0"), 0);
      const totalParticipation = programmes.reduce((sum, p) => sum + parseFloat(p.participationRegion || "0"), 0);
      
      res.json({
        totalProgrammes,
        totalProjets,
        projetsActifs,
        totalBudget,
        totalParticipation
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
