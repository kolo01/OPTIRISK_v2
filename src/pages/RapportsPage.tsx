import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  FileText, Download, Eye, Edit, Trash, Filter, Search,
  Calendar, User, Building, BarChart, Clock, Plus,
  ChevronLeft, ChevronRight, Loader, AlertCircle,
  CheckCircle, XCircle, Upload, SortAsc, SortDesc,
  MoreVertical, Share2, Copy, ExternalLink, Printer
} from "lucide-react";
import SweetButton from './SweetButton';

// --- Types avancés ---
export interface Rapport {
  id: string;
  titre: string;
  description: string;
  dateCreation: Date;
  dateModification: Date;
  statut: 'Publié' | 'Brouillon' | 'Archivé' | 'En attente';
  categorie: 'Financier' | 'Commercial' | 'Technique' | 'RH' | 'Marketing' | 'Autre';
  auteur: {
    id: string;
    nom: string;
    email: string;
    avatar?: string;
  };
  organisation: string;
  vues: number;
  taille: number; // en bytes
  motsCles: string[];
  version: string;
  estPublic: boolean;
  permissions: string[];
  metadata: {
    pages: number;
    langage: string;
    format: 'PDF' | 'DOCX' | 'XLSX' | 'PPTX';
    derniereOuverture?: Date;
  };
}

interface RapportFiltres {
  statut: string;
  categorie: string;
  dateDebut: string;
  dateFin: string;
  auteurId: string;
  recherche: string;
}

interface Tri {
  champ: keyof Rapport;
  direction: 'asc' | 'desc';
}

// --- Composants enfants pour modularité ---
const BadgeStatut = ({ statut }: { statut: Rapport['statut'] }) => {
  const configs = {
    'Publié': { bg: 'bg-emerald-500', icon: CheckCircle, text: 'PUBLIÉ' },
    'Brouillon': { bg: 'bg-amber-500', icon: AlertCircle, text: 'BROUILLON' },
    'Archivé': { bg: 'bg-slate-600', icon: Clock, text: 'ARCHIVÉ' },
    'En attente': { bg: 'bg-blue-500', icon: Clock, text: 'EN ATTENTE' }
  };
  
  const config = configs[statut];
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-white font-bold text-xs ${config.bg}`}>
      <Icon className="w-3 h-3 mr-1.5" />
      {config.text}
    </span>
  );
};

const BadgeCategorie = ({ categorie }: { categorie: Rapport['categorie'] }) => {
  const couleurs = {
    'Financier': 'bg-blue-600',
    'Commercial': 'bg-purple-600',
    'Technique': 'bg-orange-600',
    'RH': 'bg-pink-600',
    'Marketing': 'bg-indigo-600',
    'Autre': 'bg-gray-600'
  };
  
  return (
    <span className={`px-3 py-1.5 rounded-lg text-white font-bold text-xs ${couleurs[categorie]}`}>
      {categorie.toUpperCase()}
    </span>
  );
};

const CarteRapport = ({ rapport, onAction }: { 
  rapport: Rapport; 
  onAction: (action: string, rapport: Rapport) => void;
}) => (
  <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <BadgeStatut statut={rapport.statut} />
            <BadgeCategorie categorie={rapport.categorie} />
            {rapport.estPublic && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
                PUBLIC
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {rapport.titre}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {rapport.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1.5" />
              <span className="font-medium">{rapport.auteur.nom}</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1.5" />
              <span>{rapport.vues} vues</span>
            </div>
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      
      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Format:</span>
            <span className="ml-2 font-bold text-gray-900">{rapport.metadata.format}</span>
          </div>
          <div>
            <span className="text-gray-500">Taille:</span>
            <span className="ml-2 font-bold text-gray-900">
              {(rapport.taille / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="border-t px-6 py-4 bg-gray-50 rounded-b-xl">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <Calendar className="inline w-4 h-4 mr-1.5" />
          {rapport.dateModification.toLocaleDateString('fr-FR')}
        </div>
        <div className="flex gap-2">
          <SweetButton
            className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
            onClick={() => onAction('voir', rapport)}
          >
            <Eye className="w-4 h-4" />
          </SweetButton>
          <SweetButton
            className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
            onClick={() => onAction('telecharger', rapport)}
          >
            <Download className="w-4 h-4" />
          </SweetButton>
          <SweetButton
            className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
            onClick={() => onAction('partager', rapport)}
          >
            <Share2 className="w-4 h-4" />
          </SweetButton>
        </div>
      </div>
    </div>
  </div>
);

// --- Composant principal ---
const RapportsPage = () => {
  // --- États avancés ---
  const [rapports, setRapports] = useState<Rapport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vue, setVue] = useState<'tableau' | 'grille'>('tableau');
  const [tri, setTri] = useState<Tri>({ champ: 'dateModification', direction: 'desc' });
  const [filtres, setFiltres] = useState<RapportFiltres>({
    statut: 'Tous',
    categorie: 'Tous',
    dateDebut: '',
    dateFin: '',
    auteurId: '',
    recherche: ''
  });
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [taillePage, setTaillePage] = useState(20);
  const [total, setTotal] = useState(0);

  // --- Récupération optimisée des données ---
  const fetchRapports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construction des paramètres de requête
      const params = new URLSearchParams({
        page: page.toString(),
        limit: taillePage.toString(),
        sortBy: tri.champ,
        sortOrder: tri.direction,
        ...Object.entries(filtres).reduce((acc, [key, value]) => {
          if (value && value !== 'Tous') acc[key] = value;
          return acc;
        }, {} as Record<string, string>)
      });
      
      // ⚠️ À ADAPTER : Votre endpoint API
      const response = await fetch(`VOTRE_API_RAPPORTS?${params}`);
      
      if (!response.ok) throw new Error(`Erreur ${response.status}`);
      
      const data = await response.json();
      setRapports(data.items);
      setTotal(data.total);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  }, [page, taillePage, tri, filtres]);

  useEffect(() => {
    fetchRapports();
  }, [fetchRapports]);

  // --- Calculs mémoisés ---
  const stats = useMemo(() => ({
    total: total,
    publies: rapports.filter(r => r.statut === 'Publié').length,
    brouillons: rapports.filter(r => r.statut === 'Brouillon').length,
    archives: rapports.filter(r => r.statut === 'Archivé').length,
    enAttente: rapports.filter(r => r.statut === 'En attente').length,
    totalTaille: rapports.reduce((acc, r) => acc + r.taille, 0)
  }), [rapports, total]);

  const categoriesUniques = useMemo(() => 
    [...new Set(rapports.map(r => r.categorie))], 
    [rapports]
  );

  // --- Fonctions avancées ---
  const handleTri = (champ: keyof Rapport) => {
    setTri(prev => ({
      champ,
      direction: prev.champ === champ && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelection = (id: string) => {
    setSelection(prev => {
      const nouveau = new Set(prev);
      if (nouveau.has(id)) {
        nouveau.delete(id);
      } else {
        nouveau.add(id);
      }
      return nouveau;
    });
  };

  const handleSelectionTout = () => {
    if (selection.size === rapports.length) {
      setSelection(new Set());
    } else {
      setSelection(new Set(rapports.map(r => r.id)));
    }
  };

  const handleActionGroupee = (action: string) => {
    // Actions sur les éléments sélectionnés
    switch (action) {
      case 'supprimer':
        if (window.confirm(`Supprimer ${selection.size} rapport(s) ?`)) {
          // ⚠️ À ADAPTER : Appel API pour suppression multiple
          console.log('Suppression de:', Array.from(selection));
        }
        break;
      case 'telecharger':
        // Logique de téléchargement multiple
        break;
      case 'exporter':
        // Logique d'export
        break;
    }
  };

  const handleActionRapport = (action: string, rapport: Rapport) => {
    switch (action) {
      case 'voir':
        window.open(`/rapports/${rapport.id}`, '_blank');
        break;
      case 'telecharger':
        // Logique de téléchargement
        break;
      case 'partager':
        // Logique de partage
        break;
      case 'editer':
        // Navigation vers édition
        break;
      case 'dupliquer':
        // Logique de duplication
        break;
      case 'imprimer':
        window.print();
        break;
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // ⚠️ À ADAPTER : Logique d'import
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('VOTRE_API_IMPORT', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        fetchRapports(); // Rafraîchir la liste
      }
    } catch (err) {
      console.error('Erreur import:', err);
    }
  };

  // --- Rendu conditionnel ---
  if (loading && rapports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-700 font-medium">Chargement des rapports...</p>
        <p className="text-gray-500 text-sm mt-2">Veuillez patienter</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      
      {/* En-tête avancé */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📈 Rapports Analytiques</h1>
          <p className="text-gray-600 mt-2">
            {total} rapport(s) • {(stats.totalTaille / 1024 / 1024).toFixed(2)} MB total
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <label className="cursor-pointer">
            <input 
              type="file" 
              className="hidden" 
              onChange={handleImport} 
              accept=".pdf,.docx,.xlsx,.pptx"
            />
            <SweetButton
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 px-4 py-2 rounded-lg"
            >
              <Upload className="w-4 h-4" />
              Importer
            </SweetButton>
          </label>
          
          <SweetButton
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 px-4 py-2 rounded-lg"
            onClick={() => setVue(vue === 'tableau' ? 'grille' : 'tableau')}
          >
            {vue === 'tableau' ? 'Vue Grille' : 'Vue Tableau'}
          </SweetButton>
          
          <SweetButton
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg"
            onClick={() => console.log('Nouveau rapport')}
          >
            <Plus className="w-4 h-4" />
            Nouveau Rapport
          </SweetButton>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries({
          'Total': { value: stats.total, color: 'bg-blue-500', icon: BarChart },
          'Publiés': { value: stats.publies, color: 'bg-emerald-500', icon: CheckCircle },
          'Brouillons': { value: stats.brouillons, color: 'bg-amber-500', icon: AlertCircle },
          'Archivés': { value: stats.archives, color: 'bg-slate-600', icon: Clock },
          'En attente': { value: stats.enAttente, color: 'bg-blue-400', icon: Clock }
        }).map(([label, { value, color, icon: Icon }]) => (
          <div key={label} className="bg-white rounded-lg shadow border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barre d'actions avec sélection */}
      {selection.size > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-indigo-900">
                {selection.size} élément(s) sélectionné(s)
              </span>
            </div>
            <div className="flex gap-2">
              <SweetButton
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 text-sm rounded-lg flex items-center"
                onClick={() => handleActionGroupee('telecharger')}
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </SweetButton>
              <SweetButton
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 text-sm rounded-lg flex items-center"
                onClick={() => handleActionGroupee('exporter')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Exporter
              </SweetButton>
              <SweetButton
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-sm rounded-lg flex items-center"
                onClick={() => handleActionGroupee('supprimer')}
              >
                <Trash className="w-4 h-4 mr-2" />
                Supprimer
              </SweetButton>
            </div>
          </div>
        </div>
      )}

      {/* Filtres avancés */}
      <div className="bg-white rounded-xl shadow border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="inline w-4 h-4 mr-2" />
              Recherche
            </label>
            <input
              type="text"
              placeholder="Rechercher dans les rapports..."
              className="w-full px-4 py-2 border rounded-lg"
              value={filtres.recherche}
              onChange={(e) => setFiltres({...filtres, recherche: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline w-4 h-4 mr-2" />
              Statut
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={filtres.statut}
              onChange={(e) => setFiltres({...filtres, statut: e.target.value})}
            >
              <option value="Tous">Tous les statuts</option>
              <option value="Publié">Publié</option>
              <option value="Brouillon">Brouillon</option>
              <option value="Archivé">Archivé</option>
              <option value="En attente">En attente</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={filtres.categorie}
              onChange={(e) => setFiltres({...filtres, categorie: e.target.value})}
            >
              <option value="Tous">Toutes catégories</option>
              {categoriesUniques.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date début
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg"
              value={filtres.dateDebut}
              onChange={(e) => setFiltres({...filtres, dateDebut: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date fin
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg"
              value={filtres.dateFin}
              onChange={(e) => setFiltres({...filtres, dateFin: e.target.value})}
            />
          </div>
          
          <div className="flex items-end">
            <SweetButton
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
              onClick={() => setFiltres({
                statut: 'Tous',
                categorie: 'Tous',
                dateDebut: '',
                dateFin: '',
                auteurId: '',
                recherche: ''
              })}
            >
              Réinitialiser les filtres
            </SweetButton>
          </div>
        </div>
      </div>

      {/* Affichage selon la vue */}
      {vue === 'grille' ? (
        // Vue grille
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rapports.map(rapport => (
            <CarteRapport
              key={rapport.id}
              rapport={rapport}
              onAction={handleActionRapport}
            />
          ))}
        </div>
      ) : (
        // Vue tableau avancée
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selection.size === rapports.length}
                      onChange={handleSelectionTout}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => handleTri('titre')}
                    >
                      Titre
                      {tri.champ === 'titre' && (
                        tri.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => handleTri('categorie')}
                    >
                      Catégorie
                      {tri.champ === 'categorie' && (
                        tri.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => handleTri('statut')}
                    >
                      Statut
                      {tri.champ === 'statut' && (
                        tri.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => handleTri('dateModification')}
                    >
                      Dernière modification
                      {tri.champ === 'dateModification' && (
                        tri.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                    Taille
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rapports.map(rapport => (
                  <tr key={rapport.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selection.has(rapport.id)}
                        onChange={() => handleSelection(rapport.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-gray-900">{rapport.titre}</div>
                        <div className="text-sm text-gray-600 mt-1">{rapport.description}</div>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Building className="w-3 h-3 mr-1" />
                          {rapport.organisation}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <BadgeCategorie categorie={rapport.categorie} />
                    </td>
                    <td className="px-6 py-4">
                      <BadgeStatut statut={rapport.statut} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {rapport.dateModification.toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-gray-500">
                          {rapport.dateModification.toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {(rapport.taille / 1024 / 1024).toFixed(2)} MB
                      </div>
                      <div className="text-sm text-gray-500">
                        {rapport.metadata.format}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <SweetButton
                          className="bg-transparent text-gray-700 hover:bg-gray-100 px-2 py-1.5 rounded"
                          onClick={() => handleActionRapport('voir', rapport)}
                          title="Voir"
                        >
                          <Eye className="w-4 h-4" />
                        </SweetButton>
                        <SweetButton
                          className="bg-transparent text-gray-700 hover:bg-gray-100 px-2 py-1.5 rounded"
                          onClick={() => handleActionRapport('telecharger', rapport)}
                          title="Télécharger"
                        >
                          <Download className="w-4 h-4" />
                        </SweetButton>
                        <SweetButton
                          className="bg-transparent text-gray-700 hover:bg-gray-100 px-2 py-1.5 rounded"
                          onClick={() => handleActionRapport('partager', rapport)}
                          title="Partager"
                        >
                          <Share2 className="w-4 h-4" />
                        </SweetButton>
                        <SweetButton
                          className="bg-transparent text-gray-700 hover:bg-gray-100 px-2 py-1.5 rounded"
                          onClick={() => handleActionRapport('editer', rapport)}
                          title="Éditer"
                        >
                          <Edit className="w-4 h-4" />
                        </SweetButton>
                        <SweetButton
                          className="bg-transparent text-gray-700 hover:bg-gray-100 px-2 py-1.5 rounded"
                          onClick={() => handleActionRapport('dupliquer', rapport)}
                          title="Dupliquer"
                        >
                          <Copy className="w-4 h-4" />
                        </SweetButton>
                        <SweetButton
                          className="bg-transparent text-gray-700 hover:bg-gray-100 px-2 py-1.5 rounded"
                          onClick={() => handleActionRapport('imprimer', rapport)}
                          title="Imprimer"
                        >
                          <Printer className="w-4 h-4" />
                        </SweetButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination avancée */}
      {rapports.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-lg shadow border p-4">
          <div className="text-gray-700 mb-4 sm:mb-0">
            Affichage de <span className="font-bold">{((page - 1) * taillePage) + 1}</span> à{' '}
            <span className="font-bold">{Math.min(page * taillePage, total)}</span> sur{' '}
            <span className="font-bold">{total}</span> rapports
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Par page:</span>
              <select
                className="border rounded px-2 py-1"
                value={taillePage}
                onChange={(e) => setTaillePage(Number(e.target.value))}
              >
                {[10, 20, 50, 100].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <SweetButton
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </SweetButton>
              
              {Array.from({ length: Math.ceil(total / taillePage) }, (_, i) => i + 1)
                .filter(p => p === 1 || p === page || p === page - 1 || p === page + 1 || p === Math.ceil(total / taillePage))
                .map((p, i, arr) => (
                  <div key={p} className="flex items-center">
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span className="px-2">...</span>
                    )}
                    <SweetButton
                      className={`min-w-[40px] px-3 py-1.5 rounded ${
                        p === page 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </SweetButton>
                  </div>
                ))}
              
              <SweetButton
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={page === Math.ceil(total / taillePage)}
                onClick={() => setPage(p => Math.min(Math.ceil(total / taillePage), p + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </SweetButton>
            </div>
          </div>
        </div>
      )}

      {/* État vide */}
      {rapports.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-xl shadow border">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-3">Aucun rapport trouvé</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            {filtres.recherche || filtres.statut !== 'Tous' || filtres.categorie !== 'Tous'
              ? 'Aucun rapport ne correspond à vos critères de recherche.'
              : 'Commencez par créer votre premier rapport pour le voir apparaître ici.'}
          </p>
          <div className="flex gap-3 justify-center">
            <SweetButton
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg"
              onClick={() => setFiltres({
                statut: 'Tous',
                categorie: 'Tous',
                dateDebut: '',
                dateFin: '',
                auteurId: '',
                recherche: ''
              })}
            >
              Réinitialiser les filtres
            </SweetButton>
            <SweetButton
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
              onClick={() => console.log('Créer un rapport')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer un rapport
            </SweetButton>
          </div>
        </div>
      )}

      {/* Gestion des erreurs */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-500 mr-4" />
            <div>
              <h3 className="text-lg font-bold text-red-800">Erreur</h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchRapports}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RapportsPage;