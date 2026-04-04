// src/components/Analysis/RapportExecutif.tsx
import React from 'react';
import { BarChart3, FileText, Shield, Target, AlertTriangle } from 'lucide-react';
import { type Analysis } from '../../types/data';

interface RapportExecutifProps {
  analysisData: Analysis;
}

const RapportExecutif: React.FC<RapportExecutifProps> = ({ analysisData }) => {
  const gravityOrder = ['G1', 'G2', 'G3', 'G4', 'G5'];
  const likelihoodOrder = ['Très faible', 'Faible', 'Moyenne', 'Élevée', 'Très élevée'];

  // Construire la matrice des risques depuis les données Atelier 4
  const buildMatrix = () => {
    const matrix: Record<string, Record<string, number>> = {};
    gravityOrder.forEach(g => {
      matrix[g] = {};
      likelihoodOrder.forEach(l => { matrix[g][l] = 0; });
    });

    const scenarios = analysisData.workshop4?.operationalScenarios || [];
    const strategicScenarios = analysisData.workshop3?.strategicScenarios || [];

    scenarios.forEach(scenario => {
      const linked = strategicScenarios.find(ss => ss.title === scenario.linkedStrategicScenario);
      if (linked) {
        const g = linked.gravity;
        const l = scenario.likelihood;
        if (matrix[g] && matrix[g][l] !== undefined) {
          matrix[g][l]++;
        }
      }
    });

    return matrix;
  };

  const getRiskLevel = (gravity: string, likelihood: string) => {
    const gIdx = gravityOrder.indexOf(gravity) + 1;
    const lIdx = likelihoodOrder.indexOf(likelihood) + 1;
    const score = gIdx * lIdx;
    if (score <= 4)  return { level: 'Faible',    color: 'bg-green-900/40 text-green-300 border-green-700' };
    if (score <= 9)  return { level: 'Moyen',     color: 'bg-yellow-900/40 text-yellow-300 border-yellow-700' };
    if (score <= 16) return { level: 'Élevé',     color: 'bg-orange-900/40 text-orange-300 border-orange-700' };
    return           { level: 'Critique', color: 'bg-red-900/40 text-red-300 border-red-700' };
  };

  const matrix = buildMatrix();
  const reversedGravity = [...gravityOrder].reverse();

  const operationalScenarios = analysisData.workshop4?.operationalScenarios || [];
  const supportingAssets     = analysisData.workshop4?.supportingAssets || [];
  const securityMeasures     = analysisData.workshop5?.securityMeasures || [];
  const residualRisks        = analysisData.workshop5?.residualRisks || [];

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-700 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-8 h-8 text-indigo-400" />
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Rapport Exécutif</h2>
            <p className="text-slate-300">Synthèse de l'analyse EBIOS RM — {analysisData.title || 'Analyse en cours'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-2 text-indigo-400" />
            <span><strong className="text-slate-100">Organisation :</strong> {analysisData.organization || '—'}</span>
          </div>
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2 text-indigo-400" />
            <span><strong className="text-slate-100">Scénarios :</strong> {operationalScenarios.length} opérationnel(s)</span>
          </div>
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-indigo-400" />
            <span><strong className="text-slate-100">Mesures :</strong> {securityMeasures.length} identifiée(s)</span>
          </div>
        </div>
      </div>

      {/* Matrice des Risques (Atelier 4) */}
      <div className="ebios-card">
        <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-amber-400" />
          Matrice des Risques Opérationnels
        </h3>

        {/* Légende */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Niveau Faible',    sub: 'Risque acceptable',       cls: 'bg-green-900/30 border-green-700 text-green-300 text-green-200' },
            { label: 'Niveau Moyen',     sub: 'À surveiller',             cls: 'bg-yellow-900/30 border-yellow-700 text-yellow-300 text-yellow-200' },
            { label: 'Niveau Élevé',     sub: 'À traiter',                cls: 'bg-orange-900/30 border-orange-700 text-orange-300 text-orange-200' },
            { label: 'Niveau Critique',  sub: 'À traiter en priorité',    cls: 'bg-red-900/30 border-red-700 text-red-300 text-red-200' },
          ].map(({ label, sub, cls }) => {
            const [bg, border, textLabel, textSub] = cls.split(' ');
            return (
              <div key={label} className={`${bg} p-3 rounded border ${border}`}>
                <div className={`text-xs ${textLabel} mb-1`}>{label}</div>
                <div className={`text-sm font-medium ${textSub}`}>{sub}</div>
              </div>
            );
          })}
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-slate-600 p-3 bg-slate-800 text-slate-300 text-sm font-medium">
                  Gravité / Vraisemblance
                </th>
                {likelihoodOrder.map(l => (
                  <th key={l} className="border border-slate-600 p-3 bg-slate-800 text-slate-300 text-xs">
                    {l}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reversedGravity.map(gravity => (
                <tr key={gravity}>
                  <td className="border border-slate-600 p-3 bg-slate-800 font-medium text-slate-300 text-center">
                    {gravity}
                  </td>
                  {likelihoodOrder.map(likelihood => {
                    const count = matrix[gravity]?.[likelihood] || 0;
                    const risk  = getRiskLevel(gravity, likelihood);
                    return (
                      <td key={likelihood} className={`border border-slate-600 p-3 text-center ${risk.color}`}>
                        <div className="text-lg font-bold">{count}</div>
                        <div className="text-xs opacity-80">{risk.level}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          {operationalScenarios.length} scénario(s) analysé(s) · {supportingAssets.length} bien(s) support(s)
        </p>
      </div>

      {/* Résumé risques résiduels */}
      {residualRisks.length > 0 && (
        <div className="ebios-card">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
            Risques résiduels ({residualRisks.length})
          </h3>
          <div className="space-y-2">
            {residualRisks.map((risk: any) => (
              <div key={risk.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded border border-slate-700">
                <span className="text-slate-200 text-sm">{risk.name}</span>
                <span className={`text-xs px-2 py-1 rounded font-medium ${
                  risk.currentRisk === 'Critique' ? 'bg-red-900/50 text-red-300' :
                  risk.currentRisk === 'Élevé'   ? 'bg-orange-900/50 text-orange-300' :
                  risk.currentRisk === 'Moyen'   ? 'bg-yellow-900/50 text-yellow-300' :
                                                   'bg-green-900/50 text-green-300'
                }`}>
                  {risk.currentRisk}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RapportExecutif;
