import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import analysisService from '../../services/analysisService';

const ShowAnalysis: React.FC = () => {
    const params = useParams<{ slug?: string;}>();
    const slug = params.slug; // supporte /:slug et /:id

    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            setError("Slug/ID d'analyse manquant dans l'URL.");
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await analysisService.getOneAnalyse(slug);

                if (!response?.success) {
                    throw new Error('Erreur API');
                }

                if (!cancelled) {
                    setAnalysis(response.data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Erreur inconnue');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchAnalysis();

        return () => {
            cancelled = true;
        };
    }, [slug]);

    const formatLabel = (key: string) =>
        key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/^./, (c) => c.toUpperCase());

    const renderValue = (value: any): React.ReactNode => {
        if (value === null || value === undefined || value === '') {
            return <span className="text-slate-400">-</span>;
        }

        if (Array.isArray(value)) {
            if (!value.length) return <span className="text-slate-400">Aucune donnée</span>;
            return (
                <ul className="list-disc ml-5 space-y-1">
                    {value.map((item, index) => (
                        <li key={index}>{renderValue(item)}</li>
                    ))}
                </ul>
            );
        }

        if (value instanceof Date) {
            return value.toLocaleDateString();
        }

        if (typeof value === 'object') {
            return (
                <div className="space-y-2">
                    {Object.entries(value).map(([k, v]) => (
                        <div key={k} className="rounded-lg bg-slate-900/40 border border-slate-700 p-2">
                            <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">{formatLabel(k)}</p>
                            <div className="text-sm text-slate-100">{renderValue(v)}</div>
                        </div>
                    ))}
                </div>
            );
        }

        if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
        return String(value);
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="animate-pulse rounded-2xl border border-slate-700 bg-slate-900 p-6">
                    <div className="h-7 w-56 bg-slate-700 rounded mb-6" />
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-slate-700 rounded" />
                        <div className="h-4 w-5/6 bg-slate-700 rounded" />
                        <div className="h-4 w-2/3 bg-slate-700 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="rounded-2xl border border-red-500/40 bg-red-950/40 text-red-200 p-4">
                    <span className="font-semibold">Erreur :</span> {error}
                </div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="rounded-2xl border border-slate-700 bg-slate-900 text-slate-200 p-4">
                    Aucune analyse trouvée.
                </div>
            </div>
        );
    }

    const workshopEntries = Object.entries(analysis)
        .filter(([key, value]) => key.toLowerCase().startsWith('workshop') && value)
        .sort(([a], [b]) => {
            const na = Number(a.replace(/\D/g, '')) || 0;
            const nb = Number(b.replace(/\D/g, '')) || 0;
            return na - nb;
        });

    const analystsText = Array.isArray(analysis.analysts)
        ? analysis.analysts.join(', ')
        : typeof analysis.analysts === 'string'
        ? analysis.analysts
        : '-';

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="rounded-2xl border border-slate-700 bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 shadow-xl">
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-2xl font-bold tracking-tight">Détails de l'analyse</h2>
                    <p className="text-sm text-slate-400 mt-1">Slug : {slug}</p>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-slate-800/70 border border-slate-700 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Titre</p>
                        <p className="mt-1 font-medium">{analysis.title || '-'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-800/70 border border-slate-700 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Organisation</p>
                        <p className="mt-1 font-medium">{analysis.organization || '-'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-800/70 border border-slate-700 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Statut</p>
                        <span className="inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            {analysis.status || '-'}
                        </span>
                    </div>
                    <div className="rounded-xl bg-slate-800/70 border border-slate-700 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Type</p>
                        <p className="mt-1 font-medium">{analysis.type || '-'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-800/70 border border-slate-700 p-4 md:col-span-2">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Analystes</p>
                        <p className="mt-1 font-medium">{analystsText}</p>
                    </div>
                    <div className="rounded-xl bg-slate-800/70 border border-slate-700 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Créé le</p>
                        <p className="mt-1 font-medium">
                            {analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString() : '-'}
                        </p>
                    </div>
                    <div className="rounded-xl bg-slate-800/70 border border-slate-700 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Dernière modification</p>
                        <p className="mt-1 font-medium">
                            {analysis.updatedAt ? new Date(analysis.updatedAt).toLocaleDateString() : '-'}
                        </p>
                    </div>
                </div>

                <div className="px-6 pb-6 space-y-4">
                    {workshopEntries.length ? (
                        workshopEntries.map(([workshopKey, workshopData]) => (
                            <section key={workshopKey} className="rounded-xl bg-slate-800/70 border border-slate-700 p-4">
                                <h3 className="text-lg font-semibold mb-3">
                                    Atelier {workshopKey.replace(/\D/g, '') || workshopKey}
                                </h3>
                                {renderValue(workshopData)}
                            </section>
                        ))
                    ) : (
                        <section className="rounded-xl bg-slate-800/70 border border-slate-700 p-4 text-slate-300">
                            Aucun atelier disponible.
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShowAnalysis;