import React from 'react';
import { Users, UserPlus, UserCheck, UserX } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
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

interface StatsCardsProps {
  totalUsers: number;
  enAttente: number;
  actifs: number;
  suspendus: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ totalUsers, enAttente, actifs, suspendus }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Utilisateurs totaux" 
        value={totalUsers} 
        icon={Users} 
        color="bg-gradient-to-r from-blue-600 to-indigo-600"
      />
      <StatCard 
        title="En attente" 
        value={enAttente} 
        icon={UserPlus} 
        color="bg-yellow-500"
      />
      <StatCard 
        title="Actifs" 
        value={actifs} 
        icon={UserCheck} 
        color="bg-green-500"
      />
      <StatCard 
        title="Suspendus" 
        value={suspendus} 
        icon={UserX} 
        color="bg-red-500"
      />
    </div>
  );
};

export default StatsCards;