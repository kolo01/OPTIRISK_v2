import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiservice';

interface UserDetail {
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  is_2fa_enabled: boolean;
  token_number: number;
  role: string;
}

const UserDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    apiClient.get(`/users/${slug}/`)
      .then(res => setUser(res.data))
      .catch(() => setError('Utilisateur introuvable'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-8 text-black">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">&larr; Retour</button>
      <h2 className="text-2xl font-bold mb-4">Détails de l'utilisateur</h2>
      <div className="flex items-center mb-6">
        <div>
          <div className="text-xl font-semibold">{user.first_name} {user.last_name}</div>
          <div className="text-gray-500">{user.email}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><span className="font-medium">Entreprise:</span> {user.company_name}</div>
        <div><span className="font-medium">Rôle:</span> {user.role}</div>
        <div><span className="font-medium">2FA:</span> {user.is_2fa_enabled ? 'Activé' : 'Non activé'}</div>
        <div><span className="font-medium">Token number:</span> {user.token_number}</div>
      </div>
    </div>
  );
};

export default UserDetailPage;
