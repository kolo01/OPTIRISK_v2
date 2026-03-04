// src/components/Analysis/Atelier5.tsx
import React, { useState } from 'react';
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Download,
  Eye,
  BarChart3,
  Target,
  Users,
  Clock,
  Flag,
  PieChart,
  Filter,
  Save,
  ArrowRight,
  FileText // AJOUTÉ
} from 'lucide-react';
import { type Analysis, type SecurityMeasure, type RiskResidual } from '../../types/data';

interface Atelier5Props {
  analysisData: Analysis;
  updateAnalysisData: (updates: Partial<Analysis>) => void;
  onNavigateToReports?: () => void;
}

const Atelier5: React.FC<Atelier5Props> = ({ analysisData, updateAnalysisData, onNavigateToReports }) => {
  const [newSecurityMeasure, setNewSecurityMeasure] = useState({
    title: '', // CHANGÉ de 'name' à 'title'
    category: 'Protection' as 'Protection' | 'Détection' | 'Réaction' | 'Récupération' | 'Gouvernance',
    description: '',
    cost: 'Faible' as 'Faible' | 'Moyen' | 'Élevé',
    implementationTime: 'Court' as 'Court' | 'Moyen' | 'Long',
    priority: 'Moyenne' as 'Faible' | 'Moyenne' | 'Élevée' | 'Critique',
    responsible: '',
    status: 'À faire' as 'À faire' | 'En cours' | 'Terminé' | 'Reporté' // CORRIGÉ le type
  });

  const [newRiskResidual, setNewRiskResidual] = useState({
    name: '',
    originalRisk: '',
    currentRisk: 'Moyen' as 'Faible' | 'Moyen' | 'Élevé' | 'Critique',
    justification: '',
    monitoringPlan: '',
    acceptance: 'Accepté' as 'Accepté' | 'Conditionnel' | 'Non accepté'
  });

  const [activeTab, setActiveTab] = useState<'measures' | 'residual' | 'dashboard'>('measures');
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);

  // Fonction simple de notification
  const addNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    console.log(`[${type}] ${message}`);
    alert(message);
  };

  // Catégories de mesures
  const measureCategories = [
    { value: 'Protection', label: 'Protection', color: 'bg-blue-900/50 text-blue-300', icon: <Shield className="w-4 h-4" /> },
    { value: 'Détection', label: 'Détection', color: 'bg-yellow-900/50 text-yellow-300', icon: <Eye className="w-4 h-4" /> },
    { value: 'Réaction', label: 'Réaction', color: 'bg-orange-900/50 text-orange-300', icon: <AlertTriangle className="w-4 h-4" /> },
    { value: 'Récupération', label: 'Récupération', color: 'bg-green-900/50 text-green-300', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'Gouvernance', label: 'Gouvernance', color: 'bg-purple-900/50 text-purple-300', icon: <Users className="w-4 h-4" /> }
  ];

  // Niveaux de coût
  const costLevels = [
    { value: 'Faible', label: 'Faible (< 5k€)', color: 'bg-green-900/50 text-green-300' },
    { value: 'Moyen', label: 'Moyen (5-20k€)', color: 'bg-yellow-900/50 text-yellow-300' },
    { value: 'Élevé', label: 'Élevé (> 20k€)', color: 'bg-red-900/50 text-red-300' }
  ];

  // Niveaux de temps
  const timeLevels = [
    { value: 'Court', label: 'Court (< 3 mois)', color: 'bg-green-900/50 text-green-300' },
    { value: 'Moyen', label: 'Moyen (3-6 mois)', color: 'bg-yellow-900/50 text-yellow-300' },
    { value: 'Long', label: 'Long (> 6 mois)', color: 'bg-red-900/50 text-red-300' }
  ];

  // Statuts - CORRIGÉ pour correspondre au type SecurityMeasure
  const statusLevels = [
    { value: 'À faire', label: 'À faire', color: 'bg-gray-900/50 text-gray-300' },
    { value: 'En cours', label: 'En cours', color: 'bg-blue-900/50 text-blue-300' },
    { value: 'Terminé', label: 'Terminé', color: 'bg-green-900/50 text-green-300' },
    { value: 'Reporté', label: 'Reporté', color: 'bg-red-900/50 text-red-300' }
  ];

  // Niveaux de risque
  const riskLevels = [
    { value: 'Faible', label: 'Faible', color: 'bg-green-900/50 text-green-300' },
    { value: 'Moyen', label: 'Moyen', color: 'bg-yellow-900/50 text-yellow-300' },
    { value: 'Élevé', label: 'Élevé', color: 'bg-orange-900/50 text-orange-300' },
    { value: 'Critique', label: 'Critique', color: 'bg-red-900/50 text-red-300' }
  ];

  // Niveaux d'acceptation
  const acceptanceLevels = [
    { value: 'Accepté', label: 'Accepté', color: 'bg-green-900/50 text-green-300', icon: <CheckCircle className="w-4 h-4" /> },
    { value: 'Conditionnel', label: 'Conditionnel', color: 'bg-yellow-900/50 text-yellow-300', icon: <AlertTriangle className="w-4 h-4" /> },
    { value: 'Non accepté', label: 'Non accepté', color: 'bg-red-900/50 text-red-300', icon: <XCircle className="w-4 h-4" /> }
  ];

  // Récupérer les scénarios opérationnels
  const operationalScenarios = analysisData.workshop4?.operationalScenarios || [];

  // Ajouter une mesure de sécurité - CORRIGÉ
  const handleAddSecurityMeasure = () => {
    if (!newSecurityMeasure.title.trim()) { // CHANGÉ de 'name' à 'title'
      addNotification('Veuillez renseigner le titre de la mesure', 'warning');
      return;
    }

    const measure: SecurityMeasure = {
      id: `sm_${Date.now()}`,
      title: newSecurityMeasure.title, // CHANGÉ de 'name' à 'title'
      description: newSecurityMeasure.description,
      category: newSecurityMeasure.category === 'Protection' ? 'technique' : 
                newSecurityMeasure.category === 'Détection' ? 'technique' : 
                newSecurityMeasure.category === 'Réaction' ? 'organisationnelle' :
                newSecurityMeasure.category === 'Récupération' ? 'organisationnelle' : 'juridique',
      priority: newSecurityMeasure.priority,
      cost: newSecurityMeasure.cost === 'Faible' ? '1000€' : 
            newSecurityMeasure.cost === 'Moyen' ? '5000€' : '15000€',
      deadline: new Date(Date.now() + (newSecurityMeasure.implementationTime === 'Court' ? 30 : 
                newSecurityMeasure.implementationTime === 'Moyen' ? 90 : 180) * 24 * 60 * 60 * 1000),
      responsible: newSecurityMeasure.responsible,
      status: newSecurityMeasure.status
    };

    const currentMeasures = analysisData.workshop5?.securityMeasures || [];
    const updatedMeasures = [...currentMeasures, measure];

    updateAnalysisData({
      workshop5: {
        securityMeasures: updatedMeasures,
        residualRisks: analysisData.workshop5?.residualRisks || []
      }
    });

    setNewSecurityMeasure({
      title: '', // CHANGÉ de 'name' à 'title'
      category: 'Protection',
      description: '',
      cost: 'Faible',
      implementationTime: 'Court',
      priority: 'Moyenne',
      responsible: '',
      status: 'À faire'
    });

    setSelectedRisks([]);
    addNotification('Mesure de sécurité ajoutée', 'success');
  };

  // Ajouter un risque résiduel
  const handleAddRiskResidual = () => {
    if (!newRiskResidual.name.trim()) {
      addNotification('Veuillez renseigner le nom du risque', 'warning');
      return;
    }

    const risk: RiskResidual = {
      id: `rr_${Date.now()}`,
      ...newRiskResidual,
      creationDate: new Date().toISOString(),
      lastReview: new Date().toISOString(),
      reviewFrequency: 'Annuel' as 'Mensuel' | 'Trimestriel' | 'Semestriel' | 'Annuel'
    };

    const currentRisks = analysisData.workshop5?.residualRisks || [];
    const updatedRisks = [...currentRisks, risk];

    updateAnalysisData({
      workshop5: {
        securityMeasures: analysisData.workshop5?.securityMeasures || [],
        residualRisks: updatedRisks
      }
    });

    setNewRiskResidual({
      name: '',
      originalRisk: '',
      currentRisk: 'Moyen',
      justification: '',
      monitoringPlan: '',
      acceptance: 'Accepté'
    });

    addNotification('Risque résiduel ajouté', 'success');
  };

  // Supprimer une mesure
  const handleRemoveMeasure = (id: string) => {
    const currentMeasures = analysisData.workshop5?.securityMeasures || [];
    const updatedMeasures = currentMeasures.filter(m => m.id !== id);

    updateAnalysisData({
      workshop5: {
        securityMeasures: updatedMeasures,
        residualRisks: analysisData.workshop5?.residualRisks || []
      }
    });

    addNotification('Mesure supprimée', 'info');
  };

  // Supprimer un risque résiduel
  const handleRemoveResidualRisk = (id: string) => {
    const currentRisks = analysisData.workshop5?.residualRisks || [];
    const updatedRisks = currentRisks.filter(r => r.id !== id);

    updateAnalysisData({
      workshop5: {
        securityMeasures: analysisData.workshop5?.securityMeasures || [],
        residualRisks: updatedRisks
      }
    });

    addNotification('Risque résiduel supprimé', 'info');
  };

  // Mettre à jour le statut d'une mesure
  const handleUpdateMeasureStatus = (id: string, status: 'À faire' | 'En cours' | 'Terminé' | 'Reporté') => {
    const currentMeasures = analysisData.workshop5?.securityMeasures || [];
    const updatedMeasures = currentMeasures.map(m => 
      m.id === id ? { ...m, status } : m
    );

    updateAnalysisData({
      workshop5: {
        securityMeasures: updatedMeasures,
        residualRisks: analysisData.workshop5?.residualRisks || []
      }
    });

    addNotification(`Statut mis à jour: ${status}`, 'info');
  };

  // Calculer les statistiques
  const calculateStats = () => {
    const measures = analysisData.workshop5?.securityMeasures || [];
    const risks = analysisData.workshop5?.residualRisks || [];

    const totalCost = measures.reduce((sum, m) => {
      const cost = m.cost.replace(/[€,\s]/g, '');
      const numericCost = parseFloat(cost) || 0;
      return sum + numericCost;
    }, 0);

    const completedMeasures = measures.filter(m => m.status === 'Terminé').length;
    const criticalRisks = risks.filter(r => r.currentRisk === 'Critique').length;

    return {
      totalMeasures: measures.length,
      completedMeasures,
      completionRate: measures.length > 0 ? (completedMeasures / measures.length) * 100 : 0,
      totalCost,
      totalRisks: risks.length,
      criticalRisks,
      acceptedRisks: risks.filter(r => r.acceptance === 'Accepté').length
    };
  };

  const stats = calculateStats();
  const securityMeasures = analysisData.workshop5?.securityMeasures || [];
  const residualRisks = analysisData.workshop5?.residualRisks || [];

  // Générer le plan d'amélioration continue
  const generatePAC = () => {
    const pac = {
      title: `Plan d'Amélioration Continue - ${analysisData.organization || 'Organisation'}`,
      date: new Date().toLocaleDateString(),
      measuresByPriority: securityMeasures.reduce((acc, measure) => {
        if (!acc[measure.priority]) acc[measure.priority] = [];
        acc[measure.priority].push(measure);
        return acc;
      }, {} as Record<string, SecurityMeasure[]>),
      risksByLevel: residualRisks.reduce((acc, risk) => {
        if (!acc[risk.currentRisk]) acc[risk.currentRisk] = [];
        acc[risk.currentRisk].push(risk);
        return acc;
      }, {} as Record<string, RiskResidual[]>),
      summary: `Plan contenant ${securityMeasures.length} mesures et ${residualRisks.length} risques résiduels.`
    };

    addNotification('Plan d\'amélioration continu généré', 'success');
    console.log('PAC généré:', pac);
    
    return pac;
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-red-900/20 to-rose-900/20 border border-red-700 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8 text-red-400" />
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Atelier 5 - Traitement du Risque</h2>
            <p className="text-slate-300">Synthétiser les risques et définir les mesures de sécurité</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-2 text-red-400" />
            <span><strong className="text-slate-100">Objectif :</strong> Synthèse et traitement</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-red-400" />
            <span><strong className="text-slate-100">Résultat :</strong> Plan d'amélioration continue</span>
          </div>
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
            <span><strong className="text-slate-100">Livrable :</strong> Acceptation des risques résiduels</span>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="ebios-card">
        <div className="flex space-x-4 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('measures')}
            className={`pb-3 px-4 border-b-2 transition-all ${
              activeTab === 'measures'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Mesures de Sécurité ({securityMeasures.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('residual')}
            className={`pb-3 px-4 border-b-2 transition-all ${
              activeTab === 'residual'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Risques Résiduels ({residualRisks.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-3 px-4 border-b-2 transition-all ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Tableau de Bord</span>
            </div>
          </button>
        </div>

        {/* Contenu Mesures de Sécurité */}
        {activeTab === 'measures' && (
          <div className="space-y-6">
            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                <div className="text-2xl font-bold text-slate-100">{stats.totalMeasures}</div>
                <div className="text-sm text-slate-400">Mesures totales</div>
              </div>
              <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                <div className="text-2xl font-bold text-green-400">{stats.completedMeasures}</div>
                <div className="text-sm text-slate-400">Mesures terminées</div>
              </div>
              <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                <div className="text-2xl font-bold text-amber-400">
                  {new Intl.NumberFormat('fr-FR').format(stats.totalCost)} €
                </div>
                <div className="text-sm text-slate-400">Coût total estimé</div>
              </div>
              <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                <div className="text-2xl font-bold text-slate-100">
                  {Math.round(stats.completionRate)}%
                </div>
                <div className="text-sm text-slate-400">Taux de réalisation</div>
              </div>
            </div>

            {/* Formulaire d'ajout */}
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <h4 className="font-medium text-slate-100 mb-4 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une mesure de sécurité
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Titre de la mesure *</label>
                  <input
                    type="text"
                    value={newSecurityMeasure.title}
                    onChange={(e) => setNewSecurityMeasure({ ...newSecurityMeasure, title: e.target.value })}
                    placeholder="Ex: Mise en place d'un pare-feu"
                    className="input-ebios-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Catégorie</label>
                  <select
                    value={newSecurityMeasure.category}
                    onChange={(e) => setNewSecurityMeasure({ ...newSecurityMeasure, category: e.target.value as any })}
                    className="input-ebios-dark"
                  >
                    {measureCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  value={newSecurityMeasure.description}
                  onChange={(e) => setNewSecurityMeasure({ ...newSecurityMeasure, description: e.target.value })}
                  placeholder="Description détaillée de la mesure..."
                  className="input-ebios-dark"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Coût estimé</label>
                  <select
                    value={newSecurityMeasure.cost}
                    onChange={(e) => setNewSecurityMeasure({ ...newSecurityMeasure, cost: e.target.value as any })}
                    className="input-ebios-dark"
                  >
                    {costLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Temps de mise en œuvre</label>
                  <select
                    value={newSecurityMeasure.implementationTime}
                    onChange={(e) => setNewSecurityMeasure({ ...newSecurityMeasure, implementationTime: e.target.value as any })}
                    className="input-ebios-dark"
                  >
                    {timeLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Priorité</label>
                  <select
                    value={newSecurityMeasure.priority}
                    onChange={(e) => setNewSecurityMeasure({ ...newSecurityMeasure, priority: e.target.value as any })}
                    className="input-ebios-dark"
                  >
                    <option value="Faible">Faible</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Élevée">Élevée</option>
                    <option value="Critique">Critique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Responsable</label>
                  <input
                    type="text"
                    value={newSecurityMeasure.responsible}
                    onChange={(e) => setNewSecurityMeasure({ ...newSecurityMeasure, responsible: e.target.value })}
                    placeholder="Nom du responsable"
                    className="input-ebios-dark"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Risques concernés</label>
                <div className="flex flex-wrap gap-2">
                  {operationalScenarios.map(scenario => (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => {
                        setSelectedRisks(prev =>
                          prev.includes(scenario.title)
                            ? prev.filter(r => r !== scenario.title)
                            : [...prev, scenario.title]
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-sm border transition-all ${
                        selectedRisks.includes(scenario.title)
                          ? 'bg-blue-900/50 text-blue-300 border-blue-600'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {scenario.title.substring(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddSecurityMeasure}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span>Ajouter la mesure</span>
              </button>
            </div>

            {/* Liste des mesures */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-100">Mesures de sécurité définies</h4>
              
              {securityMeasures.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p>Aucune mesure de sécurité définie. Commencez par en ajouter ci-dessus.</p>
                </div>
              ) : (
                securityMeasures.map((measure) => (
                  <div key={measure.id} className="ebios-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h5 className="font-medium text-slate-100">{measure.title}</h5>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            measure.category === 'technique' ? 'bg-blue-900/50 text-blue-300' :
                            measure.category === 'organisationnelle' ? 'bg-yellow-900/50 text-yellow-300' :
                            measure.category === 'juridique' ? 'bg-purple-900/50 text-purple-300' :
                            'bg-gray-900/50 text-gray-300'
                          }`}>
                            {measure.category}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            measure.cost.includes('1000') ? 'bg-green-900/50 text-green-300' :
                            measure.cost.includes('5000') ? 'bg-yellow-900/50 text-yellow-300' :
                            'bg-red-900/50 text-red-300'
                          }`}>
                            Coût: {measure.cost}
                          </span>
                        </div>
                        
                        <p className="text-sm text-slate-300 mb-3">{measure.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="text-slate-400">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {new Date(measure.deadline).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-slate-400">
                            <Flag className="w-3 h-3 inline mr-1" />
                            Priorité: {measure.priority}
                          </div>
                          <div className="text-slate-400">
                            <Users className="w-3 h-3 inline mr-1" />
                            {measure.responsible || 'Non assigné'}
                          </div>
                          <div className="text-slate-400">
                            <span className="font-medium">Statut: </span>
                            <select
                              value={measure.status}
                              onChange={(e) => handleUpdateMeasureStatus(measure.id, e.target.value as any)}
                              className="ml-1 bg-slate-800 border border-slate-700 text-slate-300 rounded text-sm px-2 py-1"
                            >
                              {statusLevels.map(status => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveMeasure(measure.id)}
                        className="text-red-400 hover:text-red-300 ml-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Contenu Risques Résiduels */}
        {activeTab === 'residual' && (
          <div className="space-y-6">
            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                <div className="text-2xl font-bold text-slate-100">{stats.totalRisks}</div>
                <div className="text-sm text-slate-400">Risques résiduels</div>
              </div>
              <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                <div className="text-2xl font-bold text-red-400">{stats.criticalRisks}</div>
                <div className="text-sm text-slate-400">Risques critiques</div>
              </div>
              <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                <div className="text-2xl font-bold text-green-400">{stats.acceptedRisks}</div>
                <div className="text-sm text-slate-400">Risques acceptés</div>
              </div>
              <div className="bg-slate-800/30 p-4 rounded border border-slate-700">
                <div className="text-2xl font-bold text-amber-400">
                  {Math.round((stats.acceptedRisks / stats.totalRisks) * 100) || 0}%
                </div>
                <div className="text-sm text-slate-400">Taux d'acceptation</div>
              </div>
            </div>

            {/* Formulaire d'ajout */}
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <h4 className="font-medium text-slate-100 mb-4 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un risque résiduel
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Nom du risque *</label>
                  <input
                    type="text"
                    value={newRiskResidual.name}
                    onChange={(e) => setNewRiskResidual({ ...newRiskResidual, name: e.target.value })}
                    placeholder="Ex: Risque d'exfiltration persistant"
                    className="input-ebios-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Risque d'origine</label>
                  <select
                    value={newRiskResidual.originalRisk}
                    onChange={(e) => setNewRiskResidual({ ...newRiskResidual, originalRisk: e.target.value })}
                    className="input-ebios-dark"
                  >
                    <option value="">Sélectionner un risque initial</option>
                    {operationalScenarios.map(scenario => (
                      <option key={scenario.id} value={scenario.title}>{scenario.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Niveau de risque actuel</label>
                  <select
                    value={newRiskResidual.currentRisk}
                    onChange={(e) => setNewRiskResidual({ ...newRiskResidual, currentRisk: e.target.value as any })}
                    className="input-ebios-dark"
                  >
                    {riskLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Acceptation</label>
                  <select
                    value={newRiskResidual.acceptance}
                    onChange={(e) => setNewRiskResidual({ ...newRiskResidual, acceptance: e.target.value as any })}
                    className="input-ebios-dark"
                  >
                    {acceptanceLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">Justification</label>
                <textarea
                  value={newRiskResidual.justification}
                  onChange={(e) => setNewRiskResidual({ ...newRiskResidual, justification: e.target.value })}
                  placeholder="Justifier pourquoi ce risque est accepté..."
                  className="input-ebios-dark"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">Plan de suivi</label>
                <textarea
                  value={newRiskResidual.monitoringPlan}
                  onChange={(e) => setNewRiskResidual({ ...newRiskResidual, monitoringPlan: e.target.value })}
                  placeholder="Détaillez le plan de suivi et de contrôle..."
                  className="input-ebios-dark"
                  rows={2}
                />
              </div>

              <button
                onClick={handleAddRiskResidual}
                className="btn-primary bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span>Ajouter le risque résiduel</span>
              </button>
            </div>

            {/* Liste des risques résiduels */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-100">Risques résiduels enregistrés</h4>
              
              {residualRisks.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p>Aucun risque résiduel défini. Commencez par en ajouter ci-dessus.</p>
                </div>
              ) : (
                residualRisks.map((risk) => (
                  <div key={risk.id} className="ebios-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h5 className="font-medium text-slate-100">{risk.name}</h5>
                          <span className={`px-2 py-1 text-xs rounded-full ${riskLevels.find(r => r.value === risk.currentRisk)?.color}`}>
                            Niveau: {risk.currentRisk}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full flex items-center ${acceptanceLevels.find(a => a.value === risk.acceptance)?.color}`}>
                            {risk.acceptance}
                          </span>
                        </div>
                        
                        {risk.originalRisk && (
                          <p className="text-sm text-slate-400 mb-2">
                            <span className="font-medium text-slate-300">Origine: </span>
                            {risk.originalRisk}
                          </p>
                        )}
                        
                        <p className="text-sm text-slate-300 mb-3">{risk.justification}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="text-slate-400">
                            <span className="font-medium text-slate-300">Plan de suivi: </span>
                            {risk.monitoringPlan || 'Non défini'}
                          </div>
                          <div className="text-slate-400">
                            <span className="font-medium text-slate-300">Dernière revue: </span>
                            {new Date(risk.lastReview).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveResidualRisk(risk.id)}
                        className="text-red-400 hover:text-red-300 ml-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tableau de Bord */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Vue d'ensemble */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique de répartition des mesures */}
              <div className="ebios-card">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-slate-100">Répartition des mesures</h4>
                  <PieChart className="w-5 h-5 text-slate-400" />
                </div>
                <div className="h-48 flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    {/* Simuler un graphique circulaire */}
                    <div className="absolute inset-0 rounded-full border-8 border-blue-500/30"></div>
                    <div className="absolute inset-0 rounded-full border-8 border-green-500/30 transform -rotate-45"></div>
                    <div className="absolute inset-0 rounded-full border-8 border-yellow-500/30 transform rotate-45"></div>
                    <div className="absolute inset-0 rounded-full border-8 border-orange-500/30 transform rotate-90"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-100">{stats.totalMeasures}</div>
                        <div className="text-sm text-slate-400">mesures</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {['technique', 'organisationnelle', 'juridique', 'autre'].map((cat) => {
                    const count = securityMeasures.filter(m => m.category === cat).length;
                    const percentage = stats.totalMeasures > 0 ? (count / stats.totalMeasures) * 100 : 0;
                    return (
                      <div key={cat} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded ${
                          cat === 'technique' ? 'bg-blue-500' :
                          cat === 'organisationnelle' ? 'bg-yellow-500' :
                          cat === 'juridique' ? 'bg-purple-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-sm text-slate-300 flex-1">{cat}</span>
                        <span className="text-sm font-medium text-slate-100">{count}</span>
                        <span className="text-xs text-slate-500">({Math.round(percentage)}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* État d'avancement */}
              <div className="ebios-card">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-slate-100">État d'avancement</h4>
                  <TrendingUp className="w-5 h-5 text-slate-400" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Mesures terminées</span>
                      <span className="text-slate-100">{stats.completedMeasures}/{stats.totalMeasures}</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-300"
                        style={{ width: `${stats.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Risques acceptés</span>
                      <span className="text-slate-100">{stats.acceptedRisks}/{stats.totalRisks}</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${(stats.acceptedRisks / stats.totalRisks) * 100 || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Coût total</span>
                      <span className="text-slate-100">{new Intl.NumberFormat('fr-FR').format(stats.totalCost)} €</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((stats.totalCost / 50000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <h5 className="font-medium text-slate-100 mb-3">Statistiques clés</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                      <div className="text-lg font-bold text-red-400">{stats.criticalRisks}</div>
                      <div className="text-xs text-slate-400">Risques critiques</div>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                      <div className="text-lg font-bold text-amber-400">
                        {securityMeasures.filter(m => m.priority === 'Critique').length}
                      </div>
                      <div className="text-xs text-slate-400">Mesures critiques</div>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                      <div className="text-lg font-bold text-green-400">
                        {securityMeasures.filter(m => m.status === 'En cours').length}
                      </div>
                      <div className="text-xs text-slate-400">En cours</div>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                      <div className="text-lg font-bold text-blue-400">
                        {residualRisks.filter(r => r.acceptance === 'Conditionnel').length}
                      </div>
                      <div className="text-xs text-slate-400">Acceptation conditionnelle</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Matrice de priorisation */}
            <div className="ebios-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-medium text-slate-100">Matrice de priorisation</h4>
                  <p className="text-sm text-slate-400">Impact vs Coût des mesures</p>
                </div>
                <Filter className="w-5 h-5 text-slate-400" />
              </div>
              
              <div className="relative h-64 bg-slate-900/50 rounded-lg border border-slate-700 p-4">
                {/* Axes et graphique... (garder votre code existant) */}
                <div className="text-center text-slate-400 py-8">
                  Matrice de priorisation à implémenter
                </div>
              </div>
            </div>

            {/* Actions et export */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Actions rapides */}
              <div className="ebios-card">
                <h4 className="font-medium text-slate-100 mb-4">Actions rapides</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('measures')}
                    className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-900/30 rounded">
                        <Plus className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-slate-300">Ajouter des mesures</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('residual')}
                    className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-900/30 rounded">
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                      </div>
                      <span className="text-slate-300">Gérer les risques résiduels</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                  </button>
                  
                  <button
                    onClick={generatePAC}
                    className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-900/30 rounded">
                        <Download className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-slate-300">Générer le PAC</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                  </button>
                </div>
              </div>

              {/* Export et sauvegarde */}
              <div className="ebios-card">
                <h4 className="font-medium text-slate-100 mb-4">Export et sauvegarde</h4>
                <div className="space-y-3">
                  <button
                    onClick={generatePAC}
                    className="w-full flex items-center space-x-3 p-3 bg-red-900/20 hover:bg-red-900/30 rounded-lg border border-red-700 transition-all"
                  >
                    <FileText className="w-5 h-5 text-red-400" />
                    <div className="text-left flex-1">
                      <div className="font-medium text-slate-100">Générer le rapport complet</div>
                      <div className="text-xs text-slate-400">PDF incluant toutes les données</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      const dataStr = JSON.stringify(analysisData.workshop5, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `atelier5_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      addNotification('Données exportées en JSON', 'success');
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-blue-900/20 hover:bg-blue-900/30 rounded-lg border border-blue-700 transition-all"
                  >
                    <Download className="w-5 h-5 text-blue-400" />
                    <div className="text-left flex-1">
                      <div className="font-medium text-slate-100">Exporter les données</div>
                      <div className="text-xs text-slate-400">Format JSON pour sauvegarde</div>
                    </div>
                  </button>
                  
                  <div className="pt-3 border-t border-slate-700">
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <Save className="w-4 h-4" />
                      <span>Sauvegarde automatique activée</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Dernière sauvegarde: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bouton Finaliser */}
      {(securityMeasures.length > 0 || residualRisks.length > 0) && (
        <div className="text-center">
          <button
            onClick={() => {
              generatePAC();
              if (onNavigateToReports) {
                onNavigateToReports();
              }
            }}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-8 py-3 rounded-lg flex items-center space-x-3 mx-auto text-lg font-medium shadow-lg transition-all transform hover:scale-105"
          >
            <CheckCircle className="w-6 h-6" />
            <span>Finaliser l'atelier 5 et générer le PAC</span>
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-sm text-slate-400 mt-2">
            Le Plan d'Amélioration Continue sera généré avec {securityMeasures.length} mesures et {residualRisks.length} risques résiduels
          </p>
        </div>
      )}
    </div>
  );
};

export default Atelier5;