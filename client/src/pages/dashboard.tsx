import { useQuery } from "@tanstack/react-query";
import { FolderOpen, ListTodo, Euro, Handshake } from "lucide-react";
import Header from "@/components/layout/header";
import StatsCard from "@/components/ui/stats-card";
import { api } from "@/lib/api";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: api.stats.get,
  });

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
          title="Tableau de Bord" 
          description="Vue d'ensemble des programmes et projets" 
        />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="stats-card animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Tableau de Bord" 
        description="Vue d'ensemble des programmes et projets de développement économique" 
      />
      
      <div className="p-6 overflow-y-auto h-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Programmes"
            value={stats?.totalProgrammes || 0}
            icon={FolderOpen}
            iconColor="text-primary"
            iconBgColor="bg-blue-100 dark:bg-blue-900/20"
          />
          
          <StatsCard
            title="Projets Actifs"
            value={stats?.projetsActifs || 0}
            icon={ListTodo}
            iconColor="text-accent"
            iconBgColor="bg-green-100 dark:bg-green-900/20"
          />
          
          <StatsCard
            title="Budget Total"
            value={stats?.totalBudget ? formatAmount(stats.totalBudget) : "0 MAD"}
            icon={Euro}
            iconColor="text-yellow-600"
            iconBgColor="bg-yellow-100 dark:bg-yellow-900/20"
          />
          
          <StatsCard
            title="Contribution Région"
            value={stats?.totalParticipation ? formatAmount(stats.totalParticipation) : "0 MAD"}
            icon={Handshake}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100 dark:bg-purple-900/20"
          />
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Bienvenue dans le système de gestion des programmes RSM
          </h3>
          <p className="text-muted-foreground">
            Utilisez la navigation de gauche pour accéder aux différentes sections :
          </p>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li>• <strong>Programmes</strong> : Créer et gérer les programmes de développement</li>
            <li>• <strong>Projets</strong> : Gérer les projets associés aux programmes</li>
            <li>• <strong>Analyses</strong> : Consulter les rapports et statistiques détaillées</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
