import React, { useState } from 'react';
import { Shield, Eye, EyeOff, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { profileService } from '../services/profileService';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(email, password);

    if (response.success) {
      if (response.data.two_fa_active) {
        toast.info("Authentification à deux facteurs requise.");
        localStorage.setItem('tempToken', response.data.temp_token);
        navigate('/setup-mfa')
        return;
      }
      localStorage.setItem('token', JSON.stringify(response.data.token));
      getProfile();
    } else {
      const message = response.message || 'Échec de la connexion. Vérifiez vos identifiants.';
      setError(message);
    }
    } catch (err: any) {
      console.log(err)
      const message = err.response.data.message|| 'Une erreur est survenue lors de la connexion.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    const response = await profileService.getProfile();
    try {
      if (response.success) {
        toast.success(`Connexion réussie !, Bon retour ${response.data.first_name} ${response.data.last_name}.`);
        localStorage.setItem('optirisk_user', JSON.stringify(response.data));
        if (response.data.role === 'admin') {
          navigate('/admin');
          return;
        }
        navigate('/dashboard');
        return;
      }
    } catch (err) {
      localStorage.clear();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-slate-700">
        <div className="text-center mb-8">
          <div className="bg-cyber-blue p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">OptiRisk Plus</h1>
          <p className="text-slate-400">Analyse des Risques Cyber</p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-400"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-slate-400 hover:text-slate-300 transition duration-200">
                Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-cyber-blue hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="space-y-3">
            <button 
            onClick={() => {navigate('/inscription')}}
              className="w-full bg-cyber-purple hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Créer un compte</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;