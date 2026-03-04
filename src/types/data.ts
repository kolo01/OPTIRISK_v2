// src/types/data.ts

// === TYPES DE BASE ===
export type ContextType = 
  | 'PME' 
  | 'École' 
  | 'Domicile' 
  | 'Industrie' 
  | 'Autre';

export type ContexteProfessionnel = 
  | 'Banque & Finance'
  | 'Santé & Médical'
  | 'Énergie & Utilities'
  | 'Transport & Logistique'
  | 'Industrie & Manufacturing'
  | 'Public & Administration'
  | 'IT & Technologie'
  | 'Autre';

export type TypeAnalyse = 
  | 'Nouveau projet'
  | 'Changement majeur'
  | 'Revue annuelle'
  | 'Analyse générale IT';

export type StandardSecurite = 
  | 'ISO 27001:2022'
  | 'ISO 27002'
  | 'ISO 27005'
  | 'NIST CSF'
  | 'NIST SP 800-53'
  | 'RGPD'
  | 'LPM'
  | 'Autre';

// === ATELIER 1 - TYPES ===
export interface Exigence {
  id: string;
  code: string;
  description: string;
  standard: StandardSecurite;
}

export interface AnalyseSWOT {
  forces: string[];
  faiblesses: string[];
  opportunites: string[];
  menaces: string[];
}

export interface Mission {
  id: string;
  description: string;
  responsable: string;
}

export interface ValeurMetier {
  id: string;
  nom: string;
  description: string;
  criticite: 'Faible' | 'Moyenne' | 'Élevée' | 'Critique';
  type: 'Information' | 'Processus' | 'Service' | 'Infrastructure';
}

export interface BusinessValue {
  id: string;
  name: string;
  type: 'information' | 'processus' | 'service' | 'autre';
  description: string;
  responsible: string;
  criticality: 'Faible' | 'Moyenne' | 'Élevée' | 'Critique';
  gravity: string;
}

export interface Atelier1Config {
  contexte: ContexteProfessionnel;
  contextePersonnalise?: string;
  typeAnalyse: TypeAnalyse;
  standard: StandardSecurite;
  standardPersonnalise?: string;
  exigencesSelectionnees: string[]; // IDs des exigences
  analyseSWOT: AnalyseSWOT;
  missions: Mission[];
  valeursMetier: ValeurMetier[];
  perimetreEtude: string;
  evenementsRedoutes: string;
  socleSecurite: string;
  ecarts: string;
}

export interface Workshop1Data {
  config: Atelier1Config;
  missions: string;
  studyScope: string;
  businessValues: BusinessValue[];
}

// === ATELIER 2 - TYPES ===
export interface ObjectifVise {
  id: string;
  nom: string;
  description: string;
  categorie: 'Confidentialité' | 'Intégrité' | 'Disponibilité' | 'Traçabilité' | 'Conformité' | 'Autre';
}

export interface SourceRisque {
  id: string;
  nom: string;
  description: string;
  type: 'Humain' | 'Technique' | 'Organisationnel' | 'Naturel' | 'Externe';
  motivation: string; // Motif de l'attaquant
  capacites: string[]; // Capacités techniques/organisationnelles
  historique: string; // Antécédents connus
  objectifsVises: string[]; // IDs des objectifs visés
  pertinence: number; // 1-5
  justification: string; // Pourquoi cette source est pertinente
}

export interface CoupleSROV {
  id: string;
  sourceRisqueId: string;
  objectifViseId: string;
  pertinence: number; // 1-5
  commentaire: string;
}

export interface Workshop2Data {
  riskSources: any;
  objectifsVises: ObjectifVise[];
  sourcesRisque: SourceRisque[];
  couplesSROV: CoupleSROV[];
  cartographie: string; // Description de la cartographie
}

// === ATELIER 3 - TYPES ===
export interface Stakeholder {
  id: string;
  name: string;
  exposure: number;
  reliability: number;
  threatLevel: number;
}

export interface StrategicScenario {
  id: string;
  title: string;
  targetBusinessValue: string;
  riskSource: string;
  attackPath: string;
  fearedEvent: string;
  gravity: string;
  stakeholders: Stakeholder[];
}

export interface EcosystemeElement {
  id: string;
  type: 'Système' | 'Réseau' | 'Application' | 'Donnée' | 'Processus' | 'Acteur';
  nom: string;
  description: string;
  criticite: 'Faible' | 'Moyenne' | 'Élevée' | 'Critique';
  liens: string[]; // IDs d'autres éléments connectés
}

export interface Menace {
  id: string;
  nom: string;
  description: string;
  categorie: 'Cyber' | 'Physique' | 'Humaine' | 'Organisationnelle' | 'Naturelle';
  vecteurs: string[]; // Vecteurs d'attaque possibles
  impactPotentiel: string;
  tendance: 'Stable' | 'Croissante' | 'Décroissante' | 'Nouvelle';
  sourceRisqueId?: string; // Liée à une source de l'atelier 2
  objectifViseId?: string; // Liée à un objectif de l'atelier 2
}

export interface ScenarioStrategique {
  id: string;
  titre: string;
  description: string;
  sourceRisqueId: string;
  objectifViseId: string;
  menaceId: string;
  cheminAttaque: string; // Description du chemin d'attaque
  valeursMetierImpactees: string[]; // IDs des valeurs métier de l'atelier 1
  gravite: number; // 1-5
  probabilite: number; // 1-5
  niveauRisque: number; // Calculé: gravite × probabilite
  mesuresExistantes: string;
  ecarts: string;
  mesuresProposees: string[];
}

export interface CartographieMenace {
  elementsEcosysteme: EcosystemeElement[];
  menaces: Menace[];
  scenariosStrategiques: ScenarioStrategique[];
  analyseVulnerabilites: string;
  axesAttaquePrioritaires: string[];
}

export interface Workshop3Data {
  strategicScenarios: StrategicScenario[];
  cartographie: CartographieMenace;
}

// === ATELIER 4 - TYPES ===
export interface SupportingAsset {
  id: string;
  name: string;
  type: 'serveur' | 'application' | 'equipement' | 'reseau' | 'donnee' | 'autre';
  description: string;
  location: string;
  criticality: 'Faible' | 'Moyenne' | 'Élevée' | 'Critique';
}

export interface OperationalScenario {
  id: string;
  title: string;
  linkedStrategicScenario: string;
  operatingMode: string;
  likelihood: 'Très faible' | 'Faible' | 'Moyenne' | 'Élevée' | 'Très élevée';
  supportingAssets: string[];
}

export interface Workshop4Data {
  supportingAssets: SupportingAsset[];
  operationalScenarios: OperationalScenario[];
}

// === ATELIER 5 - TYPES ===
export interface SecurityMeasure {
  id: string;
  title: string;
  description: string;
  category: 'technique' | 'organisationnelle' | 'juridique' | 'autre';
  priority: 'Faible' | 'Moyenne' | 'Élevée' | 'Critique';
  cost: string;
  deadline: Date;
  responsible: string;
  status: 'À faire' | 'En cours' | 'Terminé' | 'Reporté';
}

export interface RiskResidual {
  id: string;
  name: string;
  originalRisk: string;
  currentRisk: 'Faible' | 'Moyen' | 'Élevé' | 'Critique';
  justification: string;
  monitoringPlan: string;
  acceptance: 'Accepté' | 'Conditionnel' | 'Non accepté';
  creationDate: string;
  lastReview: string;
  reviewFrequency: 'Mensuel' | 'Trimestriel' | 'Semestriel' | 'Annuel';
}

export interface Workshop5Data {
  securityMeasures: SecurityMeasure[];
  residualRisks: RiskResidual[];
}

// === INTERFACE PRINCIPALE ===
export interface Analysis {
  id: string;
  title: string;
  organization: string;
  analysts: string[];
  status: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Atelier 1
  workshop1: Workshop1Data;
  
  // Atelier 2
  workshop2: Workshop2Data;
  
  // Atelier 3
  workshop3: Workshop3Data;
  
  // Atelier 4
  workshop4: Workshop4Data;
  
  // Atelier 5
  workshop5: Workshop5Data;
}