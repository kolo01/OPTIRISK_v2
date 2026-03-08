// src/pages/admin/DashboardAdmin.tsx
import React, { useEffect, useState } from "react";
import { Users, UserCheck, UserX } from "lucide-react";
import UserTable, { type User } from "../../components/admin/UserTable";
import SearchBar from "../../components/admin/SearchBar";
import StatsService from "../../services/adminService/statsServices";

// Composant StatCard interne
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const DashboardAdmin: React.FC = () => {
  // Données VIDES (plus de mock)
  const [stats, setStats] = useState<any>(null);

  const [recentUsers, setRecentUsers] = useState<User[]>([]); // Tableau vide
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrage (ne retournera rien)
  const filteredUsers = (stats?.users&& Array.isArray(stats.users)) ?stats?.users?.filter(
    (user:any) =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) || []
  ) :  [];

  const handleView = (id: string) => {
    console.log("Voir détails:", id);
  };

  const handleSuspend = (id: string) => {
    console.log("Suspendre:", id);
  };

  const handleReactivate = (id: string) => {
    console.log("Réactiver:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Supprimer:", id);
  };

  const fetchStats = async () => {
    // Simuler une requête API
    await StatsService.getStats().then((response) => {
      setStats(response.data);
    });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Tableau de bord administrateur
      </h1>

      {/* Cartes de statistiques - Tout à ZERO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Utilisateurs totaux"
          value={stats?.platform_overview?.total_users}
          icon={Users}
          color="bg-gradient-to-r from-blue-600 to-indigo-600"
        />
        <StatCard
          title="Actifs"
          value={stats?.platform_overview?.active_users}
          icon={UserCheck}
          color="bg-green-500"
        />
        <StatCard
          title="Suspendus"
          value={stats?.platform_overview?.inactive_users}
          icon={UserX}
          color="bg-red-500"
        />
        <StatCard
          title="Nouveaux utilisateurs ce mois"
          value={stats?.platform_overview?.new_users_this_month}
          icon={UserCheck}
          color="bg-orange-500"
        />
      </div>

      {/* Derniers utilisateurs inscrits - TABLEAU VIDE */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Derniers utilisateurs inscrits
          </h2>
          <div className="w-64">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher..."
            />
          </div>
        </div>

        <UserTable
          users={filteredUsers} // ← Tableau vide
          onView={handleView}
          onSuspend={handleSuspend}
          onReactivate={handleReactivate}
          onDelete={handleDelete}
          showEntreprise={true}
          showAnalyses={true}
          showDerniereConnexion={true}
        />
      </div>
    </div>
  );
};

export default DashboardAdmin;
