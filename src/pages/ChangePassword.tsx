import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fonction de soumission du formulaire
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // --- 1. Validation Côté Client ---

    // Vérification que tous les champs sont remplis
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    // Validation de la longueur du nouveau mot de passe
    if (newPassword.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    // Vérification de la confirmation du mot de passe
    if (newPassword !== confirmPassword) {
      setError("Le nouveau mot de passe et sa confirmation ne correspondent pas.");
      return;
    }
    
    // Vérification que le nouveau mot de passe est différent de l'ancien (optionnel mais bonne pratique)
    if (currentPassword === newPassword) {
        setError("Le nouveau mot de passe ne peut pas être identique à l'ancien.");
        return;
    }

    setIsSubmitting(true);

    // --- 2. Logique Backend (Simulation) ---
    // Vous remplacerez ce bloc par votre appel API réel (avec fetch/axios)
    setTimeout(() => { 
      setIsSubmitting(false);
      
      // Simulation d'une erreur (ex: ancien mot de passe incorrect)
      if (currentPassword === 'mauvais') {
        setError("L'ancien mot de passe est incorrect.");
      } else {
        // Succès simulé
        setSuccess(true);
        // Optionnel : Réinitialiser les champs après succès
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Après le succès, vous pourriez aussi rediriger l'utilisateur
        // Ex: setTimeout(() => navigate('/profile'), 3000);
      }
    }, 2500);
    // ----------------------------------------
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 items-start justify-center pt-12 sm:pt-20">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white shadow-2xl rounded-xl border border-gray-100">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Modifier mon mot de passe
        </h2>
        <p className="text-center text-sm text-gray-600">
          Assurez-vous d'utiliser un mot de passe unique et sécurisé.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          <div className="space-y-4">
            {/* ANCIEN MOT DE PASSE */}
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                Ancien mot de passe
              </label>
              <input
                id="current-password"
                name="current-password"
                type="password"
                required
                className={`mt-1 block w-full px-3 py-2 border ${
                  error && currentPassword.length === 0 ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setError('');
                  setSuccess(false);
                }}
                disabled={isSubmitting}
              />
            </div>

            <hr className="my-6 border-gray-200" />
            
            {/* NOUVEAU MOT DE PASSE */}
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                Nouveau mot de passe (8 caractères min.)
              </label>
              <input
                id="new-password"
                name="new-password"
                type="password"
                required
                className={`mt-1 block w-full px-3 py-2 border ${
                  error && newPassword.length > 0 && newPassword.length < 8 ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                  setSuccess(false);
                }}
                disabled={isSubmitting}
              />
            </div>

            {/* CONFIRMATION DU NOUVEAU MOT DE PASSE */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirmer le nouveau mot de passe
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className={`mt-1 block w-full px-3 py-2 border ${
                  error && newPassword !== confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                  setSuccess(false);
                }}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Messages d'Erreur et de Succès */}
          {error && (
            <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
              <p className="text-sm font-medium">⚠️ {error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md">
              <p className="text-sm font-medium">✅ Votre mot de passe a été modifié avec succès !</p>
            </div>
          )}

          {/* Bouton de Soumission */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isSubmitting 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Modification en cours...
                </>
              ) : (
                'Modifier le mot de passe'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;