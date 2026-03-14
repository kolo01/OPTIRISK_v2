// src/pages/admin/UtilisateursActifs.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import UserTable, { type User } from '../../components/admin/UserTable';
import apiClient from '../../services/apiservice';
import ValidationModal from '../../components/admin/ValidationModal';
import SearchBar from '../../components/admin/SearchBar';
import Pagination from '../../components/admin/Pagination';

const UtilisateursActifs: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
    // Récupération des utilisateurs à l'initialisation
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await apiClient.get('/users/');
          // Nouvelle structure : les utilisateurs sont dans response.data.data
          const apiUsers = (response.data.data || []).map((u: any) => ({
            id: u.slug || u.email,
            nom: `${u.first_name || ''} ${u.last_name || ''}`.trim(),
            email: u.email,
            entreprise: u.company_name || 'N/A',
            dateInscription: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A',
            derniereConnexion: u.last_login ? new Date(u.last_login).toLocaleString() : 'N/A',
            nbAnalyses: u.analyses_number || 0,
            statut: u.status === true ? 'ACTIF' : 'SUSPENDU',
            role: (u.role || 'USER').toUpperCase(),
            is2FA: !!u.is_2fa_enabled,
          }));
          setUsers(apiUsers);
        } catch (error) {
          console.error('Erreur lors de la récupération des utilisateurs', error);
        }
      };
      fetchUsers();
    }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState<'TOUS' | 'ACTIF' | 'SUSPENDU'>('TOUS');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'suspension' | 'reactivation' | 'suppression';
    userId: string;
    userName: string;
    userEmail: string;
  }>({
    isOpen: false,
    type: 'suspension',
    userId: '',
    userName: '',
    userEmail: ''
  });

  const itemsPerPage = 10;

  // Filtrage (ne retournera rien)
  const filteredUsers = users.filter((user:any) => {
    const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = statutFilter === 'TOUS' || user.status === statutFilter;
    return matchesSearch && matchesStatut;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      navigate(`/admin/utilisateurs/${id}`, { state: { user } });
    }
  };

  const handleSuspend = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setModalConfig({
        isOpen: true,
        type: 'suspension',
        userId: id,
        userName: user.nom,
        userEmail: user.email
      });
    }
  };

  const handleReactivate = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setModalConfig({
        isOpen: true,
        type: 'reactivation',
        userId: id,
        userName: user.nom,
        userEmail: user.email
      });
    }
  };

  const handleDelete = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setModalConfig({
        isOpen: true,
        type: 'suppression',
        userId: id,
        userName: user.nom,
        userEmail: user.email
      });
    }
  };

  const confirmAction = async () => {
    const { type, userId } = modalConfig;
    try {
      if (type === 'suspension') {
        await apiClient.put(`/user/${userId}/suspend`);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, statut: "SUSPENDU"} : u));
      } else if (type === 'reactivation') {
        await apiClient.put(`/user/${userId}/active`);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, statut: "ACTIF"} : u));
      } 
    } catch (error) {
      console.error('Erreur lors de l’action utilisateur', error);
    }
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher un utilisateur..."
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value as typeof statutFilter)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="TOUS">Tous les statuts</option>
              <option value="ACTIF">Actifs</option>
              <option value="SUSPENDU">Suspendus</option>
            </select>
          </div>
        </div>
      </div>

      <UserTable
        users={paginatedUsers}  // ← Tableau vide
        onView={handleView}
        onSuspend={handleSuspend}
        onReactivate={handleReactivate}
        onDelete={handleDelete}
        showEntreprise={true}
        showAnalyses={false}
        showDerniereConnexion={false}
      />

      <Pagination
        currentPage={currentPage}
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      <ValidationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmAction}
        type={modalConfig.type}
        userName={modalConfig.userName}
        userEmail={modalConfig.userEmail}
      />
    </div>
  );
};

export default UtilisateursActifs;