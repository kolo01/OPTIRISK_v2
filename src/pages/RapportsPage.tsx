import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FileText,
  Download,
  Eye,
  Edit,
  Trash,
  Filter,
  Search,
  Calendar,
  Building,
  BarChart,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader,
  AlertCircle,
  CheckCircle,
  XCircle,
  Upload,
  SortAsc,
  SortDesc,
  MoreVertical,
  Share2,
  Copy,
  ExternalLink,
  Printer,
  Shield,
  Briefcase,
} from "lucide-react";
import SweetButton from "./SweetButton";
import StatsService from "../services/adminService/statsServices";

// --- Types basés sur la structure API réelle ---
export interface Rapport {
  id: string;
  title: string;
  type: string;
  organization: string;
  updated_at: string; // ISO date string
  technical_report?: string; // URL PDF
  executive_report?: string; // URL PDF
  // Champs optionnels enrichis côté front
  statut?: "Publié" | "Brouillon" | "Archivé" | "En attente";
  categorie?: "Financier" | "Commercial" | "Technique" | "RH" | "Marketing" | "Autre";
}

interface RapportFiltres {
  statut: string;
  categorie: string;
  dateDebut: string;
  dateFin: string;
  organisation: string;
  recherche: string;
}

interface Tri {
  champ: keyof Rapport;
  direction: "asc" | "desc";
}

// --- Helpers ---
const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

// --- Composants enfants ---
const BadgeStatut = ({ statut }: { statut?: Rapport["statut"] }) => {
  const val = statut ?? "Publié";
  const configs = {
    Publié: { bg: "bg-emerald-500", icon: CheckCircle, text: "PUBLIÉ" },
    Brouillon: { bg: "bg-amber-500", icon: AlertCircle, text: "BROUILLON" },
    Archivé: { bg: "bg-slate-600", icon: Clock, text: "ARCHIVÉ" },
    "En attente": { bg: "bg-blue-500", icon: Clock, text: "EN ATTENTE" },
  };
  const config = configs[val];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-white font-bold text-xs ${config.bg}`}>
      <Icon className="w-3 h-3 mr-1.5" />
      {config.text}
    </span>
  );
};

const BadgeType = ({ type }: { type: string }) => (
  <span className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs uppercase">
    {type}
  </span>
);

// Boutons pour ouvrir les rapports PDF
const RapportLinks = ({ rapport }: { rapport: Rapport }) => (
  <div className="flex gap-2 flex-wrap">
    {rapport.technical_report && (
      <a
        href={rapport.technical_report}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
      >
        <Shield className="w-3.5 h-3.5" />
        Rapport Technique
      </a>
    )}
    {rapport.executive_report && (
      <a
        href={rapport.executive_report}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors"
      >
        <Briefcase className="w-3.5 h-3.5" />
        Rapport Exécutif
      </a>
    )}
  </div>
);

const CarteRapport = ({
  rapport,
  onAction,
}: {
  rapport: Rapport;
  onAction: (action: string, rapport: Rapport) => void;
}) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col">
    <div className="p-6 flex-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <BadgeStatut statut={rapport.statut} />
            <BadgeType type={rapport.type} />
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {rapport.title}
          </h3>

          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Building className="w-4 h-4 mr-1.5 shrink-0" />
            <span className="font-medium">{rapport.organization}</span>
          </div>

          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Mis à jour le {formatDate(rapport.updated_at)}</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 ml-2">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>

    <div className="border-t px-6 py-4 bg-gray-50 rounded-b-xl space-y-3">
      <RapportLinks rapport={rapport} />
      <div className="flex gap-2">
        <SweetButton
          className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={() => onAction("partager", rapport)}
          title="Partager"
        >
          <Share2 className="w-4 h-4" />
        </SweetButton>
        <SweetButton
          className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={() => onAction("imprimer", rapport)}
          title="Imprimer"
        >
          <Printer className="w-4 h-4" />
        </SweetButton>
      </div>
    </div>
  </div>
);

// --- Composant principal ---
const RapportsPage = () => {
  const [rapports, setRapports] = useState<Rapport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vue, setVue] = useState<"tableau" | "grille">("tableau");
  const [tri, setTri] = useState<Tri>({ champ: "updated_at", direction: "desc" });
  const [filtres, setFiltres] = useState<RapportFiltres>({
    statut: "Tous",
    categorie: "Tous",
    dateDebut: "",
    dateFin: "",
    organisation: "",
    recherche: "",
  });
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [taillePage, setTaillePage] = useState(20);
  const [total, setTotal] = useState(0);

  const fetchRapports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await StatsService.getUsersReports();
      const items: Rapport[] = data.data ?? [];
      setRapports(items);
      setTotal(items.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRapports();
  }, [fetchRapports]);

  // --- Filtrage + tri côté client ---
  const rapportsFiltres = useMemo(() => {
    let liste = [...rapports];

    if (filtres.recherche) {
      const q = filtres.recherche.toLowerCase();
      liste = liste.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.type?.toLowerCase().includes(q) ||
          r.organization?.toLowerCase().includes(q)
      );
    }

    if (filtres.statut !== "Tous") {
      liste = liste.filter((r) => (r.statut ?? "Publié") === filtres.statut);
    }

    if (filtres.organisation) {
      const q = filtres.organisation.toLowerCase();
      liste = liste.filter((r) => r.organization?.toLowerCase().includes(q));
    }

    if (filtres.dateDebut) {
      liste = liste.filter(
        (r) => new Date(r.updated_at) >= new Date(filtres.dateDebut)
      );
    }
    if (filtres.dateFin) {
      liste = liste.filter(
        (r) => new Date(r.updated_at) <= new Date(filtres.dateFin)
      );
    }

    // Tri
    liste.sort((a, b) => {
      const champ = tri.champ as string;
      const va = (a as any)[champ] ?? "";
      const vb = (b as any)[champ] ?? "";
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return tri.direction === "asc" ? cmp : -cmp;
    });

    return liste;
  }, [rapports, filtres, tri]);

  // Pagination côté client
  const rapportsPagines = useMemo(() => {
    const debut = (page - 1) * taillePage;
    return rapportsFiltres.slice(debut, debut + taillePage);
  }, [rapportsFiltres, page, taillePage]);

  const totalFiltres = rapportsFiltres.length;

  // --- Stats ---
  const stats = useMemo(() => ({
    total: total,
    avecTechnique: rapports.filter((r) => !!r.technical_report).length,
    avecExecutif: rapports.filter((r) => !!r.executive_report).length,
    organisations: new Set(rapports.map((r) => r.organization)).size,
  }), [rapports, total]);

  const typesUniques = useMemo(() => [...new Set(rapports.map((r) => r.type))], [rapports]);
  const organisationsUniques = useMemo(() => [...new Set(rapports.map((r) => r.organization))], [rapports]);

  const handleTri = (champ: keyof Rapport) => {
    setTri((prev) => ({
      champ,
      direction: prev.champ === champ && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelection = (id: string) => {
    setSelection((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const handleSelectionTout = () => {
    setSelection(
      selection.size === rapportsPagines.length
        ? new Set()
        : new Set(rapportsPagines.map((r) => r.id))
    );
  };

  const handleActionGroupee = (action: string) => {
    if (action === "supprimer") {
      if (window.confirm(`Supprimer ${selection.size} rapport(s) ?`)) {
        console.log("Suppression de:", Array.from(selection));
      }
    }
  };

  const handleActionRapport = (action: string, rapport: Rapport) => {
    switch (action) {
      case "voir":
        if (rapport.technical_report) window.open(rapport.technical_report, "_blank");
        break;
      case "telecharger":
        if (rapport.executive_report) window.open(rapport.executive_report, "_blank");
        break;
      case "partager":
        navigator.clipboard?.writeText(rapport.technical_report ?? rapport.executive_report ?? "");
        break;
      case "imprimer":
        window.print();
        break;
    }
  };

  const SortIcon = ({ champ }: { champ: keyof Rapport }) =>
    tri.champ === champ ? (
      tri.direction === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
    ) : null;

  if (loading && rapports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-700 font-medium">Chargement des rapports...</p>
        <p className="text-gray-500 text-sm mt-2">Veuillez patienter</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📈 Rapports Analytiques</h1>
          <p className="text-gray-600 mt-2">
            {total} rapport(s) • {stats.organisations} organisation(s)
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <SweetButton
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 px-4 py-2 rounded-lg"
            onClick={() => setVue(vue === "tableau" ? "grille" : "tableau")}
          >
            {vue === "tableau" ? "Vue Grille" : "Vue Tableau"}
          </SweetButton>
          <SweetButton
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg"
            onClick={() => console.log("Nouveau rapport")}
          >
            <Plus className="w-4 h-4" />
            Nouveau Rapport
          </SweetButton>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "bg-blue-500", icon: BarChart },
          { label: "Rapport Technique", value: stats.avecTechnique, color: "bg-indigo-500", icon: Shield },
          { label: "Rapport Exécutif", value: stats.avecExecutif, color: "bg-purple-500", icon: Briefcase },
          { label: "Organisations", value: stats.organisations, color: "bg-emerald-500", icon: Building },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white rounded-lg shadow border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions groupées */}
      {selection.size > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-900">
              {selection.size} élément(s) sélectionné(s)
            </span>
            <div className="flex gap-2">
              <SweetButton
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-sm rounded-lg flex items-center"
                onClick={() => handleActionGroupee("supprimer")}
              >
                <Trash className="w-4 h-4 mr-2" />
                Supprimer
              </SweetButton>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="inline w-4 h-4 mr-2" />
              Recherche
            </label>
            <input
              type="text"
              placeholder="Titre, type, organisation..."
              className="w-full px-4 py-2 border rounded-lg"
              value={filtres.recherche}
              onChange={(e) => setFiltres({ ...filtres, recherche: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline w-4 h-4 mr-2" />
              Type d'analyse
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={filtres.categorie}
              onChange={(e) => setFiltres({ ...filtres, categorie: e.target.value })}
            >
              <option value="Tous">Tous les types</option>
              {typesUniques.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="inline w-4 h-4 mr-2" />
              Organisation
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={filtres.organisation}
              onChange={(e) => setFiltres({ ...filtres, organisation: e.target.value })}
            >
              <option value="">Toutes les organisations</option>
              {organisationsUniques.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date début</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg"
              value={filtres.dateDebut}
              onChange={(e) => setFiltres({ ...filtres, dateDebut: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg"
              value={filtres.dateFin}
              onChange={(e) => setFiltres({ ...filtres, dateFin: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <SweetButton
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
              onClick={() =>
                setFiltres({
                  statut: "Tous",
                  categorie: "Tous",
                  dateDebut: "",
                  dateFin: "",
                  organisation: "",
                  recherche: "",
                })
              }
            >
              Réinitialiser les filtres
            </SweetButton>
          </div>
        </div>
      </div>

      {/* Affichage */}
      {vue === "grille" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rapportsPagines.map((rapport) => (
            <CarteRapport key={rapport.id} rapport={rapport} onAction={handleActionRapport} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={
                        rapportsPagines.length > 0 &&
                        selection.size === rapportsPagines.length
                      }
                      onChange={handleSelectionTout}
                      className="rounded border-gray-300"
                    />
                  </th>
                  {(
                    [
                      { label: "Titre", champ: "title" },
                      { label: "Type", champ: "type" },
                      { label: "Organisation", champ: "organization" },
                      { label: "Mis à jour", champ: "updated_at" },
                      { label: "Rapports", champ: null },
                      { label: "Actions", champ: null },
                    ] as { label: string; champ: keyof Rapport | null }[]
                  ).map(({ label, champ }) => (
                    <th
                      key={label}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase"
                    >
                      {champ ? (
                        <button
                          className="flex items-center gap-1"
                          onClick={() => handleTri(champ)}
                        >
                          {label}
                          <SortIcon champ={champ} />
                        </button>
                      ) : (
                        label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rapportsPagines.map((rapport) => (
                  <tr key={rapport.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selection.has(rapport.id)}
                        onChange={() => handleSelection(rapport.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{rapport.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <BadgeType type={rapport.type} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <Building className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        {rapport.organization}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {formatDate(rapport.updated_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RapportLinks rapport={rapport} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <SweetButton
                          className="bg-transparent text-gray-700 hover:bg-gray-100 px-2 py-1.5 rounded"
                          onClick={() => handleActionRapport("partager", rapport)}
                          title="Partager"
                        >
                          <Share2 className="w-4 h-4" />
                        </SweetButton>
                        <SweetButton
                          className="bg-transparent text-gray-700 hover:bg-gray-100 px-2 py-1.5 rounded"
                          onClick={() => handleActionRapport("imprimer", rapport)}
                          title="Imprimer"
                        >
                          <Printer className="w-4 h-4" />
                        </SweetButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalFiltres > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-lg shadow border p-4">
          <div className="text-gray-700 mb-4 sm:mb-0">
            Affichage de{" "}
            <span className="font-bold">{(page - 1) * taillePage + 1}</span> à{" "}
            <span className="font-bold">{Math.min(page * taillePage, totalFiltres)}</span>{" "}
            sur <span className="font-bold">{totalFiltres}</span> rapports
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Par page:</span>
              <select
                className="border rounded px-2 py-1"
                value={taillePage}
                onChange={(e) => { setTaillePage(Number(e.target.value)); setPage(1); }}
              >
                {[10, 20, 50, 100].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <SweetButton
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded disabled:opacity-40"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </SweetButton>
              {Array.from({ length: Math.ceil(totalFiltres / taillePage) }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === page || p === page - 1 || p === page + 1 || p === Math.ceil(totalFiltres / taillePage))
                .map((p, i, arr) => (
                  <div key={p} className="flex items-center">
                    {i > 0 && arr[i - 1] !== p - 1 && <span className="px-2">...</span>}
                    <SweetButton
                      className={`min-w-[40px] px-3 py-1.5 rounded ${
                        p === page
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </SweetButton>
                  </div>
                ))}
              <SweetButton
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded disabled:opacity-40"
                disabled={page === Math.ceil(totalFiltres / taillePage)}
                onClick={() => setPage((p) => Math.min(Math.ceil(totalFiltres / taillePage), p + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </SweetButton>
            </div>
          </div>
        </div>
      )}

      {/* État vide */}
      {rapportsFiltres.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-xl shadow border">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-3">Aucun rapport trouvé</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            {filtres.recherche || filtres.statut !== "Tous" || filtres.organisation
              ? "Aucun rapport ne correspond à vos critères de recherche."
              : "Commencez par créer votre premier rapport."}
          </p>
          <SweetButton
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg"
            onClick={() =>
              setFiltres({ statut: "Tous", categorie: "Tous", dateDebut: "", dateFin: "", organisation: "", recherche: "" })
            }
          >
            Réinitialiser les filtres
          </SweetButton>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-500 mr-4" />
            <div>
              <h3 className="text-lg font-bold text-red-800">Erreur</h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchRapports}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RapportsPage;