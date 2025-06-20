import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, DollarSign, Target } from "lucide-react";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function Analyses() {
  const { data: programmes, isLoading: programmesLoading } = useQuery({
    queryKey: ["/api/programmes"],
    queryFn: () => api.programmes.getAll(),
  });

  const { data: projets, isLoading: projetsLoading } = useQuery({
    queryKey: ["/api/projets"],
    queryFn: () => api.projets.getAll(),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: api.stats.get,
  });

  const isLoading = programmesLoading || projetsLoading || statsLoading;

  // Analyses par secteur
  const analysesSecteur = programmes?.reduce((acc: any, programme: any) => {
    const secteur = programme.secteur;
    if (!acc[secteur]) {
      acc[secteur] = { count: 0, budget: 0 };
    }
    acc[secteur].count += 1;
    acc[secteur].budget += parseFloat(programme.montantGlobal || "0");
    return acc;
  }, {}) || {};

  // Analyses par état d'avancement
  const analysesEtat = projets?.reduce((acc: any, projet: any) => {
    const etat = projet.etatAvancement;
    if (!acc[etat]) {
      acc[etat] = 0;
    }
    acc[etat] += 1;
    return acc;
  }, {}) || {};

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div>
        <Header 
          title="Analyses" 
          description="Analyses et statistiques des programmes et projets" 
        />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Analyses" 
        description="Analyses et statistiques des programmes et projets de développement économique" 
      />
      
      <div className="p-6 overflow-y-auto h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Analyse par secteur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Répartition par Secteur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analysesSecteur).map(([secteur, data]: [string, any]) => (
                  <div key={secteur} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{secteur}</span>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">{data.count} programme(s)</div>
                      <div className="text-sm font-semibold">{formatAmount(data.budget)}</div>
                    </div>
                  </div>
                ))}
                {Object.keys(analysesSecteur).length === 0 && (
                  <p className="text-muted-foreground text-sm">Aucune donnée disponible</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analyse par état d'avancement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                État d'Avancement des Projets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analysesEtat).map(([etat, count]: [string, any]) => (
                  <div key={etat} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{etat || "Non défini"}</span>
                    <span className="text-sm font-semibold">{count} projet(s)</span>
                  </div>
                ))}
                {Object.keys(analysesEtat).length === 0 && (
                  <p className="text-muted-foreground text-sm">Aucune donnée disponible</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Résumé financier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Résumé Financier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Budget Total:</span>
                  <span className="font-semibold">{stats?.totalBudget ? formatAmount(stats.totalBudget) : "0 MAD"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Participation Région:</span>
                  <span className="font-semibold">{stats?.totalParticipation ? formatAmount(stats.totalParticipation) : "0 MAD"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Taux de Participation:</span>
                  <span className="font-semibold">
                    {stats?.totalBudget && stats?.totalParticipation 
                      ? `${((stats.totalParticipation / stats.totalBudget) * 100).toFixed(1)}%`
                      : "0%"
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Indicateurs de performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Indicateurs de Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Programmes:</span>
                  <span className="font-semibold">{stats?.totalProgrammes || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Projets:</span>
                  <span className="font-semibold">{stats?.totalProjets || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Projets Actifs:</span>
                  <span className="font-semibold">{stats?.projetsActifs || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}