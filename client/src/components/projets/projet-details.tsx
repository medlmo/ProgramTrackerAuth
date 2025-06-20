import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Projet } from "@/shared/schema";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ProjetDetailsProps {
  projet: Projet;
  programmeName: string;
  onClose: () => void;
}

const formatAmount = (amount: string | null) => {
  if (!amount) return "Non défini";
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Planifié":
      return "bg-blue-100 text-blue-800";
    case "En cours":
      return "bg-yellow-100 text-yellow-800";
    case "Terminé":
      return "bg-green-100 text-green-800";
    case "Suspendu":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function ProjetDetails({ projet, programmeName, onClose }: ProjetDetailsProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-primary">
            {projet.nom}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-primary">Informations générales</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Programme</span>
                  <span className="font-medium">{programmeName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">État d'avancement</span>
                  <Badge className={getStatusColor(projet.etatAvancement)}>
                    {projet.etatAvancement}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Maître d'ouvrage</span>
                  <span className="font-medium">{projet.maitreOuvrage || "Non défini"}</span>
                </div>
              </div>
            </div>

            {/* Financement */}
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-primary">Financement</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Montant global</h4>
                    <p className="text-lg font-semibold">
                      {projet.montantGlobal ? formatAmount(projet.montantGlobal) : "Non défini"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Contribution de la région</h4>
                    <p className="text-lg font-semibold">
                      {projet.participationRegion ? formatAmount(projet.participationRegion) : "Non définie"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Pourcentage de contribution</h4>
                    <p className="text-lg font-semibold">
                      {projet.montantGlobal && projet.participationRegion
                        ? `${((Number(projet.participationRegion) / Number(projet.montantGlobal)) * 100).toFixed(2)}%`
                        : "Non défini"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date de début</span>
                  <span className="font-medium">
                    {projet.dateDebut ? format(new Date(projet.dateDebut), "dd MMMM yyyy", { locale: fr }) : "Non définie"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Durée</span>
                  <span className="font-medium">{projet.duree || "Non définie"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Objectifs et partenaires */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-primary">Objectifs et partenaires</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Objectifs</h4>
                  <p className="text-sm whitespace-pre-wrap">{projet.objectifs || "Non définis"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Partenaires</h4>
                  <p className="text-sm whitespace-pre-wrap">{projet.partenaires || "Non définis"}</p>
                </div>
              </div>
            </div>

            {/* Localisation */}
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-primary">Localisation</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Provinces</h4>
                  <div className="flex flex-wrap gap-2">
                    {projet.provinces?.map((province) => (
                      <Badge key={province} variant="secondary">
                        {province}
                      </Badge>
                    )) || "Non définies"}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Communes</h4>
                  <p className="text-sm whitespace-pre-wrap">{projet.communes || "Non définies"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Indicateurs */}
          <div className="space-y-4 md:col-span-2">
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-primary">Indicateurs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Indicateurs qualitatifs</h4>
                  <p className="text-sm whitespace-pre-wrap">{projet.indicateursQualitatifs || "Non définis"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Indicateurs quantitatifs</h4>
                  <p className="text-sm whitespace-pre-wrap">{projet.indicateursQuantitatifs || "Non définis"}</p>
                </div>
              </div>
            </div>

            {/* Remarques */}
            {projet.remarques && (
              <div className="bg-card rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-primary">Remarques</h3>
                <p className="text-sm whitespace-pre-wrap">{projet.remarques}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 