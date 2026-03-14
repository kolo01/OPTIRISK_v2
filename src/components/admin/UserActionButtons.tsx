// components/admin/UserActionButtons.tsx
import React from 'react';
import { Eye, CheckCircle, XCircle, UserX, UserCheck, Trash2 } from 'lucide-react';
import type { UserStatus } from './UserTable';

interface UserActionButtonsProps {
  userId: string;
  userStatus: UserStatus;
  onView: (id: string) => void;
  onValidate?: (id: string) => void;
  onReject?: (id: string) => void;
  onSuspend?: (id: string) => void;
  onReactivate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const UserActionButtons: React.FC<UserActionButtonsProps> = ({
  userId,
  userStatus,
  onView,
  onValidate,
  onReject,
  onSuspend,
  onReactivate,
  onDelete
}) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onView(userId)}
        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
        title="Voir détails"
      >
        <Eye className="w-4 h-4" />
      </button>

      {userStatus === 'EN_ATTENTE' && onValidate && (
        <button
          onClick={() => onValidate(userId)}
          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
          title="Valider"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
      )}

      {userStatus === 'EN_ATTENTE' && onReject && (
        <button
          onClick={() => onReject(userId)}
          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          title="Refuser"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}

      {userStatus === 'ACTIF' && onSuspend && (
        <button
          onClick={() => onSuspend(userId)}
          className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
          title="Suspendre"
        >
          <UserX className="w-4 h-4" />
        </button>
      )}

      {userStatus === 'SUSPENDU' && onReactivate && (
        <button
          onClick={() => onReactivate(userId)}
          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
          title="Réactiver"
        >
          <UserCheck className="w-4 h-4" />
        </button>
      )}

    
    </div>
  );
};

export default UserActionButtons;