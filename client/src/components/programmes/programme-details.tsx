import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Programme } from "@/shared/schema";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ProgrammeDetailsProps {
  programme: Programme;
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

export function ProgrammeDetails({ programme, onClose }: ProgrammeDetailsProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-primary">
            {programme.nom}
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
                  <span className="text-muted-foreground">Secteur</span>
                  <span className="font-medium">{programme.secteur}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date de début</span>
                  <span className="font-medium">
                    {programme.dateDebut ? format(new Date(programme.dateDebut), "dd MMMM yyyy", { locale: fr }) : "Non définie"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date de fin</span>
                  <span className="font-medium">
                    {programme.dateFin ? format(new Date(programme.dateFin), "dd MMMM yyyy", { locale: fr }) : "Non définie"}
                  </span>
                </div>
              </div>
            </div>

            {/* Financement */}
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-primary">Financement</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Montant global</span>
                  <span className="font-medium text-primary">
                    {programme.montantGlobal ? formatAmount(programme.montantGlobal) : "Non défini"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Participation de la région</span>
                  <span className="font-medium text-primary">
                    {programme.participationRegion ? formatAmount(programme.participationRegion) : "Non définie"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pourcentage de participation</span>
                  <span className="font-medium">
                    {programme.pourcentageParticipation ? `${programme.pourcentageParticipation}%` : "Non défini"}
                  </span>
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
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Objectif global</h4>
                  <p className="text-sm whitespace-pre-wrap">{programme.objectifGlobal || "Non défini"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Partenaires</h4>
                  <p className="text-sm whitespace-pre-wrap">{programme.partenaires || "Non définis"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 