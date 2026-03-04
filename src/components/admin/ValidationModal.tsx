import React from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'validation' | 'refus' | 'suspension' | 'reactivation' | 'suppression';
  userName: string;
  userEmail: string;
}

const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  userName,
  userEmail
}) => {
  if (!isOpen) return null;

  const getConfig = () => {
    switch (type) {
      case 'validation':
        return {
          title: 'Valider l\'inscription',
          message: `Êtes-vous sûr de vouloir valider l'inscription de ${userName} ?`,
          confirmText: 'Valider',
          confirmColor: 'bg-green-600 hover:bg-green-700',
          icon: CheckCircle
        };
      case 'refus':
        return {
          title: 'Refuser l\'inscription',
          message: `Êtes-vous sûr de vouloir refuser l'inscription de ${userName} ?`,
          confirmText: 'Refuser',
          confirmColor: 'bg-red-600 hover:bg-red-700',
          icon: XCircle
        };
      case 'suspension':
        return {
          title: 'Suspendre l\'utilisateur',
          message: `Êtes-vous sûr de vouloir suspendre ${userName} ?`,
          confirmText: 'Suspendre',
          confirmColor: 'bg-orange-600 hover:bg-orange-700',
          icon: XCircle
        };
      case 'reactivation':
        return {
          title: 'Réactiver l\'utilisateur',
          message: `Êtes-vous sûr de vouloir réactiver ${userName} ?`,
          confirmText: 'Réactiver',
          confirmColor: 'bg-green-600 hover:bg-green-700',
          icon: CheckCircle
        };
      case 'suppression':
        return {
          title: 'Supprimer l\'utilisateur',
          message: `Êtes-vous sûr de vouloir supprimer définitivement ${userName} ? Cette action est irréversible.`,
          confirmText: 'Supprimer',
          confirmColor: 'bg-red-600 hover:bg-red-700',
          icon: XCircle
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-full ${
              type === 'validation' || type === 'reactivation' 
                ? 'bg-green-100' 
                : 'bg-red-100'
            }`}>
              <Icon className={`w-6 h-6 ${
                type === 'validation' || type === 'reactivation'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`} />
            </div>
            <div>
              <p className="font-medium text-gray-900">{userName}</p>
              <p className="text-sm text-gray-500">{userEmail}</p>
            </div>
          </div>

          <p className="text-gray-600">{config.message}</p>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-white rounded-lg ${config.confirmColor}`}
          >
            {config.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;