// src/data/atelier3Data.ts
import { type EcosystemeElement, type Menace } from '../types/data';

// Éléments d'écosystème par contexte
export const ecosystemeParContexte: Record<string, Partial<EcosystemeElement>[]> = {
  'Banque & Finance': [
    { type: 'Système', nom: 'Core Banking', description: 'Système bancaire central', criticite: 'Critique' },
    { type: 'Application', nom: 'Application Mobile', description: 'Appli bancaire clients', criticite: 'Élevée' },
    { type: 'Réseau', nom: 'Réseau interagences', description: 'Connexion entre agences', criticite: 'Élevée' },
    { type: 'Donnée', nom: 'Base clients', description: 'Données personnelles clients', criticite: 'Critique' },
    { type: 'Processus', nom: 'Validation transaction', description: 'Processus d\'approbation', criticite: 'Critique' },
    { type: 'Acteur', nom: 'Conseiller clientèle', description: 'Personnel en contact client', criticite: 'Moyenne' },
  ],
  'Santé & Médical': [
    { type: 'Système', nom: 'DMP/DOS', description: 'Dossier patient numérique', criticite: 'Critique' },
    { type: 'Application', nom: 'Logiciel imagerie', description: 'Logiciel de diagnostic', criticite: 'Élevée' },
    { type: 'Réseau', nom: 'Réseau médical', description: 'Réseau interne hôpital', criticite: 'Élevée' },
    { type: 'Donnée', nom: 'Données patients', description: 'Informations médicales', criticite: 'Critique' },
    { type: 'Processus', nom: 'Circuit patient', description: 'Parcours de soins', criticite: 'Élevée' },
    { type: 'Acteur', nom: 'Personnel soignant', description: 'Médecins, infirmiers', criticite: 'Moyenne' },
  ],
  // ... autres contextes
};

// Menaces standards
export const menacesStandards: Partial<Menace>[] = [
  { 
    nom: 'Attaque par ransomware', 
    categorie: 'Cyber', 
    vecteurs: ['Phishing', 'Vulnérabilités non patchées', 'Accès distant compromis'],
    impactPotentiel: 'Chiffrement des données, interruption de service, demande rançon',
    tendance: 'Croissante'
  },
  { 
    nom: 'Fuites de données', 
    categorie: 'Cyber', 
    vecteurs: ['Configuration incorrecte', 'Accès non autorisé', 'Insider threat'],
    impactPotentiel: 'Divulgation de données sensibles, sanctions RGPD, perte de confiance',
    tendance: 'Stable'
  },
  { 
    nom: 'Ingénierie sociale', 
    categorie: 'Humaine', 
    vecteurs: ['Phishing ciblé', 'Vishing', 'Usurpation d\'identité'],
    impactPotentiel: 'Accès non autorisé, divulgation d\'informations, fraude',
    tendance: 'Stable'
  },
  { 
    nom: 'DDoS', 
    categorie: 'Cyber', 
    vecteurs: ['Botnets', 'Amplification DNS', 'Attaques volumétriques'],
    impactPotentiel: 'Indisponibilité des services, perte de revenus, atteinte à l\'image',
    tendance: 'Croissante'
  },
  { 
    nom: 'Menace interne', 
    categorie: 'Humaine', 
    vecteurs: ['Employé malveillant', 'Négligence', 'Erreur humaine'],
    impactPotentiel: 'Vol de données, sabotage, non-conformité',
    tendance: 'Stable'
  },
];

// Vecteurs d'attaque possibles
export const vecteursAttaque = [
  'Phishing/Spam',
  'Exploitation de vulnérabilités',
  'Ingénierie sociale',
  'Malware',
  'Accès physique non autorisé',
  'Attaque par force brute',
  'DDoS',
  'Insider threat',
  'Supply chain attack',
  'Zero-day exploit'
];

// Chemins d'attaque typiques
export const cheminsAttaque = [
  'Reconnaissance → Initial Access → Persistence → Privilege Escalation → Lateral Movement → Exfiltration',
  'Phishing → Malware → Chiffrement → Demande rançon',
  'Exploitation vulnérabilité → Accès initial → Mouvement latéral → Accès données critiques',
  'Compromission compte → Accès légitime → Exfiltration données → Dissimulation traces',
  'Attaque DDoS → Surcharge système → Indisponibilité service → Impact financier'
];