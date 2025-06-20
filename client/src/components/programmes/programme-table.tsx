import { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDeleteProgramme } from "@/hooks/use-programmes";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProgrammeDetails } from "./programme-details";
import type { Programme } from "@shared/schema";

interface ProgrammeTableProps {
  programmes: Programme[];
  isLoading: boolean;
  onEdit: (programme: Programme) => void;
}

export default function ProgrammeTable({ programmes, isLoading, onEdit }: ProgrammeTableProps) {
  const deleteProgramme = useDeleteProgramme();
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);

  const formatAmount = (amount: string | null) => {
    if (!amount) return "Non défini";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const getSecteurColor = (secteur: string) => {
    const colors: Record<string, string> = {
      Agriculture: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
      Industrie: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      Aquaculture: "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400",
      Logistique: "bg-lime-100 text-lime-800 dark:bg-lime-900/20 dark:text-lime-400",
      Emploi: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      Tourisme: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      Artisanat: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
      Services: "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400",
      Infrastructure: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      Formation: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    };
    return colors[secteur] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  const handleDelete = (id: number) => {
    deleteProgramme.mutate(id);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Liste des Programmes</CardTitle>
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
          <CardTitle>Liste des Programmes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Programme</TableHead>
                  <TableHead>Secteur</TableHead>
                  <TableHead>Date de début</TableHead>
                  <TableHead>Montant Global</TableHead>
                  <TableHead>Contribution Région</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programmes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun programme trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  programmes.map((programme) => (
                    <TableRow key={programme.id} className="table-hover">
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {programme.nom}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {programme.objectifGlobal}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSecteurColor(programme.secteur)}>
                          {programme.secteur}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">
                          {programme.dateDebut ? new Date(programme.dateDebut).toLocaleDateString() : "Non définie"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-foreground">
                          {programme.montantGlobal ? formatAmount(programme.montantGlobal) : "Non défini"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-primary">
                          {programme.participationRegion ? formatAmount(programme.participationRegion) : "Non définie"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedProgramme(programme)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(programme)}
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
                                  Cette action est irréversible. Cela supprimera définitivement le programme.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(programme.id)}>
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

      {selectedProgramme && (
        <ProgrammeDetails
          programme={selectedProgramme}
          onClose={() => setSelectedProgramme(null)}
        />
      )}
    </>
  );
}
