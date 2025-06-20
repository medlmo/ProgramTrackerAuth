import { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDeleteProjet } from "@/hooks/use-projets";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProjetDetails } from "./projet-details";
import type { Projet, Programme } from "@shared/schema";

interface ProjetTableProps {
  projets: Projet[];
  programmes: Programme[];
  isLoading: boolean;
  onEdit: (projet: Projet) => void;
  getProgrammeName: (programmeId: number) => string;
}

export default function ProjetTable({ projets, programmes, isLoading, onEdit, getProgrammeName }: ProjetTableProps) {
  const deleteProjet = useDeleteProjet();
  const [selectedProjet, setSelectedProjet] = useState<Projet | null>(null);

  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const getEtatColor = (etat: string) => {
    const colors: Record<string, string> = {
      "Planifié": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      "En cours": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      "Terminé": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "Suspendu": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    };
    return colors[etat] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  const handleDelete = (id: number) => {
    deleteProjet.mutate(id);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Liste des Projets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Projets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projet</TableHead>
                  <TableHead>Programme</TableHead>
                  <TableHead>Maître d'Ouvrage</TableHead>
                  <TableHead>Montant Global</TableHead>
                  <TableHead>Contribution Région</TableHead>
                  <TableHead>État</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun projet trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  projets.map((projet) => (
                    <TableRow key={projet.id} className="table-hover">
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {projet.nom}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">
                          {getProgrammeName(projet.programmeId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">
                          {projet.maitreOuvrage}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-foreground">
                          {projet.montantGlobal ? formatAmount(projet.montantGlobal) : "Non défini"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-primary">
                          {projet.participationRegion ? formatAmount(projet.participationRegion) : "Non définie"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getEtatColor(projet.etatAvancement)}>
                          {projet.etatAvancement}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedProjet(projet)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(projet)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. Cela supprimera définitivement le projet.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(projet.id)}>
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedProjet && (
        <ProjetDetails
          projet={selectedProjet}
          programmeName={getProgrammeName(selectedProjet.programmeId)}
          onClose={() => setSelectedProjet(null)}
        />
      )}
    </>
  );
}
