// src/components/Analysis/Atelier1.tsx
// src/components/Analysis/Atelier1.tsx
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Target, 
  Shield, 
  ListChecks, 
  BarChart3, 
  Lightbulb, 
  Plus, 
  Trash2, 
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { type Analysis } from '../../types/data';
import { 
  toutesExigences, 
  getExigencesByStandard, 
  exemplesParContexte 
} from '../../data/standardsData';

interface Atelier1Props {
  analysisData: Analysis;
  updateAnalysisData: (updates: Partial<Analysis>) => void;
}

const Atelier1: React.FC<Atelier1Props> = ({ analysisData, updateAnalysisData }) => {
  // Initialisation des données
  const config = analysisData.workshop1?.config || {
    contexte: 'Banque & Finance',
    typeAnalyse: 'Nouveau projet',
    standard: 'ISO 27001:2022',
    exigencesSelectionnees: [],
    analyseSWOT: { forces: [], faiblesses: [], opportunites: [], menaces: [] },
    missions: [],
    valeursMetier: [],
    perimetreEtude: '',
    evenementsRedoutes: '',
    socleSecurite: '',
    ecarts: ''
  };

  const [localConfig, setLocalConfig] = useState(config);
  const [newMission, setNewMission] = useState({ description: '', responsable: '' });
  const [newValeur, setNewValeur] = useState({ 
    nom: '', 
    description: '', 
    criticite: 'Moyenne' as const,
    type: 'Information' as const 
  });
  const [swotInputs, setSwotInputs] = useState({
    forces: '',
    faiblesses: '',
    opportunites: '',
    menaces: ''
  });

  // Suggestions de titre par type d'analyse
  const titreSuggestions = {
    'Nouveau projet': 'Analyse sécurité projet [Nom du Projet]',
    'Changement majeur': 'Réévaluation risques modification [Système/Processus]',
    'Revue annuelle': 'Revue annuelle sécurité [Année] - [Organisation]',
    'Analyse générale IT': 'Audit sécurité IT global [Organisation]'
  };

  // Fonction simple de notification
  const addNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    console.log(`[${type}] ${message}`);
    alert(message);
  };

  // Gérer les changements de configuration
  const handleConfigChange = (updates: Partial<typeof localConfig>) => {
    setLocalConfig(prev => ({ ...prev, ...updates }));
  };

  // Synchronisation avec AnalysisTab
  useEffect(() => {
    if (analysisData.workshop1.config.contexte !== localConfig.contexte) {
      console.log('Synchronisation contexte:', analysisData.workshop1.config.contexte);
      handleConfigChange({ 
        contexte: analysisData.workshop1.config.contexte as any,
        contextePersonnalise: analysisData.workshop1.config.contexte === 'Autre' ? 
          analysisData.workshop1.config.contextePersonnalise : undefined
      });
    }
  }, [analysisData.workshop1.config.contexte]);

  // Mettre à jour les données parentes
  useEffect(() => {
    // Éviter la boucle infinie : seulement si config a vraiment changé
    const currentConfigStr = JSON.stringify(analysisData.workshop1.config);
    const newConfigStr = JSON.stringify(localConfig);
    
    if (currentConfigStr !== newConfigStr) {
      updateAnalysisData({
        workshop1: {
          config: localConfig,
          missions: '',
          studyScope: '',
          businessValues: []
        }
      });
    }
  }, [localConfig]);

  // Contextes professionnels
  const contextesProfessionnels = [
    { value: 'Banque & Finance', icon: '🏦', description: 'Bancaire, assurances, fintech' },
    { value: 'Santé & Médical', icon: '🏥', description: 'Hôpitaux, cliniques, laboratoires' },
    { value: 'Énergie & Utilities', icon: '⚡', description: 'Électricité, gaz, eau, énergies' },
    { value: 'Transport & Logistique', icon: '🚚', description: 'Transport, logistique, supply chain' },
    { value: 'Industrie & Manufacturing', icon: '🏭', description: 'Industrie, production, manufacturing' },
    { value: 'Public & Administration', icon: '🏛️', description: 'Administration, services publics' },
    { value: 'IT & Technologie', icon: '💻', description: 'Tech, SaaS, éditeurs logiciels' },
    { value: 'Autre', icon: '🔧', description: 'Contexte personnalisé' }
  ];

  // Types d'analyse
  const typesAnalyse = [
    { value: 'Nouveau projet', description: 'Analyse pour un nouveau projet ou système' },
    { value: 'Changement majeur', description: 'Modification significative d\'un système existant' },
    { value: 'Revue annuelle', description: 'Révision périodique de l\'analyse des risques' },
    { value: 'Analyse générale IT', description: 'Évaluation générale du paysage de risques IT' }
  ];

  // Standards de sécurité
  const standards = [
    { value: 'ISO 27001:2022', description: 'Système de management de la sécurité de l\'information' },
    { value: 'ISO 27002', description: 'Bonnes pratiques pour les contrôles de sécurité' },
    { value: 'ISO 27005', description: 'Gestion des risques en sécurité de l\'information' },
    { value: 'NIST CSF', description: 'Framework de cybersécurité NIST' },
    { value: 'NIST SP 800-53', description: 'Contrôles de sécurité et de confidentialité' },
    { value: 'RGPD', description: 'Règlement général sur la protection des données' },
    { value: 'LPM', description: 'Loi de programmation militaire (France)' },
    { value: 'Autre', description: 'Standard personnalisé' }
  ];

  // Exigences disponibles pour le standard sélectionné
  const exigencesDisponibles = getExigencesByStandard(localConfig.standard);

  // Fonction IA simplifiée
  const handleGenerateAI = () => {
    addNotification('Génération IA - Version démo', 'info');

    const exemples = exemplesParContexte[localConfig.contexte] || exemplesParContexte['Banque & Finance'];
    
    const nouvellesMissions = exemples.missions.map((desc, index) => ({
      id: `ex_mission_${Date.now()}_${index}`,
      description: desc,
      responsable: 'À définir'
    }));

    const nouvellesValeurs = exemples.valeurs.map((nom, index) => ({
      id: `ex_valeur_${Date.now()}_${index}`,
      nom,
      description: `Valeur métier critique pour ${localConfig.contexte}`,
      criticite: (index === 0 ? 'Critique' : 'Élevée') as 'Critique' | 'Élevée' | 'Moyenne' | 'Faible',
      type: 'Information' as const
    }));

    handleConfigChange({
      missions: [...localConfig.missions, ...nouvellesMissions],
      valeursMetier: [...localConfig.valeursMetier, ...nouvellesValeurs]
    });

    addNotification('Exemples générés avec IA', 'success');
  };

  // Gérer les exigences
  const toggleExigence = (exigenceId: string) => {
    const nouvellesExigences = localConfig.exigencesSelectionnees.includes(exigenceId)
      ? localConfig.exigencesSelectionnees.filter(id => id !== exigenceId)
      : [...localConfig.exigencesSelectionnees, exigenceId];
    
    handleConfigChange({ exigencesSelectionnees: nouvellesExigences });
  };

  // Gérer SWOT
  const handleAddSWOT = (categorie: keyof typeof localConfig.analyseSWOT, valeur: string) => {
    if (!valeur.trim()) return;
    
    const nouvelleAnalyseSWOT = {
      ...localConfig.analyseSWOT,
      [categorie]: [...localConfig.analyseSWOT[categorie], valeur.trim()]
    };
    
    handleConfigChange({ analyseSWOT: nouvelleAnalyseSWOT });
    setSwotInputs(prev => ({ ...prev, [categorie]: '' }));
  };

  const handleRemoveSWOT = (categorie: keyof typeof localConfig.analyseSWOT, index: number) => {
    const nouvelleAnalyseSWOT = {
      ...localConfig.analyseSWOT,
      [categorie]: localConfig.analyseSWOT[categorie].filter((_, i) => i !== index)
    };
    
    handleConfigChange({ analyseSWOT: nouvelleAnalyseSWOT });
  };

  // Gérer missions
  const handleAddMission = () => {
    if (!newMission.description.trim()) return;
    
    const nouvelleMission = {
      id: `mission_${Date.now()}`,
      description: newMission.description.trim(),
      responsable: newMission.responsable.trim()
    };
    
    handleConfigChange({
      missions: [...localConfig.missions, nouvelleMission]
    });
    
    setNewMission({ description: '', responsable: '' });
  };

  const handleRemoveMission = (index: number) => {
    handleConfigChange({
      missions: localConfig.missions.filter((_, i) => i !== index)
    });
  };

  // Gérer valeurs métier
  const handleAddValeurMetier = () => {
    if (!newValeur.nom.trim()) return;
    
    const nouvelleValeur = {
      id: `valeur_${Date.now()}`,
      ...newValeur
    };
    
    handleConfigChange({
      valeursMetier: [...localConfig.valeursMetier, nouvelleValeur]
    });
    
    setNewValeur({ 
      nom: '', 
      description: '', 
      criticite: 'Moyenne',
      type: 'Information'
    });
  };

  const handleRemoveValeurMetier = (index: number) => {
    handleConfigChange({
      valeursMetier: localConfig.valeursMetier.filter((_, i) => i !== index)
    });
  };

  // Obtenir la couleur de criticité
  const getCriticiteColor = (criticite: string) => {
    switch (criticite) {
      case 'Critique': return 'badge-critical-dark';
      case 'Élevée': return 'badge-high-dark';
      case 'Moyenne': return 'badge-medium-dark';
      case 'Faible': return 'badge-low-dark';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  // Obtenir la couleur de type
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Information': return 'bg-blue-900/50 text-blue-200 border-blue-700';
      case 'Processus': return 'bg-purple-900/50 text-purple-200 border-purple-700';
      case 'Service': return 'bg-indigo-900/50 text-indigo-200 border-indigo-700';
      case 'Infrastructure': return 'bg-cyan-900/50 text-cyan-200 border-cyan-700';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* En-tête avec bouton IA */}
      <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Atelier 1 - Cadrage et Socle de Sécurité</h2>
              <p className="text-slate-300">Définir l'objet de l'étude, le contexte et établir le socle de sécurité</p>
            </div>
          </div>
          <button
            onClick={handleGenerateAI}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Générer avec IA</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-2 text-blue-400" />
            <span><strong className="text-slate-100">Objectif :</strong> Identifier l'objet d'étude et le cadre d'analyse</span>
          </div>
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2 text-green-400" />
            <span><strong className="text-slate-100">Approche :</strong> Conformité et perspective défensive</span>
          </div>
        </div>
      </div>

      {/* Section 1 : Type d'analyse et titre */}
      <div className="ebios-card">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
          <ListChecks className="w-5 h-5 mr-2 text-blue-400" />
          1. Type d'analyse et Titre
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Type d'analyse */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Type d'analyse *
            </label>
            <div className="space-y-2">
              {typesAnalyse.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleConfigChange({ typeAnalyse: type.value as any })}
                  className={`selection-card w-full text-left ${
                    localConfig.typeAnalyse === type.value
                      ? 'border-green-500 bg-green-900/30'
                      : ''
                  }`}
                >
                  <div className="font-medium text-slate-100">{type.value}</div>
                  <div className="text-sm text-slate-400 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Titre de l'analyse */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Titre de l'analyse *
            </label>
            <input
              type="text"
              value={analysisData.title}
              onChange={(e) => updateAnalysisData({ title: e.target.value })}
              className="input-ebios-dark w-full"
              placeholder={titreSuggestions[localConfig.typeAnalyse] || "Ex: Analyse sécurité système"}
            />
            <p className="text-xs text-slate-400 mt-2">
              Suggestion basée sur le type d'analyse : {titreSuggestions[localConfig.typeAnalyse]}
            </p>
          </div>
        </div>
      </div>

      {/* Section 2 : Contexte professionnel */}
      <div className="ebios-card">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-blue-400" />
          2. Contexte professionnel
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Contexte professionnel *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {contextesProfessionnels.map((ctx) => (
              <button
                key={ctx.value}
                type="button"
                onClick={() => handleConfigChange({ 
                  contexte: ctx.value as any,
                  contextePersonnalise: ctx.value === 'Autre' ? '' : undefined
                })}
                className={`selection-card text-left ${
                  localConfig.contexte === ctx.value
                    ? 'selection-card-selected'
                    : ''
                }`}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-2">{ctx.icon}</span>
                  <div>
                    <div className="font-medium text-slate-100">{ctx.value}</div>
                    <div className="text-xs text-slate-400 mt-1">{ctx.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {localConfig.contexte === 'Autre' && (
            <div className="mt-3">
              <input
                type="text"
                value={localConfig.contextePersonnalise || ''}
                onChange={(e) => handleConfigChange({ contextePersonnalise: e.target.value })}
                placeholder="Précisez votre contexte professionnel"
                className="input-ebios-dark w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Section 3 : Standard de sécurité */}
      <div className="ebios-card">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-green-400" />
          3. Socle et Standard de sécurité
        </h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Sélectionnez le standard de sécurité *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {standards.map((standard) => (
              <button
                key={standard.value}
                type="button"
                onClick={() => handleConfigChange({ 
                  standard: standard.value as any,
                  standardPersonnalise: standard.value === 'Autre' ? '' : undefined
                })}
                className={`selection-card text-center ${
                  localConfig.standard === standard.value
                    ? 'border-green-500 bg-green-900/30'
                    : ''
                }`}
              >
                <div className="font-medium text-slate-100">{standard.value}</div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-2">{standard.description}</div>
              </button>
            ))}
          </div>
          
          {localConfig.standard === 'Autre' && (
            <div className="mt-3">
              <input
                type="text"
                value={localConfig.standardPersonnalise || ''}
                onChange={(e) => handleConfigChange({ standardPersonnalise: e.target.value })}
                placeholder="Précisez votre standard de sécurité"
                className="input-ebios-dark w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}
        </div>

        {/* Exigences du standard */}
        {exigencesDisponibles.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-3">
              Sélectionnez les exigences applicables (minimum 2 recommandé)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {exigencesDisponibles.map((exigence) => (
                <div
                  key={exigence.id}
                  onClick={() => toggleExigence(exigence.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    localConfig.exigencesSelectionnees.includes(exigence.id)
                      ? 'border-blue-500 bg-blue-900/30'
                      : 'border-slate-600 hover:border-blue-400 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`w-5 h-5 rounded border mr-3 mt-0.5 flex-shrink-0 ${
                      localConfig.exigencesSelectionnees.includes(exigence.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-slate-700 border-slate-500'
                    }`}>
                      {localConfig.exigencesSelectionnees.includes(exigence.id) && (
                        <CheckCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-100">{exigence.code}</div>
                      <div className="text-xs text-slate-400 mt-1">{exigence.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-sm text-slate-400">
              {localConfig.exigencesSelectionnees.length} exigence(s) sélectionnée(s)
            </div>
          </div>
        )}
      </div>

      {/* Ancienne Section 6 : Socle de sécurité et écarts - VERSION AMÉLIORÉE */}
      <div className="ebios-card">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Socle de sécurité défini *
            </label>
            <textarea
              value={localConfig.socleSecurite}
              onChange={(e) => handleConfigChange({ socleSecurite: e.target.value })}
              placeholder="Décrire le socle de sécurité existant ou à mettre en place..."
              className="input-ebios-dark w-full h-40 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Écarts identifiés *
            </label>
            <textarea
              value={localConfig.ecarts}
              onChange={(e) => handleConfigChange({ ecarts: e.target.value })}
              placeholder="Identifier les écarts entre l'existant et les exigences du standard sélectionné..."
              className="input-ebios-dark w-full h-40 px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Section 4 : Analyse SWOT */}
      <div className="ebios-card">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
          4. Analyse SWOT préliminaire
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Forces et Faiblesses */}
          <div className="space-y-4">
            <div className="swot-forces-dark rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Forces (Internes)
              </h4>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={swotInputs.forces}
                  onChange={(e) => setSwotInputs(prev => ({ ...prev, forces: e.target.value }))}
                  placeholder="Ex: Équipe expérimentée, budget dédié..."
                  className="input-ebios-dark flex-1 px-3 py-2 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSWOT('forces', swotInputs.forces)}
                />
                <button
                  onClick={() => handleAddSWOT('forces', swotInputs.forces)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-r-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {localConfig.analyseSWOT.forces.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-800/50 p-2 rounded border border-green-800">
                    <span className="text-sm">{item}</span>
                    <button
                      onClick={() => handleRemoveSWOT('forces', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="swot-faiblesses-dark rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <XCircle className="w-4 h-4 mr-2" />
                Faiblesses (Internes)
              </h4>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={swotInputs.faiblesses}
                  onChange={(e) => setSwotInputs(prev => ({ ...prev, faiblesses: e.target.value }))}
                  placeholder="Ex: Manque de documentation, legacy..."
                  className="input-ebios-dark flex-1 px-3 py-2 rounded-l-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSWOT('faiblesses', swotInputs.faiblesses)}
                />
                <button
                  onClick={() => handleAddSWOT('faiblesses', swotInputs.faiblesses)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-r-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {localConfig.analyseSWOT.faiblesses.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-800/50 p-2 rounded border border-red-800">
                    <span className="text-sm">{item}</span>
                    <button
                      onClick={() => handleRemoveSWOT('faiblesses', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Opportunités et Menaces */}
          <div className="space-y-4">
            <div className="swot-opportunites-dark rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Opportunités (Externes)
              </h4>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={swotInputs.opportunites}
                  onChange={(e) => setSwotInputs(prev => ({ ...prev, opportunites: e.target.value }))}
                  placeholder="Ex: Nouvelle technologie, partenariat..."
                  className="input-ebios-dark flex-1 px-3 py-2 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSWOT('opportunites', swotInputs.opportunites)}
                />
                <button
                  onClick={() => handleAddSWOT('opportunites', swotInputs.opportunites)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {localConfig.analyseSWOT.opportunites.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-800/50 p-2 rounded border border-blue-800">
                    <span className="text-sm">{item}</span>
                    <button
                      onClick={() => handleRemoveSWOT('opportunites', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="swot-menaces-dark rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Menaces (Externes)
              </h4>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={swotInputs.menaces}
                  onChange={(e) => setSwotInputs(prev => ({ ...prev, menaces: e.target.value }))}
                  placeholder="Ex: Concurrence, évolution réglementaire..."
                  className="input-ebios-dark flex-1 px-3 py-2 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSWOT('menaces', swotInputs.menaces)}
                />
                <button
                  onClick={() => handleAddSWOT('menaces', swotInputs.menaces)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-r-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {localConfig.analyseSWOT.menaces.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-800/50 p-2 rounded border border-orange-800">
                    <span className="text-sm">{item}</span>
                    <button
                      onClick={() => handleRemoveSWOT('menaces', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5 : Missions et Valeurs métier */}
      <div className="ebios-card">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-indigo-400" />
          5. Missions et Valeurs métier
        </h3>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-slate-100">Missions de l'organisation</h4>
            <button
              onClick={() => {
                const exemples = exemplesParContexte[localConfig.contexte] || exemplesParContexte['Banque & Finance'];
                const nouvellesMissions = exemples.missions.map((desc, index) => ({
                  id: `ex_mission_${Date.now()}_${index}`,
                  description: desc,
                  responsable: 'À définir'
                }));
                handleConfigChange({
                  missions: [...localConfig.missions, ...nouvellesMissions]
                });
                addNotification('Exemples de missions chargés', 'info');
              }}
              className="text-sm bg-indigo-900/50 hover:bg-indigo-800/50 text-indigo-300 px-3 py-1 rounded-lg flex items-center border border-indigo-700"
            >
              <Lightbulb className="w-3 h-3 mr-1" />
              Charger des exemples
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <input
              type="text"
              value={newMission.description}
              onChange={(e) => setNewMission(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la mission"
              className="input-ebios-dark px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              value={newMission.responsable}
              onChange={(e) => setNewMission(prev => ({ ...prev, responsable: e.target.value }))}
              placeholder="Responsable"
              className="input-ebios-dark px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            onClick={handleAddMission}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter mission
          </button>
          
          <div className="mt-4 space-y-2">
            {localConfig.missions.map((mission, index) => (
              <div key={mission.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <div>
                  <div className="font-medium text-slate-100">{mission.description}</div>
                  <div className="text-sm text-slate-400">Responsable: {mission.responsable}</div>
                </div>
                <button
                  onClick={() => handleRemoveMission(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Valeurs métier */}
        <div>
          <h4 className="font-medium text-slate-100 mb-4">Valeurs métier critiques</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <input
              type="text"
              value={newValeur.nom}
              onChange={(e) => setNewValeur(prev => ({ ...prev, nom: e.target.value }))}
              placeholder="Nom de la valeur"
              className="input-ebios-dark px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              value={newValeur.description}
              onChange={(e) => setNewValeur(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
              className="input-ebios-dark px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <select
              value={newValeur.criticite}
              onChange={(e) => setNewValeur(prev => ({ ...prev, criticite: e.target.value as any }))}
              className="input-ebios-dark px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Faible">Faible</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Élevée">Élevée</option>
              <option value="Critique">Critique</option>
            </select>
            <select
              value={newValeur.type}
              onChange={(e) => setNewValeur(prev => ({ ...prev, type: e.target.value as any }))}
              className="input-ebios-dark px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Information">Information</option>
              <option value="Processus">Processus</option>
              <option value="Service">Service</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>
          
          <button
            onClick={handleAddValeurMetier}
            className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter valeur métier
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {localConfig.valeursMetier.map((valeur, index) => (
              <div key={valeur.id} className="ebios-card">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-slate-100">{valeur.nom}</h5>
                  <button
                    onClick={() => handleRemoveValeurMetier(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-300 mb-3">{valeur.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getCriticiteColor(valeur.criticite)}`}>
                    {valeur.criticite}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(valeur.type)}`}>
                    {valeur.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 6 : Périmètre et événements redoutés - VERSION AMÉLIORÉE */}
      <div className="ebios-card">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
          <ListChecks className="w-5 h-5 mr-2 text-slate-400" />
          6. Périmètre et Événements redoutés
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Périmètre de l'étude *
            </label>
            <textarea
              value={localConfig.perimetreEtude}
              onChange={(e) => handleConfigChange({ perimetreEtude: e.target.value })}
              placeholder="Définir précisément le périmètre de l'analyse : systèmes inclus, exclus, durée, ressources..."
              className="input-ebios-dark w-full h-40 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Événements redoutés principaux *
            </label>
            <textarea
              value={localConfig.evenementsRedoutes}
              onChange={(e) => handleConfigChange({ evenementsRedoutes: e.target.value })}
              placeholder="Décrire les événements redoutés associés aux valeurs métier identifiées..."
              className="input-ebios-dark w-full h-40 px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      

      {/* Résumé - VERSION AMÉLIORÉE */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-200 mb-4">Résumé de l'Atelier 1</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="text-sm text-slate-400">Contexte</div>
            <div className="font-medium text-slate-100">{localConfig.contexte}</div>
            {localConfig.contextePersonnalise && (
              <div className="text-xs text-slate-500">{localConfig.contextePersonnalise}</div>
            )}
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="text-sm text-slate-400">Standard</div>
            <div className="font-medium text-slate-100">{localConfig.standard}</div>
            <div className="text-xs text-slate-500">{localConfig.exigencesSelectionnees.length} exigence(s)</div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="text-sm text-slate-400">Éléments identifiés</div>
            <div className="font-medium text-slate-100">{localConfig.missions.length} mission(s)</div>
            <div className="text-xs text-slate-500">{localConfig.valeursMetier.length} valeur(s) métier</div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="text-sm text-slate-400">Analyse SWOT</div>
            <div className="font-medium text-slate-100">
              {Object.values(localConfig.analyseSWOT).reduce((sum, arr) => sum + arr.length, 0)} éléments
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Atelier1;