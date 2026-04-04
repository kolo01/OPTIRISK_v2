# Suivi des critiques client — OPTIRISK v2

## Légende
- [ ] À faire
- [~] En cours
- [x] Terminé

---

## Critique 1 — Rapports

- [x] **Rapport exécutif** : nouveau composant `RapportExecutif.tsx` ajouté comme étape 6 après Atelier 5, contient la Matrice des risques colorée issue d'Atelier 4
- [x] **Atelier 5** : la Matrice de priorisation reste dans l'onglet "Tableau de bord" d'Atelier 5

---

## Critique 2 — UI / Navigation / Profil

- [x] **Header** : suppression des icônes **Paramètres** et **Aide** (desktop + mobile + dropdown)
- [x] **Profil administrateur / utilisateur** : suppression de la section **Zone de danger**
- [x] **Bug photo de profil** : la mise à jour de l'avatar émet maintenant un événement `avatar-updated` capté par le Header pour rafraîchir l'affichage immédiatement
- [x] **Imports inutilisés** : `Settings`, `HelpCircle` retirés de Sidebar et Header

---

## Critique 3 — Ateliers : ajouts de champs / fonctionnalités

- [x] **Atelier 1 — Socle de sécurité** : section unifiée avec les champs **Socle défini**, **État identifié** (select), **Périmètre** et **Événements redoutés** — ancienne section 4 redondante supprimée
- [x] **Atelier 3 — Source de risque** : bouton **Générer avec IA** ajouté sur le champ "Chemin d'attaque" — génère automatiquement à partir de la valeur métier sélectionnée + la source de risque
- [x] **Atelier 4 — Scénario opérationnel** : champ **Mode opératoire détaillé** doté d'un label explicite et d'un placeholder descriptif
- [x] **Atelier 5** : onglet **Risque résiduel** affiché par défaut à l'ouverture

---

## Critique 5 — Atelier 4 : Bien support

- [x] **Atelier 4 — Ajouter un bien support** : formulaire nettoyé avec labels explicites pour :
  - Nom du bien
  - Type de bien
  - Localisation
  - Niveau de Criticité
  - (Champ description masqué du formulaire, conservé dans le state pour la compatibilité des données)

---

## Notes
- Critique 4 : non reçue

