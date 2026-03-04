// src/data/sourcesRisqueData.ts
import { type ObjectifVise, type SourceRisque } from '../types/data';

// Objectifs visés standards
export const objectifsVisesParDefaut: ObjectifVise[] = [
  { id: 'ov_conf', nom: 'Compromission de confidentialité', description: 'Accès non autorisé à des informations sensibles', categorie: 'Confidentialité' },
  { id: 'ov_integ', nom: 'Altération de l\'intégrité', description: 'Modification non autorisée de données ou systèmes', categorie: 'Intégrité' },
  { id: 'ov_disp', nom: 'Atteinte à la disponibilité', description: 'Interruption de service ou indisponibilité', categorie: 'Disponibilité' },
  { id: 'ov_trac', nom: 'Perte de traçabilité', description: 'Impossibilité de tracer les actions ou accès', categorie: 'Traçabilité' },
  { id: 'ov_confi', nom: 'Non-conformité réglementaire', description: 'Violation d\'exigences légales ou réglementaires', categorie: 'Conformité' },
  { id: 'ov_reput', nom: 'Atteinte à la réputation', description: 'Impact négatif sur l\'image de l\'organisation', categorie: 'Autre' },
  { id: 'ov_fin', nom: 'Perte financière', description: 'Impact financier direct ou indirect', categorie: 'Autre' },
];

// Sources de risque par contexte
export const sourcesParContexte: Record<string, Partial<SourceRisque>[]> = {
  'Banque & Finance': [
    { nom: 'Cybercriminel organisé', type: 'Externe', motivation: 'Gain financier', capacites: ['Techniques avancées', 'Ingénierie sociale'] },
    { nom: 'Employé insatisfait', type: 'Humain', motivation: 'Revanche ou profit personnel', capacites: ['Accès légitime', 'Connaissance interne'] },
    { nom: 'Concurrent malveillant', type: 'Externe', motivation: 'Avantage concurrentiel', capacites: ['Espionnage industriel', 'Déstabilisation'] },
    { nom: 'Groupe hacktiviste', type: 'Externe', motivation: 'Motivation idéologique', capacites: ['DDoS', 'Défacement'] },
    { nom: 'Fournisseur compromis', type: 'Externe', motivation: 'Accès indirect', capacites: ['Chaîne d\'approvisionnement'] },
  ],
  'Santé & Médical': [
    { nom: 'Voleur de données médicales', type: 'Externe', motivation: 'Revendre données sur dark web', capacites: ['Exploitation vulnérabilités'] },
    { nom: 'Employé négligent', type: 'Humain', motivation: 'Non intentionnelle', capacites: ['Erreur humaine'] },
    { nom: 'Équipement médical vulnérable', type: 'Technique', motivation: 'N/A', capacites: ['Défauts de sécurité'] },
    { nom: 'Ransomware ciblé', type: 'Externe', motivation: 'Extorsion financière', capacites: ['Chiffrement de données'] },
  ],
  // ... autres contextes
};

// Exemples de motivation
export const motivationsTypes = [
  'Gain financier',
  'Espionnage industriel',
  'Motivation idéologique/politique',
  'Revanche personnelle',
  'Sabotage concurrentiel',
  'Cyberterrorisme',
  'Expérimentation/Challenge',
  'Erreur ou négligence'
];

// Capacités possibles
export const capacitesTypes = [
  'Ingénierie sociale',
  'Exploitation de vulnérabilités',
  'Malware avancé',
  'DDoS',
  'Accès physique',
  'Connaissance interne',
  'Ressources financières',
  'Support étatique'
];