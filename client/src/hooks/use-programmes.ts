import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Programme, InsertProgramme } from "@shared/schema";

export function useProgrammes() {
  return useQuery({
    queryKey: ["/api/programmes"],
    queryFn: api.programmes.getAll,
  });
}

export function useProgramme(id: number) {
  return useQuery({
    queryKey: ["/api/programmes", id],
    queryFn: () => api.programmes.getById(id),
    enabled: !!id,
  });
}

export function useCreateProgramme() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.programmes.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programmes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Succès",
        description: "Programme créé avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du programme",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateProgramme() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertProgramme> }) =>
      api.programmes.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/programmes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/programmes", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Succès",
        description: "Programme mis à jour avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du programme",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteProgramme() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.programmes.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programmes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Succès",
        description: "Programme supprimé avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du programme",
        variant: "destructive",
      });
    },
  });
}
