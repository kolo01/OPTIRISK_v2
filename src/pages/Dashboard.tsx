import React, { useEffect } from 'react';
import { data, Link } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Clock, 
  CheckCircle,
  XCircle,
  Activity,
  Eye,
  Download,
  Plus,
  ChevronRight,
  Calendar,
  BarChart,
  Filter,
  Search,
  RefreshCw,
  PieChart,
  LineChart
} from 'lucide-react';
import StatsService from '../services/adminService/statsServices';

const Dashboard: React.FC = () => {
  // TODO: Remplacer par vos vraies données
  // const stats = vosDonneesAPI.stats;
  // const recentRisks = vosDonneesAPI.risks;
  // const activeAnalyses = vosDonneesAPI.analyses;
  // const recentReports = vosDonneesAPI.reports;

  const [stats, setStats] = React.useState<any>(null);

  const fetchData = async () => {
     await StatsService.getStats()
      .then((response) => {
        if (response?.success) {
          setStats(response.data);
        } else {
          console.error("Erreur lors de la récupération des statistiques");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des statistiques", error);
      }); 
  };
  useEffect(() => {
    fetchData();  
  }, []);

  return (
    <div className="space-y-6">
      {/* En-tête avec bienvenue */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tableau de bord OptiRisk Plus
            </h1>
            <p className="text-gray-600">
              Bienvenue sur votre plateforme de gestion des risques
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-sm text-gray-500">
              <Clock className="h-4 w-4 inline mr-1" />
              Dernière actualisation : --
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques principales - Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Analyses actives', icon: BarChart3, color: 'bg-blue-500', data: stats?.analyses?.total || 0 },
          { label: 'Risques identifiés', icon: Shield, color: 'bg-orange-500', data: stats?.analyses?.draft || 0 },
          { label: 'Rapports générés', icon: FileText, color: 'bg-green-500', data: stats?.analyses?.in_progress || 0 },
          { label: 'Taux de résolution', icon: TrendingUp, color: 'bg-purple-500', data: stats?.analyses?.completed || 0 },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.data}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            {/* <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Données à charger...
              </div>
            </div> */}
          </div>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Actions rapides</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              title: 'Nouvelle analyse', 
              description: 'Démarrer une analyse de risque', 
              path: '/analysis-tab', 
              icon: Plus,
              color: 'bg-blue-500'
            },
            { 
              title: 'Générer rapport', 
              description: 'Créer un rapport personnalisé', 
              path: '/rapports-page', 
              icon: FileText,
              color: 'bg-green-500'
            },
            { 
              title: 'Voir les risques', 
              description: 'Consulter les risques identifiés', 
              path: '/analysis-tab', 
              icon: Activity,
              color: 'bg-orange-500'
            },
            { 
              title: 'Mon profil', 
              description: 'Gérer votre compte', 
              path: '/profile', 
              icon: Users,
              color: 'bg-purple-500'
            },
          ].map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="group p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Section gauche - Risques récents */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Risques récents</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un risque..."
                className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled
              />
            </div>
            <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50" disabled>
              <Filter className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
        {
          stats?.recent_analyses && stats.recent_analyses.length > 0 ? (
            <ul className="space-y-4">
              {stats.recent_analyses.map((risk: any, index: number) => (  
                <li key={index} className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-red-500 text-white">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{risk.title}</p>
                    <p className="text-sm text-gray-500">{risk.organization}</p>
                    <p className="text-sm text-gray-500">{risk.status}</p>
                    <p className="text-sm text-gray-500">{risk.progress}%</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun risque Identifié</h3>
          <p className="text-gray-600 mb-4">
            Commencez par créer votre première analyse
          </p>
          <Link
            to="/analysis-tab"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Voir la page d'analyse
          </Link>
        </div>
          )}
          
        
      </div>

      {/* Section droite - Rapports récents */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Rapports récents</h2>
          <Link
            to="/rapports-page"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FileText className="h-4 w-4 mr-1" />
            Voir les rapports
          </Link>
        </div>
        
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rapport disponible</h3>
          <p className="text-gray-600">
            Générez votre premier rapport d'analyse
          </p>
        </div>
      </div>

      {/* Espace pour graphiques/statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Statistiques des risques</h2>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune donnée statistique disponible</p>
              <p className="text-sm text-gray-500 mt-2">
                Les données apparaîtront après vos premières analyses
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Évolution dans le temps</h2>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <LineChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune donnée d'évolution disponible</p>
              <p className="text-sm text-gray-500 mt-2">
                Suivez vos progrès au fil du temps
              </p>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default Dashboard;