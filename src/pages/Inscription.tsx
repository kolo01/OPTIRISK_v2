import React, { useState } from 'react';
import { Shield, Eye, EyeOff, User, Mail, Building, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';



const Inscription: React.FC = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company_name: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    Object.values(checks).forEach(check => {
      if (check) strength++;
    });

    return { strength, checks };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    
    const { strength } = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-orange-500';
    if (passwordStrength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength <= 2) return 'Faible';
    if (passwordStrength <= 3) return 'Moyen';
    if (passwordStrength <= 4) return 'Bon';
    return 'Excellent';
  };

  const validateForm = () => {
    if (!formData.first_name.trim()) {
      setError('Le prénom est requis');
      return false;
    }
    if (!formData.last_name.trim()) {
      setError('Le nom est requis');
      return false;
    }
    if (!formData.email.trim()) {
      setError('L\'email est requis');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('L\'email n\'est pas valide');
      return false;
    }
    if (!formData.company_name.trim()) {
      setError('L\'organisation est requise');
      return false;
    }
    
    const { checks } = calculatePasswordStrength(formData.password);
    if (!checks.length) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (!checks.lowercase) {
      setError('Le mot de passe doit contenir au moins une lettre minuscule');
      return false;
    }
    if (!checks.uppercase) {
      setError('Le mot de passe doit contenir au moins une lettre majuscule');
      return false;
    }
    if (!checks.number) {
      setError('Le mot de passe doit contenir au moins un chiffre');
      return false;
    }
    if (!checks.special) {
      setError('Le mot de passe doit contenir au moins un caractère spécial');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    authService.register(formData)
      .then((response) => {
        if (response && response.success)
        {
          setShowSuccess(true);
          return;
        }
        const message = response?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
        setError(message);
      })
      .catch((err) => {
        const message = err.response?.data?.message || err.response.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-slate-700 text-center">
          <div className="bg-green-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mb-4">Inscription réussie !</h1>
          <p className="text-slate-300 mb-6">
            Un email de confirmation a été envoyé à <strong>{formData.email}</strong>.
            Veuillez cliquer sur le lien dans l'email pour activer votre compte.
          </p>
          <button
          onClick={() => {navigate('/')}}
                className="w-full bg-cyber-blue hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-slate-700">
        <div className="text-center mb-8">
          <div className="bg-cyber-blue p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Créer un compte</h1>
          <p className="text-slate-400">Rejoignez OptiRisk Plus</p>
          
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-slate-300 mb-2">
                Prénom *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                  placeholder="Jean"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-slate-300 mb-2">
                Nom *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                  placeholder="Dupont"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                placeholder="jean.dupont@exemple.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-slate-300 mb-2">
              Organisation *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                placeholder="Mon Entreprise SAS"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Mot de passe *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handlePasswordChange}
                className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 text-slate-100 placeholder-slate-400"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-slate-400" />
                ) : (
                  <Eye className="w-5 h-5 text-slate-400" />
                )}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400">Force du mot de passe</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength <= 2 ? 'text-red-400' :
                    passwordStrength <= 3 ? 'text-orange-400' :
                    passwordStrength <= 4 ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {getPasswordStrengthLabel()}
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                
                {/* Password Requirements */}
                <div className="space-y-1">
                  {(() => {
                    const { checks } = calculatePasswordStrength(formData.password);
                    return [
                      { key: 'length', label: 'Au moins 8 caractères', met: checks.length },
                      { key: 'lowercase', label: 'Une lettre minuscule', met: checks.lowercase },
                      { key: 'uppercase', label: 'Une lettre majuscule', met: checks.uppercase },
                      { key: 'number', label: 'Un chiffre', met: checks.number },
                      { key: 'special', label: 'Un caractère spécial', met: checks.special }
                    ].map(req => (
                      <div key={req.key} className="flex items-center space-x-2">
                        {req.met ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <X className="w-3 h-3 text-red-400" />
                        )}
                        <span className={`text-xs ${req.met ? 'text-green-400' : 'text-slate-400'}`}>
                          {req.label}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
              Confirmer le mot de passe *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 text-slate-100 placeholder-slate-400"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-slate-400" />
                ) : (
                  <Eye className="w-5 h-5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || passwordStrength < 5}
            className="w-full bg-cyber-blue hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Création du compte...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {navigate('/')}}
            
            className="text-sm text-slate-400 hover:text-slate-300 transition duration-200"
          >
            Déjà un compte ? Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inscription;