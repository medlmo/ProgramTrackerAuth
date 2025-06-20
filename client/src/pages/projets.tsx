import { useState } from "react";
import { useProjets } from "@/hooks/use-projets";
import { useProgrammes } from "@/hooks/use-programmes";
import Header from "@/components/layout/header";
import ProjetTable from "@/components/projets/projet-table";
import { ProjetForm } from "@/components/projets/projet-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { ETATS_AVANCEMENT } from "@shared/schema";
import * as XLSX from "xlsx";

export default function Projets() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProjet, setEditingProjet] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");
  const [programmeFilter, setProgrammeFilter] = useState("");
  const [etatFilter, setEtatFilter] = useState("");

  const { data: projets = [], isLoading } = useProjets();
  const { data: programmes = [] } = useProgrammes();

  const filteredProjets = projets.filter((projet) => {
    const matchesSearch = projet.nom.toLowerCase().includes(searchValue.toLowerCase()) ||
                         (projet.objectifs && projet.objectifs.toLowerCase().includes(searchValue.toLowerCase()));
    const matchesProgramme = !programmeFilter || programmeFilter === "tous" || projet.programmeId.toString() === programmeFilter;
    const matchesEtat = !etatFilter || etatFilter === "tous" || projet.etatAvancement === etatFilter;
    return matchesSearch && matchesProgramme && matchesEtat;
  });

  const handleAdd = () => {
    setEditingProjet(null);
    setIsFormOpen(true);
  };

  const handleEdit = (projet: any) => {
    setEditingProjet(projet);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProjet(null);
  };

  const handleSubmit = (data: any) => {
    handleFormClose();
  };

  const getProgrammeName = (programmeId: number) => {
    const programme = programmes.find(p => p.id === programmeId);
    return programme?.nom || "Programme inconnu";
  };

  const handleExport = () => {
    // Préparer les données pour l'export
    const exportData = filteredProjets.map(projet => ({
      "Nom du projet": projet.nom,
      "Programme": getProgrammeName(projet.programmeId),
      "État d'avancement": projet.etatAvancement,
      "Maître d'ouvrage": projet.maitreOuvrage || "Non défini",
      "Montant global (DH)": projet.montantGlobal || "0",
      "Contribution de la région (DH)": projet.participationRegion || "0",
      "Date de début": projet.dateDebut ? new Date(projet.dateDebut).toLocaleDateString() : "Non définie",
      "Durée": projet.duree || "Non définie",
      "Objectifs": projet.objectifs || "Non définis",
      "Partenaires": projet.partenaires || "Non définis",
      "Provinces": projet.provinces?.join(", ") || "Non définies",
      "Communes": projet.communes || "Non définies",
      "Indicateurs qualitatifs": projet.indicateursQualitatifs || "Non définis",
      "Indicateurs quantitatifs": projet.indicateursQuantitatifs || "Non définis",
      "Remarques": projet.remarques || "Non définies"
    }));

    // Créer un nouveau classeur
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Ajuster la largeur des colonnes
    const colWidths = [
      { wch: 30 }, // Nom du projet
      { wch: 30 }, // Programme
      { wch: 15 }, // État d'avancement
      { wch: 25 }, // Maître d'ouvrage
      { wch: 20 }, // Montant global
      { wch: 25 }, // Participation de la région
      { wch: 15 }, // Date de début
      { wch: 15 }, // Durée
      { wch: 40 }, // Objectifs
      { wch: 30 }, // Partenaires
      { wch: 30 }, // Provinces
      { wch: 30 }, // Communes
      { wch: 40 }, // Indicateurs qualitatifs
      { wch: 40 }, // Indicateurs quantitatifs
      { wch: 40 }  // Remarques
    ];
    ws['!cols'] = colWidths;

    // Ajouter la feuille au classeur
    XLSX.utils.book_append_sheet(wb, ws, "Projets");

    // Générer le fichier Excel
    XLSX.writeFile(wb, "projets.xlsx");
  };

  return (
    <div>
      <Header
        title="Gestion des Projets"
        description="Vue d'ensemble et gestion des projets associés aux programmes"
        onAdd={handleAdd}
        addButtonText="Nouveau Projet"
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
                    Programme
                  </label>
                  <Select value={programmeFilter} onValueChange={setProgrammeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Tous les programmes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les programmes</SelectItem>
                      {programmes.map((programme) => (
                        <SelectItem key={programme.id} value={programme.id.toString()}>
                          {programme.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    État
                  </label>
                  <Select value={etatFilter} onValueChange={setEtatFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Tous les états" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les états</SelectItem>
                      {ETATS_AVANCEMENT.map((etat) => (
                        <SelectItem key={etat} value={etat}>
                          {etat}
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
        <ProjetTable
          projets={filteredProjets}
          programmes={programmes}
          isLoading={isLoading}
          onEdit={handleEdit}
          getProgrammeName={getProgrammeName}
        />
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-screen overflow-y-auto" showCloseButton={false}>
          <ProjetForm
            projet={editingProjet}
            programmes={programmes}
            onCancel={handleFormClose}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
