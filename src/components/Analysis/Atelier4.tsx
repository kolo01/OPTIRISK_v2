// src/components/Analysis/Atelier4.tsx
import React, { useState } from 'react';
import { 
  Lightbulb, 
  Plus, 
  Trash2, 
  Server, 
  AlertTriangle, 
  Cpu,
  Database,
  Globe,
  Shield,
  Target,
  BarChart3,
  Zap,
  Link,
  Filter
} from 'lucide-react';
import { type Analysis, type SupportingAsset } from '../../types/data';

interface Atelier4Props {
  analysisData: Analysis;
  updateAnalysisData: (updates: Partial<Analysis>) => void;
}

const Atelier4: React.FC<Atelier4Props> = ({ analysisData, updateAnalysisData }) => {
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: 'serveur' as 'serveur' | 'application' | 'equipement' | 'reseau' | 'donnee' | 'autre',
    description: '',
    location: '',
    criticality: 'Moyenne' as 'Faible' | 'Moyenne' | 'Élevée' | 'Critique'
  });

  const [newOperationalScenario, setNewOperationalScenario] = useState({
    title: '',
    linkedStrategicScenario: '',
    operatingMode: '',
    likelihood: 'Moyenne' as 'Très faible' | 'Faible' | 'Moyenne' | 'Élevée' | 'Très élevée',
    supportingAssets: [] as string[]
  });

  const [activeTab, setActiveTab] = useState<'assets' | 'scenarios' | 'matrix'>('assets');

  // Fonction simple de notification
  const addNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    console.log(`[${type}] ${message}`);
    alert(message);
  };

  // Types d'actifs
  const assetTypes = [
    { value: 'serveur', label: 'Serveur', icon: <Server className="w-4 h-4" /> },
    { value: 'application', label: 'Application', icon: <Cpu className="w-4 h-4" /> },
    { value: 'equipement', label: 'Équipement', icon: <Globe className="w-4 h-4" /> },
    { value: 'reseau', label: 'Réseau', icon: <Globe className="w-4 h-4" /> },
    { value: 'donnee', label: 'Donnée', icon: <Database className="w-4 h-4" /> },
    { value: 'autre', label: 'Autre', icon: <Shield className="w-4 h-4" /> }
  ];

  // Niveaux de criticité
  const criticalityLevels = [
    { value: 'Faible', label: 'Faible', color: 'bg-green-900/50 text-green-300 border-green-700' },
    { value: 'Moyenne', label: 'Moyenne', color: 'bg-yellow-900/50 text-yellow-300 border-yellow-700' },
    { value: 'Élevée', label: 'Élevée', color: 'bg-orange-900/50 text-orange-300 border-orange-700' },
    { value: 'Critique', label: 'Critique', color: 'bg-red-900/50 text-red-300 border-red-700' }
  ];

  // Niveaux de vraisemblance
  const likelihoodLevels = [
    { value: 'Très faible', label: 'Très faible', color: 'bg-green-900/50 text-green-300' },
    { value: 'Faible', label: 'Faible', color: 'bg-green-800/50 text-green-200' },
    { value: 'Moyenne', label: 'Moyenne', color: 'bg-yellow-900/50 text-yellow-300' },
    { value: 'Élevée', label: 'Élevée', color: 'bg-orange-900/50 text-orange-300' },
    { value: 'Très élevée', label: 'Très élevée', color: 'bg-red-900/50 text-red-300' }
  ];

  // Fonction IA simplifiée pour les biens supports
  const handleSuggestAssets = () => {
    const contexte = analysisData.workshop1?.config.contexte || 'Banque & Finance';
    
    addNotification(`Génération IA pour contexte: ${contexte}`, 'info');

    // Exemples de biens supports selon le contexte
    const contextAssets: Record<string, Array<Partial<SupportingAsset>>> = {
      'Banque & Finance': [
        { name: 'Serveur transactionnel', type: 'serveur', description: 'Transactions bancaires', criticality: 'Critique' },
        { name: 'Application bancaire', type: 'application', description: 'Service client en ligne', criticality: 'Élevée' },
        { name: 'Routeur DMZ', type: 'reseau', description: 'Zone démilitarisée', criticality: 'Élevée' },
        { name: 'Base clients', type: 'donnee', description: 'Données clients sensibles', criticality: 'Critique' }
      ],
      'Santé & Médical': [
        { name: 'Serveur DPI', type: 'serveur', description: 'Dossiers patients informatisés', criticality: 'Critique' },
        { name: 'Logiciel imagerie', type: 'application', description: 'Analyse médicale', criticality: 'Élevée' },
        { name: 'Équipement médical', type: 'equipement', description: 'Appareils connectés', criticality: 'Élevée' },
        { name: 'Données patients', type: 'donnee', description: 'Informations médicales', criticality: 'Critique' }
      ],
      'Industrie & Manufacturing': [
        { name: 'Serveur SCADA', type: 'serveur', description: 'Supervision industrielle', criticality: 'Critique' },
        { name: 'Automate', type: 'equipement', description: 'Contrôle processus', criticality: 'Élevée' },
        { name: 'Réseau OT', type: 'reseau', description: 'Réseau opérationnel', criticality: 'Élevée' },
        { name: 'Plans techniques', type: 'donnee', description: 'Propriété intellectuelle', criticality: 'Critique' }
      ]
    };

    const defaultAssets = [
      { name: 'Serveur principal', type: 'serveur' as const, description: 'Infrastructure IT', criticality: 'Moyenne' as const },
      { name: 'Application métier', type: 'application' as const, description: 'Logiciel interne', criticality: 'Élevée' as const },
      { name: 'Firewall', type: 'reseau' as const, description: 'Pare-feu principal', criticality: 'Élevée' as const }
    ];

    const assetsToAdd = contextAssets[contexte] || defaultAssets;
    
    const newAssets = assetsToAdd.map((asset, index) => ({
      id: `sa_${Date.now()}_${index}`,
      name: asset.name || `Actif ${index + 1}`,
      type: asset.type || 'serveur',
      description: asset.description || '',
      location: '',
      criticality: asset.criticality || 'Moyenne'
    }));

    const currentAssets = analysisData.workshop4?.supportingAssets || [];
    const updatedAssets = [...currentAssets, ...newAssets];
    
    updateAnalysisData({
      workshop4: {
        supportingAssets: updatedAssets,
        operationalScenarios: analysisData.workshop4?.operationalScenarios || []
      }
    });

    addNotification(`${newAssets.length} biens supports ajoutés`, 'success');
    setActiveTab('assets');
  };

  // Fonction IA simplifiée pour les scénarios opérationnels
  const handleSuggestOperationalScenarios = () => {
    const strategicScenarios = analysisData.workshop3?.strategicScenarios || [];
    const supportingAssets = analysisData.workshop4?.supportingAssets || [];

    if (strategicScenarios.length === 0) {
      addNotification('Veuillez d\'abord définir des scénarios stratégiques', 'warning');
      return;
    }

    if (supportingAssets.length === 0) {
      addNotification('Veuillez d\'abord définir des biens supports', 'warning');
      return;
    }

    addNotification('Génération IA des scénarios opérationnels', 'info');

    // Générer des scénarios opérationnels basés sur les scénarios stratégiques
    const suggestedScenarios = strategicScenarios.map((scenario, index) => {
      const gravity = scenario.gravity || 'G2';
      const likelihood = mapGravityToLikelihood(gravity);
      const operatingMode = getOperatingMode(scenario.attackPath);
      const relevantAssets = supportingAssets
        .filter(asset => asset.criticality === 'Élevée' || asset.criticality === 'Critique')
        .slice(0, 3)
        .map(a => a.name);
      
      return {
        id: `os_${Date.now()}_${index}`,
        title: `Opération: ${scenario.title.substring(0, 30)}...`,
        linkedStrategicScenario: scenario.title,
        operatingMode: operatingMode || 'Hameçonnage → Exploitation → Persistance → Action',
        likelihood: likelihood,
        supportingAssets: relevantAssets
      };
    });

    const currentScenarios = analysisData.workshop4?.operationalScenarios || [];
    const updatedScenarios = [...currentScenarios, ...suggestedScenarios];
    
    updateAnalysisData({
      workshop4: {
        supportingAssets: analysisData.workshop4?.supportingAssets || [],
        operationalScenarios: updatedScenarios
      }
    });

    addNotification(`${suggestedScenarios.length} scénarios opérationnels ajoutés`, 'success');
    setActiveTab('scenarios');
  };

  // Mapper gravité vers vraisemblance
  const mapGravityToLikelihood = (gravity: string): 'Très faible' | 'Faible' | 'Moyenne' | 'Élevée' | 'Très élevée' => {
    switch (gravity) {
      case 'G1': return 'Faible';
      case 'G2': return 'Moyenne';
      case 'G3': return 'Moyenne';
      case 'G4': return 'Élevée';
      case 'G5': return 'Très élevée';
      default: return 'Moyenne';
    }
  };

  // Mode opératoire selon l'attaque
  const getOperatingMode = (attackPath: string) => {
    if (attackPath.includes('exfiltration')) return 'Hameçonnage → Accès initial → Mouvement latéral → Exfiltration';
    if (attackPath.includes('DDoS')) return 'Compromission botnet → Amplification → Attaque DDoS → Impact service';
    if (attackPath.includes('ransomware')) return 'Phishing → Execution malware → Chiffrement → Demande rançon';
    return 'Reconnaissance → Accès → Escalade → Action';
  };

  // Ajouter un bien support
  const handleAddAsset = () => {
    if (!newAsset.name.trim()) {
      addNotification('Veuillez renseigner le nom du bien support', 'warning');
      return;
    }

    const asset = {
      id: `sa_${Date.now()}`,
      ...newAsset
    };

    const currentAssets = analysisData.workshop4?.supportingAssets || [];
    const updatedAssets = [...currentAssets, asset];
    
    updateAnalysisData({
      workshop4: {
        supportingAssets: updatedAssets,
        operationalScenarios: analysisData.workshop4?.operationalScenarios || []
      }
    });

    setNewAsset({
      name: '',
      type: 'serveur',
      description: '',
      location: '',
      criticality: 'Moyenne'
    }); // description conservé dans le state pour la compatibilité des données existantes

    addNotification('Bien support ajouté', 'success');
  };

  // Ajouter un scénario opérationnel
  const handleAddOperationalScenario = () => {
    if (!newOperationalScenario.title.trim()) {
      addNotification('Veuillez renseigner le titre du scénario', 'warning');
      return;
    }

    const scenario = {
      id: `os_${Date.now()}`,
      ...newOperationalScenario
    };

    const currentScenarios = analysisData.workshop4?.operationalScenarios || [];
    const updatedScenarios = [...currentScenarios, scenario];
    
    updateAnalysisData({
      workshop4: {
        supportingAssets: analysisData.workshop4?.supportingAssets || [],
        operationalScenarios: updatedScenarios
      }
    });

    setNewOperationalScenario({
      title: '',
      linkedStrategicScenario: '',
      operatingMode: '',
      likelihood: 'Moyenne',
      supportingAssets: []
    });

    addNotification('Scénario opérationnel ajouté', 'success');
  };

  // Supprimer un bien support
  const handleRemoveAsset = (index: number) => {
    const currentAssets = analysisData.workshop4?.supportingAssets || [];
    const updatedAssets = currentAssets.filter((_, i) => i !== index);
    
    updateAnalysisData({
      workshop4: {
        supportingAssets: updatedAssets,
        operationalScenarios: analysisData.workshop4?.operationalScenarios || []
      }
    });

    addNotification('Bien support supprimé', 'info');
  };

  // Supprimer un scénario opérationnel
  const handleRemoveScenario = (index: number) => {
    const currentScenarios = analysisData.workshop4?.operationalScenarios || [];
    const updatedScenarios = currentScenarios.filter((_, i) => i !== index);
    
    updateAnalysisData({
      workshop4: {
        supportingAssets: analysisData.workshop4?.supportingAssets || [],
        operationalScenarios: updatedScenarios
      }
    });

    addNotification('Scénario opérationnel supprimé', 'info');
  };

  // Générer la matrice des risques
  const generateRiskMatrix = () => {
    const matrix: { [key: string]: { [key: string]: number } } = {};
    
    const gravityOrder = ['G1', 'G2', 'G3', 'G4', 'G5'];
    const likelihoodOrder = ['Très faible', 'Faible', 'Moyenne', 'Élevée', 'Très élevée'];

    // Initialiser la matrice
    gravityOrder.forEach(gravity => {
      matrix[gravity] = {};
      likelihoodOrder.forEach(likelihood => {
        matrix[gravity][likelihood] = 0;
      });
    });

    // Remplir la matrice
    const scenarios = analysisData.workshop4?.operationalScenarios || [];
    scenarios.forEach(scenario => {
      const strategicScenario = (analysisData.workshop3?.strategicScenarios || [])
        .find(ss => ss.title === scenario.linkedStrategicScenario);
      
      if (strategicScenario) {
        const gravity = strategicScenario.gravity;
        const likelihood = scenario.likelihood;
        
        if (matrix[gravity] && matrix[gravity][likelihood] !== undefined) {
          matrix[gravity][likelihood]++;
        }
      }
    });

    return { matrix, gravityOrder, likelihoodOrder };
  };

  // Niveau de risque selon gravité et vraisemblance
  const getRiskLevel = (gravity: string, likelihood: string) => {
    const gravityIndex = ['G1', 'G2', 'G3', 'G4', 'G5'].indexOf(gravity) + 1;
    const likelihoodIndex = ['Très faible', 'Faible', 'Moyenne', 'Élevée', 'Très élevée'].indexOf(likelihood) + 1;
    const riskScore = gravityIndex * likelihoodIndex;

    if (riskScore <= 4) return { level: 'Faible', color: 'bg-green-900/30 text-green-300' };
    if (riskScore <= 9) return { level: 'Moyen', color: 'bg-yellow-900/30 text-yellow-300' };
    if (riskScore <= 16) return { level: 'Élevé', color: 'bg-orange-900/30 text-orange-300' };
    return { level: 'Critique', color: 'bg-red-900/30 text-red-300' };
  };

  const { matrix, gravityOrder, likelihoodOrder } = generateRiskMatrix();
  const supportingAssets = analysisData.workshop4?.supportingAssets || [];
  const operationalScenarios = analysisData.workshop4?.operationalScenarios || [];

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-700 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-8 h-8 text-amber-400" />
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Atelier 4 - Scénarios Opérationnels</h2>
            <p className="text-slate-300">Construire des scénarios techniques et évaluer leur vraisemblance</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div className="flex items-center">
            <Cpu className="w-4 h-4 mr-2 text-amber-400" />
            <span><strong className="text-slate-100">Objectif :</strong> Scénarios opérationnels techniques</span>
          </div>
          <div className="flex items-center">
            <Server className="w-4 h-4 mr-2 text-amber-400" />
            <span><strong className="text-slate-100">Focus :</strong> Biens supports critiques</span>
          </div>
          <div className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2 text-amber-400" />
            <span><strong className="text-slate-100">Résultat :</strong> Évaluation vraisemblance</span>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="ebios-card">
        <div className="flex space-x-4 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('assets')}
            className={`pb-3 px-4 border-b-2 transition-all ${
              activeTab === 'assets'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4" />
              <span>Biens Supports ({supportingAssets.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`pb-3 px-4 border-b-2 transition-all ${
              activeTab === 'scenarios'
                ? 'border-green-500 text-green-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Scénarios Opérationnels ({operationalScenarios.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`pb-3 px-4 border-b-2 transition-all ${
              activeTab === 'matrix'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Matrice des Risques</span>
            </div>
          </button>
        </div>

        {/* Contenu Biens Supports */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            {/* AI Suggestion Button */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">Génération Intelligente</h3>
                <button
                  onClick={handleSuggestAssets}
                  className="btn-primary bg-purple-600 hover:bg-purple-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  <span>Générer avec IA</span>
                </button>
              </div>
              <p className="text-sm text-slate-400">
                Utilisez l'IA pour générer des biens supports pertinents selon votre contexte.
              </p>
            </div>

            {/* Formulaire d'ajout */}
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <h4 className="font-medium text-slate-100 mb-4 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un bien support
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Nom du bien *</label>
                  <input
                    type="text"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    placeholder="Nom du bien"
                    className="input-ebios-dark w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Type de bien</label>
                  <select
                    value={newAsset.type}
                    onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value as any })}
                    className="input-ebios-dark w-full"
                  >
                    {assetTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Localisation</label>
                  <input
                    type="text"
                    value={newAsset.location}
                    onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })}
                    placeholder="Localisation"
                    className="input-ebios-dark w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Niveau de Criticité</label>
                  <select
                    value={newAsset.criticality}
                    onChange={(e) => setNewAsset({ ...newAsset, criticality: e.target.value as any })}
                    className="input-ebios-dark w-full"
                  >
                    {criticalityLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleAddAsset}
                className="btn-primary bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span>Ajouter le bien support</span>
              </button>
            </div>

            {/* Liste des biens supports */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportingAssets.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-slate-500">
                  <Server className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p>Aucun bien support défini. Utilisez l'IA pour générer des suggestions.</p>
                </div>
              ) : (
                supportingAssets.map((asset, index) => (
                  <div key={asset.id} className="ebios-card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-slate-100">{asset.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-900/50 text-blue-300">
                            {asset.type}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            criticalityLevels.find(c => c.value === asset.criticality)?.color || 'bg-slate-700'
                          }`}>
                            {asset.criticality}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAsset(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-2">{asset.description}</p>
                    {asset.location && (
                      <p className="text-xs text-slate-500">📍 {asset.location}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Contenu Scénarios Opérationnels */}
        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            {/* AI Suggestion Button */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">Génération Intelligente</h3>
                <button
                  onClick={handleSuggestOperationalScenarios}
                  className="btn-primary bg-purple-600 hover:bg-purple-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  <span>Générer avec IA</span>
                </button>
              </div>
              <p className="text-sm text-slate-400">
                Générer des scénarios opérationnels basés sur vos scénarios stratégiques et biens supports.
              </p>
            </div>

            {/* Formulaire d'ajout */}
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <h4 className="font-medium text-slate-100 mb-4 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un scénario opérationnel
              </h4>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={newOperationalScenario.title}
                  onChange={(e) => setNewOperationalScenario({ ...newOperationalScenario, title: e.target.value })}
                  placeholder="Titre du scénario *"
                  className="input-ebios-dark"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={newOperationalScenario.linkedStrategicScenario}
                    onChange={(e) => setNewOperationalScenario({ ...newOperationalScenario, linkedStrategicScenario: e.target.value })}
                    className="input-ebios-dark"
                  >
                    <option value="">Scénario stratégique lié</option>
                    {(analysisData.workshop3?.strategicScenarios || []).map(scenario => (
                      <option key={scenario.id} value={scenario.title}>{scenario.title}</option>
                    ))}
                  </select>

                  <select
                    value={newOperationalScenario.likelihood}
                    onChange={(e) => setNewOperationalScenario({ ...newOperationalScenario, likelihood: e.target.value as any })}
                    className="input-ebios-dark"
                  >
                    {likelihoodLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Mode opératoire détaillé
                  </label>
                  <textarea
                    value={newOperationalScenario.operatingMode}
                    onChange={(e) => setNewOperationalScenario({ ...newOperationalScenario, operatingMode: e.target.value })}
                    placeholder="Décrire étape par étape le mode opératoire du scénario (ex: Phishing → Accès initial → Mouvement latéral → Exfiltration)"
                    className="input-ebios-dark w-full"
                    rows={4}
                  />
                </div>

                <button
                  onClick={handleAddOperationalScenario}
                  className="btn-primary bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span>Ajouter le scénario</span>
                </button>
              </div>
            </div>

            {/* Liste des scénarios */}
            <div className="space-y-4">
              {operationalScenarios.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p>Aucun scénario opérationnel défini. Utilisez l'IA pour générer des suggestions.</p>
                </div>
              ) : (
                operationalScenarios.map((scenario, index) => (
                  <div key={scenario.id} className="ebios-card">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-slate-100">{scenario.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          likelihoodLevels.find(l => l.value === scenario.likelihood)?.color || 'bg-slate-700'
                        }`}>
                          {scenario.likelihood}
                        </span>
                        <button
                          onClick={() => handleRemoveScenario(index)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-2">{scenario.operatingMode}</p>
                    {scenario.linkedStrategicScenario && (
                      <p className="text-xs text-blue-400 flex items-center">
                        <Link className="w-3 h-3 mr-1" />
                        Lié à: {scenario.linkedStrategicScenario}
                      </p>
                    )}
                    {scenario.supportingAssets.length > 0 && (
                      <p className="text-xs text-slate-400 mt-2 flex items-center">
                        <Server className="w-3 h-3 mr-1" />
                        Actifs concernés: {scenario.supportingAssets.join(', ')}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Contenu Matrice des Risques */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <h4 className="font-medium text-slate-100 mb-4 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Matrice des Risques Opérationnels
              </h4>
              
              <div className="mb-6">
                <p className="text-sm text-slate-400">
                  Cette matrice montre la distribution des scénarios opérationnels selon leur gravité et vraisemblance.
                  <br />
                  <strong className="text-slate-300">{operationalScenarios.length} scénario(s) analysé(s)</strong>
                </p>
              </div>

              {/* Légende */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-green-900/30 p-3 rounded border border-green-700">
                  <div className="text-xs text-green-300 mb-1">Niveau Faible</div>
                  <div className="text-sm font-medium text-green-200">Risque acceptable</div>
                </div>
                <div className="bg-yellow-900/30 p-3 rounded border border-yellow-700">
                  <div className="text-xs text-yellow-300 mb-1">Niveau Moyen</div>
                  <div className="text-sm font-medium text-yellow-200">À surveiller</div>
                </div>
                <div className="bg-orange-900/30 p-3 rounded border border-orange-700">
                  <div className="text-xs text-orange-300 mb-1">Niveau Élevé</div>
                  <div className="text-sm font-medium text-orange-200">À traiter</div>
                </div>
                <div className="bg-red-900/30 p-3 rounded border border-red-700">
                  <div className="text-xs text-red-300 mb-1">Niveau Critique</div>
                  <div className="text-sm font-medium text-red-200">À traiter en priorité</div>
                </div>
              </div>

              {/* Matrice */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-slate-600 p-3 bg-slate-800 text-slate-300 text-sm font-medium">
                        Gravité / Vraisemblance
                      </th>
                      {likelihoodOrder.map(likelihood => (
                        <th key={likelihood} className="border border-slate-600 p-3 bg-slate-800 text-slate-300 text-xs">
                          {likelihood}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gravityOrder.reverse().map(gravity => (
                      <tr key={gravity}>
                        <td className="border border-slate-600 p-3 bg-slate-800 font-medium text-slate-300 text-center">
                          {gravity}
                        </td>
                        {likelihoodOrder.map(likelihood => {
                          const count = matrix[gravity]?.[likelihood] || 0;
                          const riskLevel = getRiskLevel(gravity, likelihood);
                          
                          return (
                            <td
                              key={likelihood}
                              className={`border border-slate-600 p-3 text-center ${riskLevel.color}`}
                            >
                              <div className="text-lg font-bold">{count}</div>
                              <div className="text-xs opacity-80">{riskLevel.level}</div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Analyse des résultats */}
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <h4 className="font-medium text-slate-100 mb-4">Analyse des résultats</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                  <div className="text-2xl font-bold text-slate-100">
                    {operationalScenarios.filter(s => s.likelihood === 'Élevée' || s.likelihood === 'Très élevée').length}
                  </div>
                  <div className="text-sm text-slate-400">Scénarios à forte vraisemblance</div>
                </div>
                <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                  <div className="text-2xl font-bold text-slate-100">
                    {supportingAssets.filter(a => a.criticality === 'Critique').length}
                  </div>
                  <div className="text-sm text-slate-400">Biens supports critiques</div>
                </div>
                <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                  <div className="text-2xl font-bold text-slate-100">
                    {operationalScenarios.length}
                  </div>
                  <div className="text-sm text-slate-400">Scénarios opérationnels total</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bandeau d'action */}
      <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Prêt pour l'atelier final ?</h3>
            <p className="text-slate-300 text-sm">
              {operationalScenarios.length} scénario(s) opérationnel(s) analysé(s) - 
              {supportingAssets.length} bien(s) support(s) identifié(s)
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Exporter l'analyse</span>
            </button>
            <button className="btn-primary flex items-center space-x-2 bg-amber-600 hover:bg-amber-700">
              <Target className="w-4 h-4" />
              <span>Passer au traitement des risques</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Atelier4;