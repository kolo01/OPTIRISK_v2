// src/components/Analysis/AnalysisTab.tsx
import React, { useState } from "react";
import {
  ChevronRight,
  Users,
  Save,
  AlertCircle,
  Eye,
  EyeOff,
  Bell,
  Plus,
} from "lucide-react";
import { type Analysis } from "../../types/data";

// TES COMPOSANTS D'ATELIERS
import Atelier1 from "./Atelier1";
import Atelier2 from "./Atelier2";
import Atelier3 from "./Atelier3";
import Atelier4 from "./Atelier4";
import Atelier5 from "./Atelier5";
import { objectifsVisesParDefaut } from "../../data/sourcesRisqueData";
import analysisService from "../../services/analysisService";
import { useNavigate } from "react-router-dom";

const AnalysisTab: React.FC = () => {
  // Fonctions de navigation
  const onNavigateToReports = () => {
    console.log("Navigation vers rapports");
  };

  const onNavigateToPricing = () => {
    console.log("Navigation vers tarifs");
  };

  // États
  const [currentWorkshop, setCurrentWorkshop] = useState(0);
  const [showValidation, setShowValidation] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Simulation d'authentification
  const user = { id: "1", email: "test@test.com", name: "Utilisateur Test" };

  // État principal des données
  const [analysisData, setAnalysisData] = useState<Analysis>({
    id: "0",
    title: "",
    type: "Nouveau projet",
    organization: "",
    analysts: [],
    status: "Brouillon",
    userId: user?.id || "",
    createdAt: new Date(),
    updatedAt: new Date(),

    // Atelier 1
    workshop1: {
      config: {
        contexte: "Banque & Finance",
        typeAnalyse: "Nouveau projet",
        standard: "ISO 27001:2022",
        exigencesSelectionnees: [],
        analyseSWOT: {
          forces: [],
          faiblesses: [],
          opportunites: [],
          menaces: [],
        },
        missions: [],
        valeursMetier: [],
        perimetreEtude: "",
        evenementsRedoutes: "",
        socleSecurite: "",
        ecarts: "",
      },
      missions: "",
      studyScope: "",
      businessValues: [],
    },
    // Atelier 2
    workshop2: {
      objectifsVises: objectifsVisesParDefaut,
      sourcesRisque: [],
      couplesSROV: [],
      cartographie: "",
      riskSources: [],
    },
    // Atelier 3
    workshop3: {
      strategicScenarios: [],
      cartographie: {
        elementsEcosysteme: [],
        menaces: [],
        scenariosStrategiques: [],
        analyseVulnerabilites: "",
        axesAttaquePrioritaires: [],
      },
    },
    // Atelier 4
    workshop4: {
      supportingAssets: [],
      operationalScenarios: [],
    },
    // Atelier 5
    workshop5: {
      securityMeasures: [],
      residualRisks: [],
    },
  });

  const workshopTitles = [
    "Cadrage et Socle de Sécurité",
    "Sources de Risque",
    "Scénarios Stratégiques",
    "Scénarios Opérationnels",
    "Traitement du Risque",
  ];

  const workshopDescriptions = [
    "Définir le contexte, le périmètre et établir le socle de sécurité",
    "Identifier et caractériser les sources de risque et leurs objectifs",
    "Élaborer des scénarios de haut niveau incluant l'écosystème",
    "Définir les modes opératoires techniques et évaluer la vraisemblance",
    "Synthétiser les risques et définir les mesures de traitement",
  ];

  const workshopColors = [
    "border-blue-500 bg-blue-900/20",
    "border-purple-500 bg-purple-900/20",
    "border-green-500 bg-green-900/20",
    "border-orange-500 bg-orange-900/20",
    "border-red-500 bg-red-900/20",
  ];

  // Fonction de notification
  const addNotification = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
  ) => {
    const newNotification = `[${new Date().toLocaleTimeString()}] ${message}`;
    setNotifications((prev) => [newNotification, ...prev].slice(0, 5));

    console.log(`[${type}] ${message}`);

    // Notification visuelle
    const notificationEl = document.createElement("div");
    notificationEl.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 animate-fade-in ${
      type === "success"
        ? "bg-green-600"
        : type === "error"
          ? "bg-red-600"
          : type === "warning"
            ? "bg-yellow-600"
            : "bg-blue-600"
    } text-white`;
    notificationEl.textContent = message;
    document.body.appendChild(notificationEl);

    setTimeout(() => {
      notificationEl.classList.add("animate-fade-out");
      setTimeout(() => document.body.removeChild(notificationEl), 300);
    }, 3000);
  };

  // Audit
  const AuditLogger = {
    log: (userId: string, action: string, details: string) => {
      console.log(`AUDIT - ${action}: ${details}`);
    },
  };

  // Service d'analyse
  const [slug, setSlug] = useState("");
  const AnalysisService = {
    createAnalysis: async (data: any) => {
      console.log("Création analyse:", data);
      const response = await analysisService.initialiseAnalysis(data);
      console.log(response);
      setSlug(response.data.slug);
      // return { ...data, id: "temp-" + Date.now() };
      setCurrentWorkshop(currentWorkshop + 1);
      addNotification(
        "Analyse créée avec succès\n, passage à l'atelier 1",
        "success",
      );
      return [...data, { id: response.data.id }];
    },
    updateAnalysis: async (id: string, data: any) => {
      console.log("Mise à jour analyse:", id, data);
      return data;
    },

    lastUpdate: async (slug: any, data: any) => {
      if (currentWorkshop == 5) {
        const response = await analysisService.updateAnalyse(slug, data);
        console.log(response);
      }
    },
  };

  const updateAnalysisData = (updates: Partial<Analysis>) => {
    const updatedData = {
      ...analysisData,
      ...updates,
      userId: user?.id || "",
      updatedAt: new Date(),
    };
    setAnalysisData(updatedData);
    AuditLogger.log(
      user?.id || "unknown",
      "ANALYSIS_UPDATED",
      `Atelier ${currentWorkshop} mis à jour`,
    );
  };

  const updateAnalysts = (analysts: string[]) => {
    updateAnalysisData({ analysts });
  };

  const addAnalyst = () => {
    if (analysisData.analysts.length === 0) {
      updateAnalysts([""]);
    } else {
      updateAnalysts([...analysisData.analysts, ""]);
    }
  };

  const removeAnalyst = (index: number) => {
    if (analysisData.analysts.length > 0) {
      const newAnalysts = analysisData.analysts.filter((_, i) => i !== index);
      updateAnalysts(newAnalysts);
    }
  };

  const updateAnalyst = (index: number, value: string) => {
    const newAnalysts = [...analysisData.analysts];
    newAnalysts[index] = value;
    updateAnalysts(newAnalysts);
  };

  const navigate = useNavigate();
  const handleNext = () => {
    if (currentWorkshop < 5) {
      analysisData.id = currentWorkshop.toString();
      if (currentWorkshop === 1) {
        analysisService.analyseWorkshop(
          slug,
          analysisData.workshop1,
          currentWorkshop,
        );
        setCurrentWorkshop(currentWorkshop + 1);
        addNotification(`Passage à l'atelier ${currentWorkshop + 1}`, "info");
      } else if (currentWorkshop === 2) {
        analysisService.analyseWorkshop(
          slug,
          analysisData.workshop2,
          currentWorkshop,
        );
        setCurrentWorkshop(currentWorkshop + 1);
        addNotification(`Passage à l'atelier ${currentWorkshop + 1}`, "info");
      } else if (currentWorkshop === 3) {
        analysisService.analyseWorkshop(
          slug,
          analysisData.workshop3,
          currentWorkshop,
        );
        setCurrentWorkshop(currentWorkshop + 1);
        addNotification(`Passage à l'atelier ${currentWorkshop + 1}`, "info");
      } else if (currentWorkshop === 4) {
        analysisService.analyseWorkshop(
          slug,
          analysisData.workshop4,
          currentWorkshop,
        );
        setCurrentWorkshop(currentWorkshop + 1);
        addNotification(`Passage à l'atelier ${currentWorkshop + 1}`, "info");
      }
    }
    if (currentWorkshop === 5) {
      analysisService.analyseWorkshop(
        slug,
        analysisData.workshop5,
        currentWorkshop,
      );
      addNotification(`Atelier 5 terminé. Analyse complète!`, "success");
      // navigate("/analysis")
    }
  };
  const handlePrevious = () => {
    if (currentWorkshop > 0) {
      setCurrentWorkshop(currentWorkshop - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentWorkshop) {
      case 1:
        let completed = 0;
        if (
          analysisData.workshop1.config.contexte &&
          analysisData.workshop1.config.contexte.length > 0
        ) {
          completed++;
        }
        if (
          analysisData.workshop1.config.standard &&
          analysisData.workshop1.config.standard.length > 0
        ) {
          completed++;
        }
      case 2:
        return analysisData.workshop2.sourcesRisque.length > 0;
      case 3:
        return analysisData.workshop3.strategicScenarios.length > 0;
      case 4:
        return analysisData.workshop4.supportingAssets.length > 0;
      default:
        return true;
    }
  };

  const validateCurrentWorkshop = () => {
    const validationMessages = {
      1: "Atelier 1 validé : Contexte, standard et analystes définis",
      2: "Atelier 2 validé : Sources de risque identifiées",
      3: "Atelier 3 validé : Scénarios stratégiques élaborés",
      4: "Atelier 4 validé : Scénarios opérationnels définis",
      5: "Atelier 5 validé : Plan de traitement établi",
    };

    const message =
      validationMessages[currentWorkshop as keyof typeof validationMessages] ||
      "Atelier validé";
    addNotification(message, "success");
    setShowValidation(true);

    setTimeout(() => setShowValidation(false), 2000);
  };

  const saveAnalysis = () => {
    if (!user) {
      // addNotification("Veuillez vous connecter", "error");
      return;
    }

    if (analysisData.id === "0") {
      // Créer une nouvelle analyse
      AnalysisService.createAnalysis({
        title: analysisData.title,
        organization: analysisData.organization,
        analysts: analysisData.analysts,
        context: analysisData.workshop1.config.contexte,
        type: analysisData.type,
      }).then((result: any) => {
        if (result) {
          setAnalysisData(result);
          addNotification("Analyse créée avec succès", "success");
        } else {
          addNotification("Erreur lors de la création", "error");
        }
      });
    } else {
      // Mettre à jour l'analyse existante
      AnalysisService.updateAnalysis(analysisData.id, analysisData).then(
        (result) => {
          if (result) {
            setAnalysisData(result);
            addNotification("Analyse sauvegardée", "success");
          } else {
            addNotification("Erreur lors de la sauvegarde", "error");
          }
        },
      );
    }
  };

  const renderCurrentWorkshop = () => {
    const props = {
      analysisData,
      updateAnalysisData,
    };

    switch (currentWorkshop) {
      case 1:
        return <Atelier1 {...props} />;
      case 2:
        return <Atelier2 {...props} />;
      case 3:
        return <Atelier3 {...props} />;
      case 4:
        return <Atelier4 {...props} />;
      case 5:
        return (
          <Atelier5 {...props} onNavigateToReports={onNavigateToReports} />
        );
      default:
        return <></>;
    }
  };

  // Composant TokenWarning amélioré
  const TokenWarning = () => (
    <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg mb-4">
      <div className="flex items-start">
        <div className="py-1">
          <AlertCircle className="fill-current h-5 w-5 text-yellow-400 mr-3" />
        </div>
        <div>
          <p className="font-bold">Version de démonstration EBIOS RM</p>
          <p className="text-sm mt-1">
            Fonctionnalités limitées. Accédez à la version complète pour :
            <ul className="list-disc list-inside ml-4 mt-1 text-xs">
              <li>Export PDF des rapports</li>
              <li>Collaboration en temps réel</li>
              <li>Base de données de menaces</li>
              <li>Analyses comparatives</li>
            </ul>
          </p>
          <button
            onClick={onNavigateToPricing}
            className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium transition"
          >
            Voir les offres premium
          </button>
        </div>
      </div>
    </div>
  );

  // Indicateur de progression
  const getProgressPercentage = () => {
    let completed = 0;
    const totalChecks = 5;
    console.log("Calcul progression:", {
      contexte: analysisData.workshop1.config.contexte,
      standard: analysisData.workshop1.config.standard,
      sourcesRisque: analysisData.workshop2.sourcesRisque,
      strategicScenarios: analysisData.workshop3.strategicScenarios,
    });

    if (
      analysisData.workshop1.config.contexte &&
      currentWorkshop < 0 &&
      analysisData.workshop1.config.contexte.length > 0
    )
      completed++;
    if (
      analysisData.workshop1.config.standard &&
      currentWorkshop < 0 &&
      analysisData.workshop1.config.standard.length > 0
    )
      completed++;
    if (analysisData.workshop2.sourcesRisque.length > 0) completed++;
    if (analysisData.workshop3.strategicScenarios.length > 0) completed++;
    if (analysisData.workshop4.supportingAssets.length > 0) completed++;

    return (completed / totalChecks) * 100;
  };

  const [displayAnalyse, setDisplayAnalyse] = useState(false);

  const toggleAnalyseDisplay = () => {
    setDisplayAnalyse((prev) => !prev);
  };

  // Types d'analyse
  const typesAnalyse = [
    {
      value: "Nouveau projet",
      description: "Analyse pour un nouveau projet ou système",
    },
    {
      value: "Changement majeur",
      description: "Modification significative d'un système existant",
    },
    {
      value: "Revue annuelle",
      description: "Révision périodique de l'analyse des risques",
    },
    {
      value: "Analyse générale IT",
      description: "Évaluation générale du paysage de risques IT",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* En-tête principal */}
      {currentWorkshop === 0 && (
        <div className="ebios-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">
                Analyse EBIOS Risk Manager
              </h1>
              <p className="text-slate-400 mt-1">
                Méthode d'appréciation et de traitement des risques numériques
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* <button
                onClick={() =>
                  addNotification("Mode validation activé", "info")
                }
                className="btn-secondary flex items-center space-x-2"
              >
                {showValidation ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span>Validation</span>
              </button> */}
              <button
                onClick={saveAnalysis}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Passer aux ateliers</span>
              </button>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-300">
                Progression globale
              </span>
              <span className="text-sm text-slate-400">
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Informations de base */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Titre de l'analyse *
              </label>
              <input
                type="text"
                value={analysisData.title}
                onChange={(e) => updateAnalysisData({ title: e.target.value })}
                className="input-ebios-dark w-full"
                placeholder="Ex: Analyse sécurité système bancaire 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Organisation *
              </label>
              <input
                type="text"
                value={analysisData.organization}
                onChange={(e) =>
                  updateAnalysisData({ organization: e.target.value })
                }
                className="input-ebios-dark w-full"
                placeholder="Ex: Banque Nationale SA"
              />
            </div>
          </div>

          {/* Contexte */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Contexte professionnel *
            </label>
            <select
              value={analysisData.workshop1.config.contexte || ""}
              onChange={(e) =>
                updateAnalysisData({
                  workshop1: {
                    ...analysisData.workshop1,
                    config: {
                      ...analysisData.workshop1.config,
                      contexte: e.target.value as any,
                    },
                  },
                })
              }
              className="input-ebios-dark w-full"
            >
              <option value="Banque & Finance">🏦 Banque & Finance</option>
              <option value="Santé & Médical">🏥 Santé & Médical</option>
              <option value="Énergie & Utilities">
                ⚡ Énergie & Utilities
              </option>
              <option value="Transport & Logistique">
                🚚 Transport & Logistique
              </option>
              <option value="Industrie & Manufacturing">
                🏭 Industrie & Manufacturing
              </option>
              <option value="Public & Administration">
                🏛️ Public & Administration
              </option>
              <option value="IT & Technologie">💻 IT & Technologie</option>
              <option value="Autre">🔧 Autre</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Type d'analyse *
            </label>
            <select
              value={analysisData.type || ""}
              onChange={(e) =>
                analysisData.id === "0" &&
                updateAnalysisData({ type: e.target.value as any })
              }
              className="input-ebios-dark w-full"
            >
              {typesAnalyse.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.value} - {type.description}
                </option>
              ))}
            </select>
          </div>

          {/* Analystes */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-400" />
                <label className="block text-sm font-medium text-slate-200">
                  Analystes assignés *
                </label>
              </div>
              <button onClick={addAnalyst} className="btn-secondary text-sm">
                + Ajouter analyste
              </button>
            </div>

            <div className="space-y-2">
              {analysisData.analysts.map((analyst, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-sm">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={analyst}
                    onChange={(e) => updateAnalyst(index, e.target.value)}
                    className="input-ebios-dark flex-1"
                    placeholder="Nom et prénom de l'analyste"
                  />
                  {analysisData.analysts.length > 1 && (
                    <button
                      onClick={() => removeAnalyst(index)}
                      className="text-red-400 hover:text-red-300 px-2 py-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {analysisData.analysts.length === 0 && (
                <div className="text-center py-4 border border-dashed border-slate-600 rounded-lg">
                  <p className="text-slate-500 text-sm">
                    Aucun analyste assigné
                  </p>
                  <button
                    onClick={addAnalyst}
                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    + Cliquez pour ajouter le premier analyste
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation ateliers - VERSION AMÉLIORÉE */}
          {currentWorkshop > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">
                Ateliers EBIOS RM
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {workshopTitles.map((title, index) => (
                  <div key={index} className="relative">
                    <button
                      onClick={() => setCurrentWorkshop(index + 1)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        currentWorkshop === index + 1
                          ? `${workshopColors[index]} scale-[1.02] shadow-lg`
                          : "border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            currentWorkshop === index + 1
                              ? "bg-white text-slate-900"
                              : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-100">
                            {title}
                          </div>
                          <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {workshopDescriptions[index]}
                          </div>
                        </div>
                      </div>

                      {/* Indicateur de statut */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-slate-500">
                          {index + 1 === currentWorkshop
                            ? "En cours"
                            : "À venir"}
                        </div>
                        {currentWorkshop > index + 1 && (
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        )}
                      </div>
                    </button>

                    {currentWorkshop === index + 1 && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-500"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notifications rapides */}
      {/* {notifications.length > 0 && (
        <div className="ebios-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-medium text-slate-200">Notifications récentes</h3>
            </div>
            <button
              onClick={() => setNotifications([])}
              className="text-xs text-slate-500 hover:text-slate-400"
            >
              Effacer tout
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {notifications.map((notification, index) => (
              <div key={index} className="text-xs p-2 bg-slate-800/50 rounded border border-slate-700">
                {notification}
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Contenu atelier actuel */}
      {currentWorkshop > 0 && (
        <div className="ebios-card">
          {/* <div className={`p-6 border-b border-slate-700 ${workshopColors[currentWorkshop - 1].split(' ')[0].replace('border-', 'border-')}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  workshopColors[currentWorkshop - 1].split(' ')[0].replace('border-', 'bg-')
                }`}>
                  <span className="font-bold text-white">{currentWorkshop}</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Atelier {currentWorkshop} - {workshopTitles[currentWorkshop - 1]}
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    {workshopDescriptions[currentWorkshop - 1]}
                  </p>
                </div>
              </div>
            </div>
            
            {showValidation && (
              <div className="animate-pulse">
                <div className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-medium border border-green-700">
                  ✓ Validation activée
                </div>
              </div>
            )}
          </div>
        </div> */}

          <div className="p-6">{renderCurrentWorkshop()}</div>

          {/* Navigation bas - VERSION AMÉLIORÉE */}

          <div className="p-6 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevious}
                disabled={currentWorkshop === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Précédent
              </button>

              {/* <button
                onClick={validateCurrentWorkshop}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
              >
                <span>Valider cet atelier</span>
              </button> */}
            </div>

            <div className="flex items-center space-x-4">
              {currentWorkshop < 5 && (
                <div className="flex items-center text-yellow-500 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span>Complétez cet atelier avant de continuer</span>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-400">
                  Atelier {currentWorkshop}/5
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentWorkshop > 6}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>
                    {currentWorkshop === 5 ? "Terminer" : "Atelier suivant"}
                  </span>
                  {currentWorkshop < 5 && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pied de page */}
      <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-800">
        <p>
          Méthode EBIOS Risk Manager - ANSSI • Version 1.1 •
          <span className="mx-2">|</span>
          Dernière sauvegarde :{" "}
          {analysisData?.updatedAt
            ? analysisData?.updatedAt?.toLocaleTimeString()
            : "N/A"}
          <span className="mx-2">|</span>
          Statut : <span className="text-blue-400">{analysisData?.status}</span>
        </p>
      </div>
    </div>
  );
};

export default AnalysisTab;
