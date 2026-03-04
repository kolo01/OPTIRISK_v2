// src/components/Analysis/Atelier2.tsx
import React, { useState, useEffect } from 'react';
import { 
  Target, 
  AlertTriangle, 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  BarChart3, 
  Users, 
  Cpu, 
  Building,
  Globe,
  CloudRain, 
  Filter,
  Star,
  Download,
  Upload,
  Zap,
  Shield,
  Eye,
  Key,
  Clock
} from 'lucide-react';
import { type Analysis } from '../../types/data';
import { objectifsVisesParDefaut, sourcesParContexte, motivationsTypes, capacitesTypes } from '../../data/sourcesRisqueData';

interface Atelier2Props {
  analysisData: Analysis;
  updateAnalysisData: (updates: Partial<Analysis>) => void;
}

const Atelier2: React.FC<Atelier2Props> = ({ analysisData, updateAnalysisData }) => {
  // Initialisation des données
  const config = analysisData.workshop2 || {
    objectifsVises: objectifsVisesParDefaut,
    sourcesRisque: [],
    couplesSROV: [],
    cartographie: ''
  };

  const [localData, setLocalData] = useState(config);
  const [nouvelleSource, setNouvelleSource] = useState({
    nom: '',
    description: '',
    type: 'Humain' as 'Humain' | 'Technique' | 'Organisationnel' | 'Naturel' | 'Externe',
    motivation: '',
    capacites: [] as string[],
    historique: '',
    objectifsVises: [] as string[],
    pertinence: 3,
    justification: ''
  });

  const [nouvelObjectif, setNouvelObjectif] = useState({
    nom: '',
    description: '',
    categorie: 'Confidentialité' as 'Confidentialité' | 'Intégrité' | 'Disponibilité' | 'Traçabilité' | 'Conformité' | 'Autre'
  });

  const [nouveauCouple, setNouveauCouple] = useState({
    sourceRisqueId: '',
    objectifViseId: '',
    pertinence: 3,
    commentaire: ''
  });

  const [filtreType, setFiltreType] = useState<string>('Tous');
  const [filtrePertinence, setFiltrePertinence] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'sources' | 'objectifs' | 'couples'>('sources');

  // Charger les sources par défaut selon le contexte
  useEffect(() => {
    const contexte = analysisData.workshop1.config.contexte;
    const sourcesDefault = sourcesParContexte[contexte] || sourcesParContexte['Banque & Finance'] || [];
    
    if (localData.sourcesRisque.length === 0 && sourcesDefault.length > 0) {
      const sourcesCompletes = sourcesDefault.map((src, index) => ({
        id: `sr_def_${index}`,
        nom: src.nom || `Source ${index + 1}`,
        description: src.description || 'À compléter',
        type: src.type || 'Externe',
        motivation: src.motivation || 'À définir',
        capacites: src.capacites || [],
        historique: '',
        objectifsVises: [],
        pertinence: 3,
        justification: ''
      }));
      
      setLocalData(prev => ({
        ...prev,
        sourcesRisque: sourcesCompletes
      }));
    }
  }, []);

  // Mettre à jour les données parentes
  useEffect(() => {
    updateAnalysisData({ workshop2: localData });
  }, [localData]);

  const handleLocalUpdate = (updates: Partial<typeof localData>) => {
    setLocalData(prev => ({ ...prev, ...updates }));
  };

  // Gérer les sources de risque
  const handleAddSource = () => {
    if (!nouvelleSource.nom.trim()) return;

    const nouvelleSourceComplete = {
      id: `sr_${Date.now()}`,
      ...nouvelleSource
    };

    setLocalData(prev => ({
      ...prev,
      sourcesRisque: [...prev.sourcesRisque, nouvelleSourceComplete]
    }));

    setNouvelleSource({
      nom: '',
      description: '',
      type: 'Humain',
      motivation: '',
      capacites: [],
      historique: '',
      objectifsVises: [],
      pertinence: 3,
      justification: ''
    });

    setActiveTab('sources');
  };

  const handleUpdateSource = (id: string, updates: Partial<any>) => {
    setLocalData(prev => ({
      ...prev,
      sourcesRisque: prev.sourcesRisque.map(src => 
        src.id === id ? { ...src, ...updates } : src
      )
    }));
  };

  const handleRemoveSource = (id: string) => {
    setLocalData(prev => ({
      ...prev,
      sourcesRisque: prev.sourcesRisque.filter(src => src.id !== id),
      couplesSROV: prev.couplesSROV.filter(couple => couple.sourceRisqueId !== id)
    }));
  };

  // Gérer les objectifs visés
  const handleAddObjectif = () => {
    if (!nouvelObjectif.nom.trim()) return;

    const nouvelObjectifComplet = {
      id: `ov_${Date.now()}`,
      ...nouvelObjectif
    };

    setLocalData(prev => ({
      ...prev,
      objectifsVises: [...prev.objectifsVises, nouvelObjectifComplet]
    }));

    setNouvelObjectif({
      nom: '',
      description: '',
      categorie: 'Confidentialité'
    });
  };

  // Gérer les couples SR/OV
  const handleAddCouple = () => {
    if (!nouveauCouple.sourceRisqueId || !nouveauCouple.objectifViseId) return;

    const existeDeja = localData.couplesSROV.some(
      couple => 
        couple.sourceRisqueId === nouveauCouple.sourceRisqueId && 
        couple.objectifViseId === nouveauCouple.objectifViseId
    );

    if (existeDeja) return;

    const nouveauCoupleComplet = {
      id: `sr_ov_${Date.now()}`,
      ...nouveauCouple
    };

    setLocalData(prev => ({
      ...prev,
      couplesSROV: [...prev.couplesSROV, nouveauCoupleComplet]
    }));

    setNouveauCouple({
      sourceRisqueId: '',
      objectifViseId: '',
      pertinence: 3,
      commentaire: ''
    });

    setActiveTab('couples');
  };

  const handleRemoveCouple = (id: string) => {
    setLocalData(prev => ({
      ...prev,
      couplesSROV: prev.couplesSROV.filter(couple => couple.id !== id)
    }));
  };

  // Gérer les capacités
  const toggleCapacite = (capacite: string) => {
    setNouvelleSource(prev => ({
      ...prev,
      capacites: prev.capacites.includes(capacite)
        ? prev.capacites.filter(c => c !== capacite)
        : [...prev.capacites, capacite]
    }));
  };

  // Obtenir l'icône pour le type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Humain': return <Users className="w-4 h-4" />;
      case 'Technique': return <Cpu className="w-4 h-4" />;
      case 'Organisationnel': return <Building className="w-4 h-4" />;
      case 'Naturel': return <CloudRain className="w-4 h-4" />;
      case 'Externe': return <Globe className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Humain': return 'bg-blue-900/50 text-blue-300 border-blue-700';
      case 'Technique': return 'bg-purple-900/50 text-purple-300 border-purple-700';
      case 'Organisationnel': return 'bg-amber-900/50 text-amber-300 border-amber-700';
      case 'Naturel': return 'bg-green-900/50 text-green-300 border-green-700';
      case 'Externe': return 'bg-red-900/50 text-red-300 border-red-700';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const getCategorieColor = (categorie: string) => {
    switch (categorie) {
      case 'Confidentialité': return 'bg-indigo-900/50 text-indigo-300 border-indigo-700';
      case 'Intégrité': return 'bg-emerald-900/50 text-emerald-300 border-emerald-700';
      case 'Disponibilité': return 'bg-rose-900/50 text-rose-300 border-rose-700';
      case 'Traçabilité': return 'bg-cyan-900/50 text-cyan-300 border-cyan-700';
      case 'Conformité': return 'bg-violet-900/50 text-violet-300 border-violet-700';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const getPertinenceColor = (pertinence: number) => {
    if (pertinence <= 2) return 'bg-green-900/50 text-green-300 border-green-700';
    if (pertinence <= 3) return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
    return 'bg-red-900/50 text-red-300 border-red-700';
  };

  // Filtrer les sources
  const sourcesFiltrees = localData.sourcesRisque.filter(source => {
    if (filtreType !== 'Tous' && source.type !== filtreType) return false;
    if (filtrePertinence > 0 && source.pertinence < filtrePertinence) return false;
    return true;
  });

  // Obtenir le nom d'un objectif par son ID
  const getObjectifName = (id: string) => {
    const obj = localData.objectifsVises.find(o => o.id === id);
    return obj ? obj.nom : 'Objectif inconnu';
  };

  // Obtenir le nom d'une source par son ID
  const getSourceName = (id: string) => {
    const src = localData.sourcesRisque.find(s => s.id === id);
    return src ? src.nom : 'Source inconnue';
  };

  // Calculer la pertinence moyenne
  const pertinenceMoyenne = localData.couplesSROV.length > 0
    ? localData.couplesSROV.reduce((sum, couple) => sum + couple.pertinence, 0) / localData.couplesSROV.length
    : 0;

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-orange-900/20 to-amber-900/20 border border-orange-700 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-8 h-8 text-orange-400" />
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Atelier 2 - Sources de Risque et Objectifs Visés</h2>
            <p className="text-slate-300">Identifier et caractériser les sources de risque (SR) et leurs objectifs de haut niveau (OV)</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-orange-400" />
            <span><strong className="text-slate-100">Objectif :</strong> Identifier et caractériser SR/OV</span>
          </div>
          <div className="flex items-center">
            <LinkIcon className="w-4 h-4 mr-2 text-orange-400" />
            <span><strong className="text-slate-100">Résultat :</strong> Cartographie des sources de risque</span>
          </div>
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2 text-orange-400" />
            <span><strong className="text-slate-100">Critère :</strong> Sélection des couples SR/OV les plus pertinents</span>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="ebios-card">
        <div className="flex space-x-4 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('sources')}
            className={`pb-3 px-4 border-b-2 transition-all ${
              activeTab === 'sources'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Sources de Risque ({localData.sourcesRisque.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('objectifs')}
            className={`pb-3 px-4 border-b-2 transition-all ${
              activeTab === 'objectifs'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Objectifs Visés ({localData.objectifsVises.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('couples')}
            className={`pb-3 px-4 border-b-2 transition-all ${
              activeTab === 'couples'
                ? 'border-green-500 text-green-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <LinkIcon className="w-4 h-4" />
              <span>Associations SR/OV ({localData.couplesSROV.length})</span>
            </div>
          </button>
        </div>

        {/* Contenu de l'onglet actif */}
        {activeTab === 'sources' && (
          <>
            {/* Filtres */}
            <div className="mb-6 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Filtrer par type</label>
                  <select
                    value={filtreType}
                    onChange={(e) => setFiltreType(e.target.value)}
                    className="input-ebios-dark"
                  >
                    <option value="Tous">Tous les types</option>
                    <option value="Humain">Humain</option>
                    <option value="Technique">Technique</option>
                    <option value="Organisationnel">Organisationnel</option>
                    <option value="Naturel">Naturel</option>
                    <option value="Externe">Externe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Filtrer par pertinence min</label>
                  <select
                    value={filtrePertinence}
                    onChange={(e) => setFiltrePertinence(Number(e.target.value))}
                    className="input-ebios-dark"
                  >
                    <option value={0}>Toutes</option>
                    <option value={3}>3+ (Élevée)</option>
                    <option value={4}>4+ (Critique)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Formulaire d'ajout de source */}
            <div className="mb-6 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h4 className="font-medium text-slate-100 mb-3 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une source de risque
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Nom de la source *</label>
                  <input
                    type="text"
                    value={nouvelleSource.nom}
                    onChange={(e) => setNouvelleSource(prev => ({ ...prev, nom: e.target.value }))}
                    placeholder="Ex: Cybercriminel organisé"
                    className="input-ebios-dark"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Type</label>
                  <select
                    value={nouvelleSource.type}
                    onChange={(e) => setNouvelleSource(prev => ({ 
                      ...prev, 
                      type: e.target.value as any 
                    }))}
                    className="input-ebios-dark"
                  >
                    <option value="Humain">Humain</option>
                    <option value="Technique">Technique</option>
                    <option value="Organisationnel">Organisationnel</option>
                    <option value="Naturel">Naturel</option>
                    <option value="Externe">Externe</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-200 mb-1">Description</label>
                <textarea
                  value={nouvelleSource.description}
                  onChange={(e) => setNouvelleSource(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrire la source de risque"
                  className="input-ebios-dark"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Motivation principale</label>
                  <select
                    value={nouvelleSource.motivation}
                    onChange={(e) => setNouvelleSource(prev => ({ ...prev, motivation: e.target.value }))}
                    className="input-ebios-dark"
                  >
                    <option value="">Sélectionner une motivation</option>
                    {motivationsTypes.map(motivation => (
                      <option key={motivation} value={motivation}>{motivation}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Pertinence (1-5)</label>
                  <select
                    value={nouvelleSource.pertinence}
                    onChange={(e) => setNouvelleSource(prev => ({ ...prev, pertinence: Number(e.target.value) }))}
                    className="input-ebios-dark"
                  >
                    <option value={1}>1 - Très faible</option>
                    <option value={2}>2 - Faible</option>
                    <option value={3}>3 - Moyenne</option>
                    <option value={4}>4 - Élevée</option>
                    <option value={5}>5 - Très élevée</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-200 mb-1">Capacités</label>
                <div className="flex flex-wrap gap-2">
                  {capacitesTypes.map((capacite) => (
                    <button
                      key={capacite}
                      type="button"
                      onClick={() => toggleCapacite(capacite)}
                      className={`px-3 py-1 rounded-full text-sm border transition-all ${
                        nouvelleSource.capacites.includes(capacite)
                          ? 'bg-blue-900/50 text-blue-300 border-blue-600'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {capacite}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-200 mb-1">Justification de la pertinence</label>
                <textarea
                  value={nouvelleSource.justification}
                  onChange={(e) => setNouvelleSource(prev => ({ ...prev, justification: e.target.value }))}
                  placeholder="Pourquoi cette source est-elle pertinente dans votre contexte ?"
                  className="input-ebios-dark"
                  rows={2}
                />
              </div>

              <button
                onClick={handleAddSource}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter source de risque
              </button>
            </div>

            {/* Liste des sources */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-100">
                Sources identifiées ({sourcesFiltrees.length})
              </h4>
              
              {sourcesFiltrees.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p>Aucune source de risque identifiée. Ajoutez-en ci-dessus.</p>
                </div>
              ) : (
                sourcesFiltrees.map((source) => (
                  <div key={source.id} className="ebios-card">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(source.type)}
                        <h5 className="font-medium text-slate-100">{source.nom}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(source.type)}`}>
                          {source.type}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPertinenceColor(source.pertinence)}`}>
                          Pertinence: {source.pertinence}/5
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveSource(source.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-3">{source.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="text-slate-300">
                        <span className="font-medium text-slate-200">Motivation :</span> {source.motivation}
                      </div>
                      <div className="text-slate-300">
                        <span className="font-medium text-slate-200">Capacités :</span> {source.capacites.join(', ')}
                      </div>
                      {source.historique && (
                        <div className="col-span-2 text-slate-300">
                          <span className="font-medium text-slate-200">Historique :</span> {source.historique}
                        </div>
                      )}
                      {source.justification && (
                        <div className="col-span-2 text-slate-300">
                          <span className="font-medium text-slate-200">Justification :</span> {source.justification}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'objectifs' && (
          <>
            <div className="mb-6">
              <h4 className="font-medium text-slate-100 mb-3">Objectifs standards</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {localData.objectifsVises.map((objectif) => (
                  <div key={objectif.id} className="ebios-card">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-slate-100">{objectif.nom}</h5>
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategorieColor(objectif.categorie)}`}>
                        {objectif.categorie}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{objectif.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ajouter un objectif */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h4 className="font-medium text-slate-100 mb-3">Ajouter un objectif visé</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  value={nouvelObjectif.nom}
                  onChange={(e) => setNouvelObjectif(prev => ({ ...prev, nom: e.target.value }))}
                  placeholder="Nom de l'objectif"
                  className="input-ebios-dark"
                />
                <input
                  type="text"
                  value={nouvelObjectif.description}
                  onChange={(e) => setNouvelObjectif(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                  className="input-ebios-dark"
                />
                <select
                  value={nouvelObjectif.categorie}
                  onChange={(e) => setNouvelObjectif(prev => ({ 
                    ...prev, 
                    categorie: e.target.value as any 
                  }))}
                  className="input-ebios-dark"
                >
                  <option value="Confidentialité">Confidentialité</option>
                  <option value="Intégrité">Intégrité</option>
                  <option value="Disponibilité">Disponibilité</option>
                  <option value="Traçabilité">Traçabilité</option>
                  <option value="Conformité">Conformité</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <button
                onClick={handleAddObjectif}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter objectif
              </button>
            </div>
          </>
        )}

        {activeTab === 'couples' && (
          <>
            <div className="mb-6 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h4 className="font-medium text-slate-100 mb-3">Associer une source à un objectif</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <select
                  value={nouveauCouple.sourceRisqueId}
                  onChange={(e) => setNouveauCouple(prev => ({ ...prev, sourceRisqueId: e.target.value }))}
                  className="input-ebios-dark"
                >
                  <option value="">Sélectionner une source</option>
                  {localData.sourcesRisque.map((source) => (
                    <option key={source.id} value={source.id}>{source.nom}</option>
                  ))}
                </select>
                
                <select
                  value={nouveauCouple.objectifViseId}
                  onChange={(e) => setNouveauCouple(prev => ({ ...prev, objectifViseId: e.target.value }))}
                  className="input-ebios-dark"
                >
                  <option value="">Sélectionner un objectif</option>
                  {localData.objectifsVises.map((objectif) => (
                    <option key={objectif.id} value={objectif.id}>{objectif.nom}</option>
                  ))}
                </select>
                
                <select
                  value={nouveauCouple.pertinence}
                  onChange={(e) => setNouveauCouple(prev => ({ ...prev, pertinence: Number(e.target.value) }))}
                  className="input-ebios-dark"
                >
                  <option value={1}>1 - Très faible</option>
                  <option value={2}>2 - Faible</option>
                  <option value={3}>3 - Moyenne</option>
                  <option value={4}>4 - Élevée</option>
                  <option value={5}>5 - Très élevée</option>
                </select>
              </div>
              
              <div className="mb-3">
                <input
                  type="text"
                  value={nouveauCouple.commentaire}
                  onChange={(e) => setNouveauCouple(prev => ({ ...prev, commentaire: e.target.value }))}
                  placeholder="Commentaire sur cette association"
                  className="input-ebios-dark"
                />
              </div>
              
              <button
                onClick={handleAddCouple}
                className="btn-primary bg-green-600 hover:bg-green-700"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Créer l'association
              </button>
            </div>

            {/* Liste des couples */}
            <div className="space-y-3">
              <h4 className="font-medium text-slate-100">
                Associations créées ({localData.couplesSROV.length})
              </h4>
              
              {localData.couplesSROV.length === 0 ? (
                <div className="text-center py-4 text-slate-500">
                  <LinkIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p>Aucune association SR/OV créée.</p>
                </div>
              ) : (
                localData.couplesSROV.map((couple) => (
                  <div key={couple.id} className="ebios-card">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-slate-300">
                          <span className="font-medium text-slate-200">Source :</span> {getSourceName(couple.sourceRisqueId)}
                        </div>
                        <LinkIcon className="w-4 h-4 text-slate-500" />
                        <div className="text-sm text-slate-300">
                          <span className="font-medium text-slate-200">Objectif :</span> {getObjectifName(couple.objectifViseId)}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPertinenceColor(couple.pertinence)}`}>
                          Pertinence: {couple.pertinence}/5
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveCouple(couple.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {couple.commentaire && (
                      <p className="text-sm text-slate-400 mt-2">{couple.commentaire}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Section 4 : Cartographie et synthèse */}
      <div className="ebios-card">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
          4. Cartographie et Synthèse
        </h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Description de la cartographie des sources de risque
          </label>
          <textarea
            value={localData.cartographie}
            onChange={(e) => handleLocalUpdate({ cartographie: e.target.value })}
            placeholder="Décrire la cartographie obtenue, les sources les plus préoccupantes, les objectifs les plus visés..."
            className="input-ebios-dark h-40"
          />
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700">
            <div className="text-2xl font-bold text-blue-400">{localData.sourcesRisque.length}</div>
            <div className="text-sm text-blue-300">Sources identifiées</div>
          </div>
          <div className="bg-green-900/20 p-4 rounded-lg border border-green-700">
            <div className="text-2xl font-bold text-green-400">{localData.couplesSROV.length}</div>
            <div className="text-sm text-green-300">Associations SR/OV</div>
          </div>
          <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-700">
            <div className="text-2xl font-bold text-amber-400">{pertinenceMoyenne.toFixed(1)}</div>
            <div className="text-sm text-amber-300">Pertinence moyenne</div>
          </div>
          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-700">
            <div className="text-2xl font-bold text-purple-400">
              {localData.sourcesRisque.filter(s => s.pertinence >= 4).length}
            </div>
            <div className="text-sm text-purple-300">Sources critiques (4+)</div>
          </div>
        </div>

        {/* Recommandations */}
        <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <h4 className="font-medium text-yellow-300 mb-2 flex items-center">
            <Star className="w-4 h-4 mr-2" />
            Recommandations pour l'atelier suivant
          </h4>
          <ul className="text-sm text-yellow-300 space-y-1">
            <li>• Sélectionnez les 3-5 couples SR/OV les plus pertinents pour l'atelier 3</li>
            <li>• Privilégiez les sources avec pertinence ≥ 4 et les objectifs liés aux valeurs métier critiques</li>
            <li>• Notez les sources nécessitant une analyse plus approfondie</li>
            <li>• Validez la pertinence des associations avec les parties prenantes</li>
          </ul>
        </div>
      </div>

      {/* Bandeau d'action */}
      <div className="bg-gradient-to-r from-orange-900/30 to-amber-900/30 border border-orange-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Prêt pour l'atelier suivant ?</h3>
            <p className="text-slate-300 text-sm">
              Vous avez identifié {localData.sourcesRisque.length} sources et {localData.couplesSROV.length} associations.
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
            <button className="btn-primary flex items-center space-x-2 bg-orange-600 hover:bg-orange-700">
              <Upload className="w-4 h-4" />
              <span>Valider et continuer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Atelier2;