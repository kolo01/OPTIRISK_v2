import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { type Analysis } from '../../types/data';
import { objectifsVisesParDefaut } from '../../data/sourcesRisqueData';
import analysisService from '../../services/analysisService';

import Atelier1 from './Atelier1';
import Atelier2 from './Atelier2';
import Atelier3 from './Atelier3';
import Atelier4 from './Atelier4';
import Atelier5 from './Atelier5';
import RapportExecutif from './RapportExecutif';

const EditAnalysis: React.FC = () => {
  const params = useParams<{ slug?: string; id?: string }>();
  const slug = params.slug ?? params.id;
  const navigate = useNavigate();

  const [currentWorkshop, setCurrentWorkshop] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [percentage,setPercentage] = useState<number>(0);

  const defaultAnalysis: Analysis = useMemo(
    () => ({
      id: '0',
      title: '',
      type: 'Nouveau projet',
      organization: '',
      analysts: [],
      status: 'Brouillon',
      userId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      workshop1: {
        config: {
          contexte: 'Banque & Finance',
          typeAnalyse: 'Nouveau projet',
          standard: 'ISO 27001:2022',
          exigencesSelectionnees: [],
          analyseSWOT: {
            forces: [],
            faiblesses: [],
            opportunites: [],
            menaces: [],
          },
          missions: [],
          valeursMetier: [],
          perimetreEtude: '',
          evenementsRedoutes: '',
          socleSecurite: '',
          ecarts: '',
        },
        missions: '',
        studyScope: '',
        businessValues: [],
      },
      workshop2: {
        objectifsVises: objectifsVisesParDefaut,
        sourcesRisque: [],
        couplesSROV: [],
        cartographie: '',
        riskSources: [],
      },
      workshop3: {
        strategicScenarios: [],
        cartographie: {
          elementsEcosysteme: [],
          menaces: [],
          scenariosStrategiques: [],
          analyseVulnerabilites: '',
          axesAttaquePrioritaires: [],
        },
      },
      workshop4: {
        supportingAssets: [],
        operationalScenarios: [],
      },
      workshop5: {
        securityMeasures: [],
        residualRisks: [],
      },
    }),
    []
  );

  const [editedAnalysis, setEditedAnalysis] = useState<Analysis>(defaultAnalysis);

  useEffect(() => {
    const load = async () => {
      if (!slug) {
        setError("Slug/ID d'analyse manquant dans l'URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await analysisService.getOneAnalyse(slug);
        if (!response?.success || !response?.data) {
          throw new Error('Analyse introuvable');
        }

        if(response.data.progress_percentage == 20){
          setCurrentWorkshop(2);
        } else if(response.data.progress_percentage == 40){
          setCurrentWorkshop(3);
        } else if(response.data.progress_percentage == 60){
          setCurrentWorkshop(4);
        }
          else if(response.data.progress_percentage == 80){
          setCurrentWorkshop(5);
        }

        setEditedAnalysis({
          ...defaultAnalysis,
          ...response.data,
          workshop1: { ...defaultAnalysis.workshop1, ...(response.data.workshop1_data ?? {}) },
          workshop2: { ...defaultAnalysis.workshop2, ...(response.data.workshop2_data ?? {}) },
          workshop3: { ...defaultAnalysis.workshop3, ...(response.data.workshop3_data ?? {}) },
          workshop4: { ...defaultAnalysis.workshop4, ...(response.data.workshop4_data ?? {}) },
          workshop5: { ...defaultAnalysis.workshop5, ...(response.data.workshop5_data ?? {}) },
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug, defaultAnalysis]);

  const updateAnalysisData = (updates: Partial<Analysis>) => {
    setEditedAnalysis((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date(),
    }));
  };

  const saveCurrentWorkshop = async () => {
    if (!slug) return;
    const workshopMap: Record<number, any> = {
      1: editedAnalysis.workshop1,
      2: editedAnalysis.workshop2,
      3: editedAnalysis.workshop3,
      4: editedAnalysis.workshop4,
      5: editedAnalysis.workshop5,
    };
    await analysisService.analyseWorkshop(slug, workshopMap[currentWorkshop], currentWorkshop);
  };

  const handleSaveAll = async () => {
    if (!slug) return;
    try {
      setSaving(true);
      await analysisService.updateAnalyse(slug, editedAnalysis);
      navigate(`/showanalysis/${slug}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (currentWorkshop <= 5) {
      await saveCurrentWorkshop();
      if (currentWorkshop < 6) setCurrentWorkshop((w) => w + 1);
      if (currentWorkshop === 5) await handleSaveAll();
    }
  };

  const handlePrevious = () => {
    if (currentWorkshop > 1) setCurrentWorkshop((w) => w - 1);
  };

  const renderCurrentWorkshop = () => {
    const props = { analysisData: editedAnalysis, updateAnalysisData };
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
        return <Atelier5 {...props} onNavigateToReports={() => {}} />;
      case 6:
        return <RapportExecutif analysisData={editedAnalysis} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-slate-200">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-slate-200">
        <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 text-slate-100">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
        <h2 className="text-2xl font-bold mb-4">Modifier l’analyse</h2>
        <p className="text-sm text-slate-400 mb-6">Slug : {slug}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input-ebios-dark w-full"
            value={editedAnalysis.title ?? ''}
            onChange={(e) => updateAnalysisData({ title: e.target.value })}
            placeholder="Titre"
          />
          <input
            className="input-ebios-dark w-full"
            value={editedAnalysis.organization ?? ''}
            onChange={(e) => updateAnalysisData({ organization: e.target.value })}
            placeholder="Organisation"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/70">
        <div className="p-6">{renderCurrentWorkshop()}</div>

        <div className="p-6 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentWorkshop === 1}
            className="btn-secondary disabled:opacity-50"
          >
            ← Précédent
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">
              {currentWorkshop === 6 ? 'Rapport Exécutif' : `Atelier ${currentWorkshop}/5`}
            </span>
            {currentWorkshop < 6 && (
              <button
                onClick={handleNext}
                disabled={saving}
                className="btn-primary disabled:opacity-50 flex items-center gap-2"
              >
                <span>{currentWorkshop === 5 ? 'Rapport Exécutif' : 'Atelier suivant'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAnalysis;