import { useState } from "react";
import { useProgrammes } from "@/hooks/use-programmes";
import Header from "@/components/layout/header";
import ProgrammeTable from "@/components/programmes/programme-table";
import ProgrammeForm from "@/components/programmes/programme-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { SECTEURS } from "@shared/schema";
import * as XLSX from "xlsx";

export default function Programmes() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProgramme, setEditingProgramme] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");
  const [secteurFilter, setSecteurFilter] = useState("");

  const { data: programmes = [], isLoading } = useProgrammes();

  const filteredProgrammes = programmes.filter((programme) => {
    const matchesSearch = programme.nom.toLowerCase().includes(searchValue.toLowerCase()) ||
                         (programme.objectifGlobal && programme.objectifGlobal.toLowerCase().includes(searchValue.toLowerCase()));
    const matchesSecteur = !secteurFilter || secteurFilter === "tous" || programme.secteur === secteurFilter;
    return matchesSearch && matchesSecteur;
  });

  const handleAdd = () => {
    setEditingProgramme(null);
    setIsFormOpen(true);
  };

  const handleEdit = (programme: any) => {
    setEditingProgramme(programme);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProgramme(null);
  };

  const handleExport = () => {
    // Préparer les données pour l'export
    const exportData = filteredProgrammes.map(programme => ({
      "Nom du programme": programme.nom,
      "Secteur": programme.secteur,
      "Date de début": programme.dateDebut ? new Date(programme.dateDebut).toLocaleDateString() : "Non définie",
      "Durée": programme.duree || "Non définie",
      "Montant global (DH)": programme.montantGlobal || "0",
      "Contribution de la région (DH)": programme.participationRegion || "0",
      "Objectif global": programme.objectifGlobal || "Non défini",
      "Partenaires": programme.partenaires || "Non définis"
    }));

    // Créer un nouveau classeur
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Ajuster la largeur des colonnes
    const colWidths = [
      { wch: 30 }, // Nom du programme
      { wch: 20 }, // Secteur
      { wch: 15 }, // Date de début
      { wch: 15 }, // Durée
      { wch: 20 }, // Montant global
      { wch: 25 }, // Participation de la région
      { wch: 40 }, // Objectif global
      { wch: 30 }  // Partenaires
    ];
    ws['!cols'] = colWidths;

    // Ajouter la feuille au classeur
    XLSX.utils.book_append_sheet(wb, ws, "Programmes");

    // Générer le fichier Excel
    XLSX.writeFile(wb, "programmes.xlsx");
  };

  return (
    <div>
      <Header
        title="Gestion des Programmes"
        description="Vue d'ensemble et gestion des programmes de développement économique"
        onAdd={handleAdd}
        addButtonText="Nouveau Programme"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <div className="p-6 overflow-y-auto h-full">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Secteur
                  </label>
                  <Select value={secteurFilter} onValueChange={setSecteurFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Tous les secteurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les secteurs</SelectItem>
                      {SECTEURS.map((secteur) => (
                        <SelectItem key={secteur} value={secteur}>
                          {secteur}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtres avancés
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <ProgrammeTable
          programmes={filteredProgrammes}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto" showCloseButton={false}>
          <ProgrammeForm
            programme={editingProgramme}
            onClose={handleFormClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
