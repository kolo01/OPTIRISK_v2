import { useEffect, useState } from 'react';
import { MailCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react'; 
import {  useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';

const EmailVerificationSuccess = () => {
  const searchParams = useSearchParams();
  const token = searchParams[0].get('token');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Pour gérer l'échec d'activation

  // 1. On lance la fonction automatiquement au chargement de la page
  useEffect(() => {
    if (token) {
      
      checkAccountActivation();
    }
  }, [token]);

  const checkAccountActivation = async () => {
    
    setError(false);
    try {
      // 2. Appel à ton API
      await authService.active(token)
        .then((response) => {
          if(response && response.success) {
            // Succès : On laisse le loading passer à false et on affiche le succès
            setError(false);
            return;
          }
          setError(true);
        })
        .catch((err) => {
          // Échec : On active l'affichage d'erreur
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  // 3. RETOUR : État de chargement (Vibe cohérente)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-300 animate-pulse">Vérification de votre compte en cours...</p>
        </div>
      </div>
    );
  }

  // 4. RETOUR : État d'erreur (Si le compte ne s'active pas)
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-red-900/50 text-center">
          <div className="bg-red-500/20 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-red-500/50">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mb-4">Échec de l'activation</h1>
          <p className="text-slate-300 mb-6">
            Désolé, ce lien est invalide ou a expiré. Votre compte n'a pas pu être activé.
            Veuillez <span className="text-red-400 font-bold">vous réinscrire</span> pour recevoir un nouveau lien.
          </p>
          <button
            onClick={() => navigate('/register')} // Redirige vers l'inscription
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            Retour à l'inscription
          </button>
        </div>
      </div>
    );
  }

  // 5. RETOUR : État de succès (Ton code original)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-slate-700 text-center transform transition-all">
        
        <div className="bg-green-500/20 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          <MailCheck className="w-10 h-10 text-green-400" />
        </div>

        <h1 className="text-3xl font-bold text-slate-100 mb-4 tracking-tight">
          Email vérifié !
        </h1>
        
        <p className="text-slate-300 mb-8 leading-relaxed">
          Merci d'avoir confirmé votre adresse e-mail. Votre compte est désormais 
          <span className="text-blue-400 font-semibold"> entièrement activé</span>. 
          Vous pouvez maintenant accéder à toutes nos fonctionnalités.
        </p>

        <button
          onClick={() => navigate('/login')}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
        >
          Accéder à mon espace
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="mt-8 text-sm text-slate-500">
          Un problème ? <a href="#" className="text-blue-400 hover:underline">Contactez le support</a>
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationSuccess;