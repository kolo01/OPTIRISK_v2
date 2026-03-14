// src/pages/admin/JournalActivite.tsx
import React, { useEffect, useState } from "react";
import { Download, Calendar } from "lucide-react";
import * as XLSX from "xlsx";
import SearchBar from "../../components/admin/SearchBar";
import Pagination from "../../components/admin/Pagination";
import journalService from "../../services/adminService/journalService";

export interface LogEntry {
  id: number;
  created_at: string;
  updated_at: string;
  status: boolean;
  level: string;
  action: string;
  message: string;
}

const JournalActivite: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("TOUS");
  const [statutFilter, setStatutFilter] = useState<string>("TOUS");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleExport = () => {
    const data = logs.map((log) => ({
      Date: formatDate(log.created_at),
      Action: log.action,
      Level: log.level,
      Détails: log.message,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Journal");
    XLSX.writeFile(workbook, `journal_activite_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const getStatutBadge = (status: boolean) => {
    return status ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
        Succès
      </span>
    ) : (
      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
        Échec
      </span>
    );
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      !searchTerm ||
      log?.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log?.action?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction =
      actionFilter === "TOUS" || log.action === actionFilter;
    const matchesStatut =
      statutFilter === "TOUS" ||
      (statutFilter === "SUCCES" ? log.status === true : log.status === false);
    const matchesDate = !dateFilter || log.created_at?.startsWith(dateFilter);
    return matchesSearch && matchesAction && matchesStatut && matchesDate;
  });

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const fetchLogs = async () => {
    const response = await journalService.getLogs();
    setLogs(response.data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Journal d'activité</h1>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90"
        >
          <Download className="w-4 h-4" />
          <span>Exporter</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher..."
          />

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="TOUS">Toutes les actions</option>
            <option value="LOGIN">Connexions</option>
            <option value="LOGOUT">Déconnexions</option>
            <option value="SUSPENSION">Suspensions</option>
            <option value="REACTIVATION">Réactivations</option>
            <option value="SUPPRESSION">Suppressions</option>
          </select>

          <select
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="TOUS">Tous les statuts</option>
            <option value="SUCCES">Succès</option>
            <option value="ECHEC">Échec</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Détails
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Level
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Aucune activité enregistrée
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{log.action}</p>
                      
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.message}
                    </td>
                   <p className="text-sm text-gray-500">{log.level}</p>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filteredLogs.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default JournalActivite;
