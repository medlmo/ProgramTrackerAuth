import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Projet, InsertProjet } from "@shared/schema";

export function useProjets(programmeId?: number) {
  return useQuery({
    queryKey: programmeId ? ["/api/projets", { programmeId }] : ["/api/projets"],
    queryFn: () => api.projets.getAll(programmeId),
  });
}

export function useProjet(id: number) {
  return useQuery({
    queryKey: ["/api/projets", id],
    queryFn: () => api.projets.getById(id),
    enabled: !!id,
  });
}

export function useCreateProjet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.projets.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Succès",
        description: "Projet créé avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du projet",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateProjet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertProjet> }) =>
      api.projets.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projets", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Succès",
        description: "Projet mis à jour avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du projet",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteProjet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.projets.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Succès",
        description: "Projet supprimé avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du projet",
        variant: "destructive",
      });
    },
  });
}
