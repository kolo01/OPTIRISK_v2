import React from 'react';
import ActionButtons from './UserActionButtons';

export type UserStatus = 'EN_ATTENTE' | 'ACTIF' | 'SUSPENDU';
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  nom: string;
  email: string;
  entreprise?: string;
  dateInscription: string;
  derniereConnexion?: string;
  nbAnalyses?: number;
  statut: UserStatus;
  role?: UserRole;
}

interface UserTableProps {
  users: any[];
  onView: (id: string) => void;
  onValidate?: (id: string) => void;
  onReject?: (id: string) => void;
  onSuspend?: (id: string) => void;
  onReactivate?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  showStatus?: boolean;
  showRole?: boolean;
  showEntreprise?: boolean;
  showAnalyses?: boolean;
  showDerniereConnexion?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onView,
  onValidate,
  onReject,
  onSuspend,
  onReactivate,
  onDelete,
  showActions = true,
  showStatus = false,
  showRole = true,
  showEntreprise = true,
  showAnalyses = false,
  showDerniereConnexion = false
}) => {
  const getStatutBadge = (statut: UserStatus) => {
    switch (statut) {
      case 'ACTIF':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Actif</span>;
      case 'SUSPENDU':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Suspendu</span>;
      case 'EN_ATTENTE':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">En attente</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Utilisateur
              </th>
              {showEntreprise && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Entreprise
                </th>
              )}
              {showDerniereConnexion && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dernière connexion
                </th>
              )}
              {showAnalyses && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Analyses
                </th>
              )}
              {showStatus && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
              )}
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={showActions ? 8 : 7} className="px-6 py-8 text-center text-gray-500">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.nom}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  {showEntreprise && (
                    <td className="px-6 py-4 text-gray-600">
                      {user.company_name || '-'}
                    </td>
                  )}
                   
                  {showDerniereConnexion && (
                    <td className="px-6 py-4 text-gray-600">
                      {user.last_login || '-'}
                    </td>
                  )}
                  {showAnalyses && (
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {user.analyses_number || 0}
                      </span>
                    </td>
                  )}
                  {showStatus && (
                    <td className="px-6 py-4">
                      {getStatutBadge(user.statut)}
                    </td>
                  )}
                  {showActions && (
                    <td className="px-6 py-4">
                      <ActionButtons
                        userId={user.id}
                        userStatus={user.statut}
                        onView={onView}
                        onValidate={onValidate}
                        onReject={onReject}
                        onSuspend={onSuspend}
                        onReactivate={onReactivate}
                        onDelete={onDelete}
                      />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;