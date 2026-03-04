// Liste centralisée des standards de sécurité
export const standards = [
  { value: 'ISO 27001:2022', description: "Système de management de la sécurité de l'information" },
  { value: 'ISO 27002', description: 'Bonnes pratiques pour les contrôles de sécurité' },
  { value: 'ISO 27005', description: 'Gestion des risques en sécurité de l\'information' },
  { value: 'NIST CSF', description: 'Framework de cybersécurité NIST' },
  { value: 'NIST SP 800-53', description: 'Contrôles de sécurité et de confidentialité' },
  { value: 'RGPD', description: 'Règlement général sur la protection des données' },
  { value: 'LPM', description: 'Loi de programmation militaire (France)' },
  { value: 'Autre', description: 'Standard personnalisé' }
];
import type { Exigence, StandardSecurite } from '../types/data';

// Exigences ISO 27001:2022 (Structure mise à jour selon l'Annexe A 2022)
export const exigencesISO27001: Exigence[] = [
  { id: 'iso_5.1', code: 'A.5.1', description: 'Politiques de sécurité de l\'information', standard: 'ISO 27001:2022' },
  { id: 'iso_5.15', code: 'A.5.15', description: 'Contrôle d\'accès', standard: 'ISO 27001:2022' },
  { id: 'iso_5.33', code: 'A.5.33', description: 'Continuité opérationnelle des SI', standard: 'ISO 27001:2022' },
  { id: 'iso_6.6', code: 'A.6.6', description: 'Confidentialité et accords de non-divulgation', standard: 'ISO 27001:2022' },
  { id: 'iso_7.10', code: 'A.7.10', description: 'Stockage des informations (Supports)', standard: 'ISO 27001:2022' },
  { id: 'iso_8.1', code: 'A.8.1', description: 'Sécurité des terminaux utilisateurs', standard: 'ISO 27001:2022' },
  { id: 'iso_8.24', code: 'A.8.24', description: 'Utilisation de la cryptographie', standard: 'ISO 27001:2022' },
  { id: 'iso_8.5', code: 'A.8.5', description: 'Sécurisation des opérations (Capacité)', standard: 'ISO 27001:2022' },
];

// Exigences ISO 27002 (Contrôles de sécurité opérationnels)
// Note : La version 2022 regroupe les contrôles en 4 thèmes
export const exigencesISO27002: Exigence[] = [
  { id: 'iso2_5', code: 'Thème 5', description: 'Contrôles organisationnels (ex: Gestion du cloud, Inventaire)', standard: 'ISO 27002' },
  { id: 'iso2_6', code: 'Thème 6', description: 'Contrôles relatifs aux personnes (ex: Télétravail, Screening)', standard: 'ISO 27002' },
  { id: 'iso2_7', code: 'Thème 7', description: 'Contrôles physiques (ex: Surveillance, Sécurisation des bureaux)', standard: 'ISO 27002' },
  { id: 'iso2_8', code: 'Thème 8', description: 'Contrôles techniques (ex: Chiffrement, Configuration sécurisée)', standard: 'ISO 27002' },
  { id: 'iso2_8.9', code: 'A.8.9', description: 'Gestion des vulnérabilités techniques', standard: 'ISO 27002' },
  { id: 'iso2_8.16', code: 'A.8.16', description: 'Surveillance des activités (Logging/Monitoring)', standard: 'ISO 27002' },
  { id: 'iso2_8.25', code: 'A.8.25', description: 'Gestion du cycle de vie du développement (DevSecOps)', standard: 'ISO 27002' },
];

// Exigences ISO 27005 (Processus de gestion des risques)
// Utilisé pour structurer l'analyse EBIOS RM selon les standards internationaux
export const exigencesISO27005: Exigence[] = [
  { id: 'iso5_6', code: 'Art. 6', description: 'Établissement du contexte (Actifs, Critères d’acceptation)', standard: 'ISO 27005' },
  { id: 'iso5_7', code: 'Art. 7', description: 'Identification des risques (Scénarios d\'incidents)', standard: 'ISO 27005' },
  { id: 'iso5_8', code: 'Art. 8', description: 'Analyse et évaluation des risques (Vraisemblance / Impact)', standard: 'ISO 27005' },
  { id: 'iso5_9', code: 'Art. 9', description: 'Options de traitement du risque (Éviter, Modifier, Partager, Maintenir)', standard: 'ISO 27005' },
  { id: 'iso5_10', code: 'Art. 10', description: 'Acceptation des risques résiduels', standard: 'ISO 27005' },
  { id: 'iso5_12', code: 'Art. 12', description: 'Communication et concertation sur les risques', standard: 'ISO 27005' },
];


// Exigences NIST CSF (Vision stratégique / Résilience)
export const exigencesNIST_CSF: Exigence[] = [
  { id: 'nist_id.am', code: 'ID.AM', description: 'Gestion des actifs', standard: 'NIST CSF' },
  { id: 'nist_id.gv', code: 'ID.GV', description: 'Gouvernance et gestion des risques', standard: 'NIST CSF' },
  { id: 'nist_pr.ac', code: 'PR.AC', description: 'Contrôle d\'identité et d\'accès', standard: 'NIST CSF' },
  { id: 'nist_pr.at', code: 'PR.AT', description: 'Sensibilisation et formation', standard: 'NIST CSF' },
  { id: 'nist_pr.ds', code: 'PR.DS', description: 'Sécurité des données', standard: 'NIST CSF' },
  { id: 'nist_de.ae', code: 'DE.AE', description: 'Détection d\'anomalies et d\'événements', standard: 'NIST CSF' },
  { id: 'nist_rs.rp', code: 'RS.RP', description: 'Planification de la réponse aux incidents', standard: 'NIST CSF' },
  { id: 'nist_rc.rp', code: 'RC.RP', description: 'Planification du rétablissement (Reprise)', standard: 'NIST CSF' },
];

// Exigences NIST SP 800-53 (Contrôles techniques détaillés)
export const exigencesNIST_800_53: Exigence[] = [
  { id: 'nist_800_ac', code: 'AC', description: 'Access Control (Contrôles techniques)', standard: 'NIST SP 800-53' },
  { id: 'nist_800_au', code: 'AU', description: 'Audit and Accountability (Logs)', standard: 'NIST SP 800-53' },
  { id: 'nist_800_cm', code: 'CM', description: 'Configuration Management', standard: 'NIST SP 800-53' },
  { id: 'nist_800_sc', code: 'SC', description: 'System and Communications Protection', standard: 'NIST SP 800-53' },
  { id: 'nist_800_si', code: 'SI', description: 'System and Information Integrity', standard: 'NIST SP 800-53' },
];

// LPM (Basé sur les règles de sécurité OIV de l'ANSSI)
export const exigencesLPM: Exigence[] = [
  { id: 'lpm_r1', code: 'Règle 1', description: 'Homologation de sécurité du SIIV', standard: 'LPM' },
  { id: 'lpm_r2', code: 'Règle 2', description: 'Cartographie du SIIV', standard: 'LPM' },
  { id: 'lpm_r5', code: 'Règle 5', description: 'Cloisonnement du SIIV', standard: 'LPM' },
  { id: 'lpm_r10', code: 'Règle 10', description: 'Utilisation de produits qualifiés (Visas de sécurité)', standard: 'LPM' },
  { id: 'lpm_r14', code: 'Règle 14', description: 'Détection des événements de sécurité (PDS)', standard: 'LPM' },
  { id: 'lpm_r19', code: 'Règle 19', description: 'Notification des incidents à l\'ANSSI', standard: 'LPM' },
];

// RGPD (Protection des données personnelles)
export const exigencesRGPD: Exigence[] = [
  { id: 'rgpd_5', code: 'Art. 5', description: 'Principes de licéité, loyauté, transparence', standard: 'RGPD' },
  { id: 'rgpd_25', code: 'Art. 25', description: 'Protection des données dès la conception (Privacy by Design)', standard: 'RGPD' },
  { id: 'rgpd_30', code: 'Art. 30', description: 'Tenue du registre des traitements', standard: 'RGPD' },
  { id: 'rgpd_32', code: 'Art. 32', description: 'Sécurité du traitement (Mesures techniques)', standard: 'RGPD' },
  { id: 'rgpd_33', code: 'Art. 33', description: 'Notification des violations de données à la CNIL', standard: 'RGPD' },
  { id: 'rgpd_35', code: 'Art. 35', description: 'Analyse d\'impact relative à la protection des données (AIPD)', standard: 'RGPD' },
];



// Toutes les exigences
export const toutesExigences: Exigence[] = [
  ...exigencesISO27001,
  ...exigencesNIST_CSF,
  ...exigencesRGPD,
];

export function getExigencesByStandard(standard: StandardSecurite): Exigence[] {
  switch (standard) {
    case 'ISO 27001:2022':
    case 'ISO 27002':
    case 'ISO 27005':
      return exigencesISO27001;
    case 'NIST CSF':
    case 'NIST SP 800-53':
      return exigencesNIST_CSF;
    case 'RGPD':
      return exigencesRGPD;
    case 'LPM':
      return [
        { id: 'lpm_1', code: 'Art. 1', description: 'Sécurité des systèmes d\'information', standard: 'LPM' },
        { id: 'lpm_2', code: 'Art. 2', description: 'Protection des OIV', standard: 'LPM' },
      ];
    default:
      return [];
  }
}

// Exemples par contexte
export const exemplesParContexte: Record<string, { missions: string[], valeurs: string[] }> = {
  'Banque & Finance': {
    missions: [
      'Assurer la sécurité des transactions financières',
      'Protéger les données clients sensibles',
      'Maintenir la disponibilité des services bancaires',
      'Garantir la conformité réglementaire'
    ],
    valeurs: [
      'Données clients (RIB, coordonnées, historique)',
      'Système de transaction électronique',
      'Infrastructure réseau sécurisée',
      'Service de consultation de compte'
    ]
  },
  'Santé & Médical': {
    missions: [
      'Protéger les données médicales confidentielles',
      'Assurer la continuité des soins',
      'Sécuriser les équipements médicaux connectés',
      'Garantir l\'intégrité des diagnostics'
    ],
    valeurs: [
      'Dossiers patients électroniques',
      'Système d\'imagerie médicale',
      'Réseau hospitalier',
      'Service de téléconsultation'
    ]
  },
  // ... autres contextes
};