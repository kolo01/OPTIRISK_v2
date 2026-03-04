import axios from 'axios';
import { useState, type FormEvent, useEffect } from 'react';
import { profileService } from '../services/profileService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


// Composant principal (Conteneur unique)
const SetupMFA = () => {
  
  
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMfaEnabled, setIsMfaEnabled] = useState(false); // État final
  const [token,setToken] = useState<any | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const token2 = localStorage.getItem('tempToken')  
    setToken(token2)
   
   
  }, []);



  const getProfile = async () => {
      const response = await profileService.getProfile();
      try {
        if (response.success) {
          toast.success(`Connexion réussie !, Bon retour ${response.data.first_name} ${response.data.last_name}.`);
          localStorage.setItem('optirisk_user', JSON.stringify(response.data));
          // navigate('/dashboard');
          return;
        }
      } catch (err) {
        localStorage.clear();
      }
    };


  // Soumission pour vérifier l'OTP et activer la MFA
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!/^\d{6}$/.test(otpCode)) {
      setError("Le code OTP doit être composé de 6 chiffres.");
      return;
    }

    setIsSubmitting(true);

    // --- APPEL API 2: Vérifier l'OTP et Activer la MFA (Simulation) ---
    await axios.post(" https://api-optirisk.paullence.link/api/v1/2fa/verify/",{
      code:otpCode,
      temp_token: token
    }).then((response) => {
      setIsSubmitting(false);
      console.log(response.data);
      localStorage.setItem("token",JSON.stringify(response.data.data));
      alert("Double Authentification activée avec succès !");
      setIsMfaEnabled(true);
      getProfile();
      localStorage.removeItem('tempToken');
      navigate('/profil');
    }).catch((error) => {
      setIsSubmitting(false);
      alert(error.response.data.detail)
      setError("Code de vérification incorrect. Veuillez réessayer.");
    });
    // setTimeout(() => { 
    //   setIsSubmitting(false);

    //   if (otpCode === '000000') { // Simuler un OTP invalide
    //     setError("Code de vérification incorrect. Veuillez réessayer.");
    //   } else {
    //     // Succès : La MFA est activée !
    //     setIsMfaEnabled(true);
    //   }
    // }, 2000);
    // ----------------------------------------------------
  };

  // ---------------------------------------------------
  // Rendu conditionnel (Chargement et Succès)
  // ---------------------------------------------------


  

  // ---------------------------------------------------
  // Rendu de la Configuration (QR Code et Formulaire intégrés)
  // ---------------------------------------------------
  return (
    <div className="flex min-h-screen items-start justify-center pt-8 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-2xl rounded-xl border border-gray-100">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Configurer la Double Authentification
        </h2>

        {/* ------------------------------------------- */}
        {/* 1. SECTION AFFICHAGE DU QR CODE (Ex-MfaSetupDisplay) */}
        {/* ------------------------------------------- */}
       

        {/* ------------------------------------------- */}
        {/* 2. SECTION FORMULAIRE DE VÉRIFICATION (Ex-MfaVerificationForm) */}
        {/* ------------------------------------------- */}
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 pt-4">
              Entrer le Code de Vérification
            </h3>
            <p className="text-gray-600">
              Entrez le code à 6 chiffres généré par l'application pour confirmer l'activation.
            </p>

            {/* Champ de saisie du Code OTP */}
            <div className="relative">
              <input
                type="text"
                id="otp-code"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Code à 6 chiffres"
                required
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border text-lg rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>

            {/* Bouton de Soumission */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Vérification en cours...' : 'Activer la Double Authentification'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default SetupMFA;