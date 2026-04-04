// src/components/Analysis/Atelier3.tsx
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Users, 
  Target,
  Shield,
  Globe,
  Network,
  Zap,
  Eye,
  Link2,
  ArrowRight
} from 'lucide-react';
import { type Analysis, type StrategicScenario, type Stakeholder } from '../../types/data';

interface Atelier3Props {
  analysisData: Analysis;
  updateAnalysisData: (updates: Partial<Analysis>) => void;
}

const Atelier3: React.FC<Atelier3Props> = ({ analysisData, updateAnalysisData }) => {
  // Fonction de calcul du niveau de menace
  const calculateThreatLevel = (exposure: number, reliability: number): number => {
    return Math.max(1, Math.min(4, Math.round((exposure + reliability) / 2)));
  };

  // Fonction simple de notification
  const addNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    console.log(`[${type}] ${message}`);
    alert(message);
  };

  // Simulation de l'utilisateur
  const user = { 
    aiTokensRemaining: 10 
  };

  const [newScenario, setNewScenario] = useState<Partial<StrategicScenario>>({
    title: '',
    targetBusinessValue: '',
    riskSource: '',
    attackPath: '',
    fearedEvent: '',
    gravity: 'G2',
    stakeholders: []
  });

  const [newStakeholder, setNewStakeholder] = useState<Partial<Stakeholder>>({
    name: '',
    exposure: 1,
    reliability: 1,
    threatLevel: 1
  });

  const [activeTab, setActiveTab] = useState<'scenarios' | 'stakeholders' | 'ecosystem'>('scenarios');

  const gravityLevels = [
    { value: 'G1', label: 'G1 - Mineure', color: 'bg-green-600' },
    { value: 'G2', label: 'G2 - Significative', color: 'bg-yellow-600' },
    { value: 'G3', label: 'G3 - Grave', color: 'bg-orange-600' },
    { value: 'G4', label: 'G4 - Critique', color: 'bg-red-600' },
    { value: 'G5', label: 'G5 - Catastrophique', color: 'bg-purple-600' }
  ];

  const scaleLabels = ['', 'Très faible', 'Faible', 'Élevée', 'Très élevée'];

  const handleSuggestScenarios = () => {
    if (!analysisData.workshop1.config.contexte) {
      addNotification('Veuillez d\'abord sélectionner un contexte dans l\'Atelier 1', 'warning');
      return;
    }

    if (analysisData.workshop1.config.valeursMetier.length === 0) {
      addNotification('Veuillez d\'abord définir des valeurs métier dans l\'Atelier 1', 'warning');
      return;
    }

    if (analysisData.workshop2.sourcesRisque.length === 0) {
      addNotification('Veuillez d\'abord définir des sources de risque dans l\'Atelier 2', 'warning');
      return;
    }

    if (!user || user.aiTokensRemaining < 1) {
      addNotification('Tokens IA insuffisants. Passez à un plan payant pour continuer.', 'warning');
      return;
    }

    // Simulation de l'appel AI
    try {
      const suggestedScenarios: StrategicScenario[] = [
        {
          id: `ss_${Date.now()}_1`,
          title: `Compromission ${analysisData.workshop1.config.contexte}`,
          targetBusinessValue: analysisData.workshop1.config.valeursMetier[0]?.nom || 'Valeur critique',
          riskSource: analysisData.workshop2.sourcesRisque[0]?.nom || 'Source principale',
          attackPath: 'Reconnaissance → Intrusion → Escalade → Exfiltration',
          fearedEvent: 'Perte de données sensibles ou interruption de service',
          gravity: 'G3',
          stakeholders: []
        }
      ];

      const updatedStrategicScenarios = [...analysisData.workshop3.strategicScenarios, ...suggestedScenarios];
      
      updateAnalysisData({
        workshop3: {
          ...analysisData.workshop3,
          strategicScenarios: updatedStrategicScenarios
        }
      });

      addNotification(`${suggestedScenarios.length} scénario(s) stratégique(s) généré(s)`, 'success');
    } catch (error) {
      console.error('AI generation error:', error);
      addNotification('Erreur lors de la génération des scénarios', 'error');
    }
  };

  const handleAddScenario = () => {
    if (!newScenario.title?.trim()) {
      addNotification('Veuillez renseigner au moins le titre du scénario', 'warning');
      return;
    }

    const scenario: StrategicScenario = {
      id: `ss_${Date.now()}`,
      title: newScenario.title || '',
      targetBusinessValue: newScenario.targetBusinessValue || '',
      riskSource: newScenario.riskSource || '',
      attackPath: newScenario.attackPath || '',
      fearedEvent: newScenario.fearedEvent || '',
      gravity: newScenario.gravity || 'G2',
      stakeholders: []
    };

    const updatedStrategicScenarios = [...analysisData.workshop3.strategicScenarios, scenario];
    
    updateAnalysisData({
      workshop3: {
        ...analysisData.workshop3,
        strategicScenarios: updatedStrategicScenarios
      }
    });

    setNewScenario({
      title: '',
      targetBusinessValue: '',
      riskSource: '',
      attackPath: '',
      fearedEvent: '',
      gravity: 'G2',
      stakeholders: []
    });

    addNotification('Scénario stratégique ajouté avec succès', 'success');
  };

  const handleUpdateScenario = (index: number, updates: Partial<StrategicScenario>) => {
    const updatedStrategicScenarios = [...analysisData.workshop3.strategicScenarios];
    updatedStrategicScenarios[index] = { ...updatedStrategicScenarios[index], ...updates };
    
    updateAnalysisData({
      workshop3: {
        ...analysisData.workshop3,
        strategicScenarios: updatedStrategicScenarios
      }
    });
  };

  const handleRemoveScenario = (index: number) => {
    const updatedStrategicScenarios = analysisData.workshop3.strategicScenarios.filter((_: any, i: number) => i !== index);
    
    updateAnalysisData({
      workshop3: {
        ...analysisData.workshop3,
        strategicScenarios: updatedStrategicScenarios
      }
    });

    addNotification('Scénario stratégique supprimé', 'info');
  };

  const handleAddStakeholder = () => {
    if (!newStakeholder.name?.trim()) {
      addNotification('Veuillez renseigner le nom de la partie prenante', 'warning');
      return;
    }

    const calculatedThreatLevel = calculateThreatLevel(
      newStakeholder.exposure || 1,
      newStakeholder.reliability || 1
    );

    const stakeholder: Stakeholder = {
      id: `st_${Date.now()}`,
      name: newStakeholder.name || '',
      exposure: newStakeholder.exposure || 1,
      reliability: newStakeholder.reliability || 1,
      threatLevel: calculatedThreatLevel
    };

    // Ajouter au premier scénario (vous pouvez adapter la logique)
    const updatedStrategicScenarios = [...analysisData.workshop3.strategicScenarios];
    if (updatedStrategicScenarios.length > 0) {
      updatedStrategicScenarios[0].stakeholders.push(stakeholder);
      
      updateAnalysisData({
        workshop3: {
          ...analysisData.workshop3,
          strategicScenarios: updatedStrategicScenarios
        }
      });

      setNewStakeholder({
        name: '',
        exposure: 1,
        reliability: 1,
        threatLevel: 1
      });

      addNotification('Partie prenante ajoutée avec succès', 'success');
    } else {
      addNotification('Veuillez d\'abord créer un scénario', 'warning');
    }
  };

  const getGravityColor = (gravity: string) => {
    const level = gravityLevels.find(g => g.value === gravity);
    return level ? level.color : 'bg-slate-600';
  };

  const getGravityTextColor = (gravity: string) => {
    switch (gravity) {
      case 'G1': return 'text-green-300';
      case 'G2': return 'text-yellow-300';
      case 'G3': return 'text-orange-300';
      case 'G4': return 'text-red-300';
      case 'G5': return 'text-purple-300';
      default: return 'text-slate-300';
    }
  };

  const getThreatLevelColor = (threatLevel: number) => {
    if (threatLevel <= 1) return 'bg-green-900/50 text-green-300 border-green-700';
    if (threatLevel <= 2) return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
    if (threatLevel <= 3) return 'bg-orange-900/50 text-orange-300 border-orange-700';
    return 'bg-red-900/50 text-red-300 border-red-700';
  };

  const getThreatLevelLabel = (threatLevel: number) => {
    if (threatLevel <= 1) return 'Faible';
    if (threatLevel <= 2) return 'Moyen';
    if (threatLevel <= 3) return 'Élevé';
    return 'Critique';
  };

  const renderProgressBar = (value: number, max: number = 4, label: string) => {
    const percentage = (value / max) * 100;
    const getColor = () => {
      if (percentage <= 25) return 'bg-green-500';
      if (percentage <= 50) return 'bg-yellow-500';
      if (percentage <= 75) return 'bg-orange-500';
      return 'bg-red-500';
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-300">{label}</span>
          <span className="text-sm text-slate-400">{value}/{max}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getColor()}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-emerald-900/20 to-green-900/20 border border-emerald-700 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="w-8 h-8 text-emerald-400" />
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Atelier 3 - Scénarios Stratégiques et Écosystème</h2>
            <p className="text-slate-300">Élaborer des scénarios de haut niveau incluant l'écosystème et évaluer leur gravité</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-2 text-emerald-400" />
            <span><strong className="text-slate-100">Objectif :</strong> Scénarios stratégiques et écosystème</span>
          </div>
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2 text-emerald-400" />
            <span><strong className="text-slate-100">Approche :</strong> Perspective écosystème et valeurs métier</span>
          </div>
          <div className="flex items-center">
            <Network className="w-4 h-4 mr-2 text-emerald-400" />
            <span><strong className="text-slate-100">Résultat :</strong> Cartographie de menace numérique</span>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="ebios-card">
        <div className="flex space-x-4 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`pb-3 px-4 border-b-2 transition-all ${
              activeTab === 'scenarios'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Scénarios ({analysisData.workshop3.strategicScenarios.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('stakeholders')}
            className={`pb-3 px-4 border-b-2 transition-all ${
              activeTab === 'stakeholders'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Parties Prenantes</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('ecosystem')}
            className={`pb-3 px-4 border-b-2 transition-all ${
              activeTab === 'ecosystem'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Cartographie Écosystème</span>
            </div>
          </button>
        </div>

        {/* Contenu Scénarios */}
        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            {/* AI Suggestion Button */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">Génération Intelligente</h3>
                <button
                  onClick={handleSuggestScenarios}
                  disabled={!analysisData.workshop1.config.contexte || 
                           analysisData.workshop1.config.valeursMetier.length === 0 || 
                           analysisData.workshop2.sourcesRisque.length === 0}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 transition duration-200"
                >
                  <Zap className="w-4 h-4" />
                  <span>Générer avec IA</span>
                </button>
              </div>
              <p className="text-sm text-slate-400">
                Utilisez l'IA pour générer des scénarios réalistes basés sur votre contexte et vos données.
              </p>
            </div>

            {/* Add New Scenario */}
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <h4 className="font-medium text-slate-100 mb-4 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un nouveau scénario stratégique
              </h4>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={newScenario.title || ''}
                  onChange={(e) => setNewScenario({ ...newScenario, title: e.target.value })}
                  placeholder="Titre du scénario"
                  className="input-ebios-dark"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={newScenario.targetBusinessValue || ''}
                    onChange={(e) => setNewScenario({ ...newScenario, targetBusinessValue: e.target.value })}
                    className="input-ebios-dark"
                  >
                    <option value="">Sélectionner une valeur métier</option>
                    {analysisData.workshop1.config.valeursMetier.map(bv => (
                      <option key={bv.id} value={bv.nom}>{bv.nom}</option>
                    ))}
                  </select>

                  <select
                    value={newScenario.riskSource || ''}
                    onChange={(e) => setNewScenario({ ...newScenario, riskSource: e.target.value })}
                    className="input-ebios-dark"
                  >
                    <option value="">Sélectionner une source de risque</option>
                    {analysisData.workshop2.sourcesRisque.map(rs => (
                      <option key={rs.id} value={rs.nom}>{rs.nom}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-slate-400">Chemin d'attaque</label>
                      <button
                        type="button"
                        onClick={() => {
                          const valeur = newScenario.targetBusinessValue || 'valeur métier';
                          const source = newScenario.riskSource || 'source de risque';
                          const paths: Record<string, string> = {
                            'Cybercriminel': `Reconnaissance de ${valeur} → Phishing ciblé → Compromission d'accès → Exfiltration / chiffrement`,
                            'État-nation': `Renseignement sur ${valeur} → Spear phishing → Implant persistant → Sabotage ou espionnage`,
                            'Concurrent': `Identification de ${valeur} → Ingénierie sociale → Vol de données → Exploitation concurrentielle`,
                            'Initié malveillant': `Accès privilégié à ${valeur} → Abus de droits → Exfiltration interne → Dissimulation`,
                          };
                          const generated = paths[source]
                            || `Reconnaissance → Accès initial (${source}) → Mouvement latéral vers ${valeur} → Impact / Événement redouté`;
                          setNewScenario({ ...newScenario, attackPath: generated });
                        }}
                        className="text-xs bg-purple-700 hover:bg-purple-600 text-white px-2 py-1 rounded flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        Générer avec IA
                      </button>
                    </div>
                    <textarea
                      value={newScenario.attackPath || ''}
                      onChange={(e) => setNewScenario({ ...newScenario, attackPath: e.target.value })}
                      placeholder="Chemin d'attaque (ex: Reconnaissance → Intrusion → Propagation → Impact)"
                      className="input-ebios-dark w-full"
                      rows={3}
                    />
                  </div>

                  <textarea
                    value={newScenario.fearedEvent || ''}
                    onChange={(e) => setNewScenario({ ...newScenario, fearedEvent: e.target.value })}
                    placeholder="Événement redouté (impact sur les valeurs métier)"
                    className="input-ebios-dark"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <select
                    value={newScenario.gravity || 'G2'}
                    onChange={(e) => setNewScenario({ ...newScenario, gravity: e.target.value as any })}
                    className="input-ebios-dark"
                  >
                    {gravityLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>

                  <button
                    onClick={handleAddScenario}
                    className="btn-primary bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span>Ajouter le scénario</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Scenarios List */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-100">
                Scénarios stratégiques ({analysisData.workshop3.strategicScenarios.length})
              </h4>
              
              {analysisData.workshop3.strategicScenarios.map((scenario, index) => (
                <div key={scenario.id} className="ebios-card">
                  <div className="flex items-start justify-between mb-4">
                    <input
                      type="text"
                      value={scenario.title}
                      onChange={(e) => handleUpdateScenario(index, { title: e.target.value })}
                      className="flex-1 text-lg font-medium bg-transparent border-none outline-none text-slate-100 focus:bg-slate-700/50 focus:border focus:border-emerald-500 focus:rounded px-2 py-1"
                    />
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGravityColor(scenario.gravity)} ${getGravityTextColor(scenario.gravity)}`}>
                        {scenario.gravity}
                      </span>
                      <button
                        onClick={() => handleRemoveScenario(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Valeur métier visée</label>
                      <select
                        value={scenario.targetBusinessValue}
                        onChange={(e) => handleUpdateScenario(index, { targetBusinessValue: e.target.value })}
                        className="input-ebios-dark"
                      >
                        <option value="">Sélectionner une valeur métier</option>
                        {analysisData.workshop1.config.valeursMetier.map(bv => (
                          <option key={bv.id} value={bv.nom}>{bv.nom}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Source de risque</label>
                      <select
                        value={scenario.riskSource}
                        onChange={(e) => handleUpdateScenario(index, { riskSource: e.target.value })}
                        className="input-ebios-dark"
                      >
                        <option value="">Sélectionner une source de risque</option>
                        {analysisData.workshop2.sourcesRisque.map(rs => (
                          <option key={rs.id} value={rs.nom}>{rs.nom}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Chemin d'attaque</label>
                      <textarea
                        value={scenario.attackPath}
                        onChange={(e) => handleUpdateScenario(index, { attackPath: e.target.value })}
                        className="input-ebios-dark"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Événement redouté</label>
                      <textarea
                        value={scenario.fearedEvent}
                        onChange={(e) => handleUpdateScenario(index, { fearedEvent: e.target.value })}
                        className="input-ebios-dark"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Gravité</label>
                      <select
                        value={scenario.gravity}
                        onChange={(e) => handleUpdateScenario(index, { gravity: e.target.value as any })}
                        className="input-ebios-dark"
                      >
                        {gravityLevels.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={() => setActiveTab('stakeholders')}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>Gérer parties prenantes</span>
                    </button>
                  </div>
                </div>
              ))}

              {analysisData.workshop3.strategicScenarios.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p>Aucun scénario stratégique défini. Utilisez l'IA pour des suggestions ou ajoutez-en manuellement.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contenu Parties Prenantes */}
        {activeTab === 'stakeholders' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <h4 className="font-medium text-slate-100 mb-4 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Ajouter une partie prenante à un scénario
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <input
                  type="text"
                  value={newStakeholder.name || ''}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
                  placeholder="Nom de la partie prenante"
                  className="input-ebios-dark"
                />

                <div>
                  {renderProgressBar(newStakeholder.exposure || 1, 4, 'Exposition')}
                  <div className="mt-1">
                    <select
                      value={newStakeholder.exposure || 1}
                      onChange={(e) => setNewStakeholder({ ...newStakeholder, exposure: Number(e.target.value) })}
                      className="input-ebios-dark text-sm"
                    >
                      {scaleLabels.slice(1).map((label, idx) => (
                        <option key={idx + 1} value={idx + 1}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  {renderProgressBar(newStakeholder.reliability || 1, 4, 'Fiabilité')}
                  <div className="mt-1">
                    <select
                      value={newStakeholder.reliability || 1}
                      onChange={(e) => setNewStakeholder({ ...newStakeholder, reliability: Number(e.target.value) })}
                      className="input-ebios-dark text-sm"
                    >
                      {scaleLabels.slice(1).map((label, idx) => (
                        <option key={idx + 1} value={idx + 1}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAddStakeholder}
                  className="btn-primary"
                >
                  Ajouter
                </button>
              </div>
            </div>

            {/* Liste des scénarios avec leurs parties prenantes */}
            <div className="space-y-6">
              {analysisData.workshop3.strategicScenarios.map((scenario) => (
                <div key={scenario.id} className="ebios-card">
                  <h5 className="font-medium text-slate-100 mb-3">{scenario.title}</h5>
                  
                  <div className="space-y-2">
                    {scenario.stakeholders.map((stakeholder) => (
                      <div key={stakeholder.id} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700 rounded">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-slate-100">{stakeholder.name}</span>
                          <span className="text-sm text-slate-400">
                            Exposition: {stakeholder.exposure}, Fiabilité: {stakeholder.reliability}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatLevelColor(stakeholder.threatLevel)}`}>
                            Menace: {getThreatLevelLabel(stakeholder.threatLevel)}
                          </span>
                        </div>
                      </div>
                    ))}

                    {scenario.stakeholders.length === 0 && (
                      <p className="text-sm text-slate-500 italic p-3 text-center">
                        Aucune partie prenante définie pour ce scénario
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contenu Cartographie Écosystème */}
        {activeTab === 'ecosystem' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <h4 className="font-medium text-slate-100 mb-4 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Cartographie de menace numérique de l'écosystème
              </h4>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description de la cartographie
                </label>
                <textarea
                  className="input-ebios-dark h-40"
                  placeholder="Décrire l'écosystème, les parties prenantes critiques, les interactions et les vulnérabilités structurelles..."
                />
              </div>

              {/* Matrice des parties prenantes */}
              <div className="space-y-4">
                <h5 className="font-medium text-slate-100">Parties prenantes critiques identifiées</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-100">Fournisseur Cloud</span>
                      <span className="text-xs px-2 py-1 bg-red-900/50 text-red-300 rounded">Critique</span>
                    </div>
                    <p className="text-sm text-slate-400">Accès privilégié aux infrastructures</p>
                  </div>
                  <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-100">Prestataire IT</span>
                      <span className="text-xs px-2 py-1 bg-orange-900/50 text-orange-300 rounded">Élevé</span>
                    </div>
                    <p className="text-sm text-slate-400">Support technique et maintenance</p>
                  </div>
                  <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-100">Sous-traitant</span>
                      <span className="text-xs px-2 py-1 bg-yellow-900/50 text-yellow-300 rounded">Moyen</span>
                    </div>
                    <p className="text-sm text-slate-400">Accès aux données projet</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mesures de sécurité sur l'écosystème */}
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <h4 className="font-medium text-slate-100 mb-4 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Mesures de sécurité sur l'écosystème
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium text-slate-100">Clauses contractuelles de sécurité</span>
                    <p className="text-sm text-slate-400 mt-1">Inclure des exigences de sécurité dans les contrats avec les parties prenantes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium text-slate-100">Audits réguliers</span>
                    <p className="text-sm text-slate-400 mt-1">Audits de sécurité périodiques des parties prenantes critiques</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium text-slate-100">Limitation des accès</span>
                    <p className="text-sm text-slate-400 mt-1">Accès minimum nécessaire selon le principe de moindre privilège</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bandeau d'action */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 border border-emerald-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Atelier 3 complété</h3>
            <p className="text-slate-300 text-sm">
              {analysisData.workshop3.strategicScenarios.length} scénario(s) stratégique(s) défini(s)
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Voir la synthèse</span>
            </button>
            <button className="btn-primary flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700">
              <Link2 className="w-4 h-4" />
              <span>Passer à l'atelier 4</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Atelier3;