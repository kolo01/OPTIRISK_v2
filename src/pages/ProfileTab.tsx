import {
  AlertTriangle,
  Mail,
  Trash,
  User,
  ShieldCheck,
  FileText,
} from "lucide-react";

// --- IMPORTS DES COMPOSANTS ---
import SweetButton from "./SweetButton";
import CustomIcon from "./CustomIcon";

import { useEffect, useRef, useState } from "react";
import { profileService } from "../services/profileService";
import { toast } from "react-toastify";
import axios from "axios";

// --- Fonctions de style statiques pour le rendu ---
const getStatusColor = (status: string) => {
  switch (status) {
    case "Terminé":
      return "bg-green-100 text-green-800";
    case "En cours":
      return "bg-blue-100 text-blue-800";
    case "Brouillon":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getContextColor = (context: string) => {
  switch (context) {
    case "PME":
      return "bg-purple-100 text-purple-800";
    case "École":
      return "bg-green-100 text-green-800";
    case "Domicile":
      return "bg-blue-100 text-blue-800";
    case "Industrie":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// --- Données Statiques ---
// const userAnalysesStatic = [
//   {
//     id: 1,
//     title: "Analyse Villes",
//     organization: "Mairie de Paris",
//     context: "École",
//     status: "Terminé",
//     updatedAt: "20/10/2025",
//   },
//   {
//     id: 2,
//     title: "Projet Alpha",
//     organization: "Start-Up X",
//     context: "PME",
//     status: "En cours",
//     updatedAt: "10/11/2025",
//   },
// ];

const ProfileTab = () => {
  // --- STATES POUR LE MODAL DE MOT DE PASSE ---
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- STATES POUR MFA ---
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [isSetupMfaModalOpen, setIsSetupMfaModalOpen] = useState(false);
  const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);
  const [mfaCode, setMfaCode] = useState(["", "", "", "", "", ""]);
  const [disableMfaCode, setDisableMfaCode] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [isEnablingMfa, setIsEnablingMfa] = useState(false);

  // --- STATE POUR SUPPRESSION DE COMPTE ---
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [mfaLink, setMfaLink] = useState(null);
  // Récupération de l'utilisateur
  const [user, setUser] = useState<any | null>(
    JSON.parse(localStorage.getItem("optirisk_user") || "{}"),
  );

  // --- FONCTION POUR FERMER LE MODAL DE MOT DE PASSE ---
  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsChangingPassword(false);
  };

  // --- FONCTION POUR CHANGER LE MOT DE PASSE ---
  const handlePasswordChange = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Tous les champs sont obligatoires");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    // Validation alphanumérique + caractères spéciaux
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "Le mot de passe doit contenir au moins une lettre et un chiffre",
      );
      return;
    }

    setIsChangingPassword(true);
    setPasswordError("");

    try {
      const response = await profileService.updatePassword({
        password: currentPassword,
        new_password: newPassword,
      });
      if (response.success) {
        toast.success(response.message);
        closePasswordModal();
      } else {
        const message = response?.message || "Une erreur est survenue";
        toast.error(message);
      }
    } catch (error) {
      setPasswordError("Erreur lors du changement de mot de passe");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // --- FONCTIONS MFA ---
  const disableMfa = async () => {
    try {
      const response = await profileService.disable2FA();
      if (response.success) {
        setIsMfaEnabled(false);
        setUser({ ...user, is_2fa_enabled: false });

        toast.success("MFA désactivée.");
      }
    } catch (err: any) {
      const message =
        err?.response?.data.message ||
        "Une erreur est survenue lors de la connexion.";
      toast.error(message);
    }
  };

  const setupMFA = async () => {
    try {
      const response = await profileService.setup2FA();
      if (response.success) {
        setIsSetupMfaModalOpen(true);
        setMfaLink(response.data.otp_auth_url);
      } else {
        const message =
          response.message || "Échec lors de l'initialisation de la MFA.";
        setMfaError(message);
      }
    } catch (err: any) {
      const message =
        err.response.data.message ||
        "Échec lors de l'initialisation de la MFA.";
      setMfaError(message);
    }
  };

  const activateMfa = async () => {
    try {
      const response = await profileService.activate2FA();
      if (response.success) {
        setIsSetupMfaModalOpen(false);
        toast.success("MFA activée.");
      } else {
        const message =
          response.message || "Échec lors de l'activation de la MFA.";
        setMfaError(message);
      }
    } catch (err: any) {
      const message =
        err.response.data.message || "Échec lors de l'activation de la MFA.";
      setMfaError(message);
    }
  };

  // --- FONCTION POUR SUPPRIMER LE COMPTE ---
  const handleAccountDeletion = async () => {
    if (deleteConfirmationText !== "SUPPRIMER") return;
    try {
      // Appel API pour supprimer le compte selon la spec
      await axios.delete("https://api-optirisk.paullence.link/api/v1/delete-my-account", {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token') || '{}').access}`
        }
      });
      toast.success("Compte supprimé avec succès.");
      // Nettoyage localStorage et redirection
      localStorage.removeItem("token");
      localStorage.removeItem("optirisk_user");
      window.location.href = "/";
    } catch (error: any) {
      toast.error("Erreur lors de la suppression du compte.");
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const [userPhoto, setUserPhoto] = useState<any>(null);

  useEffect(() => {
    const fetchUserPhoto = async () => {
      try {
        const response = await profileService.getAvatar();
        console.log("image", response);
        setUserPhoto(response.data.picture);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la photo de profil:",
          error,
        );
      }
    };

    if (user) {
      fetchUserPhoto();
    }
  }, [user]);
  const updateProfilePhoto = async (file: any) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await profileService.uploadAvatar(file);
      if (response.success) {
        toast.success("Photo de profil mise à jour !");
        const url = file ? URL.createObjectURL(file) : null;
        setUserPhoto(url);
        // Notifier le header pour mettre à jour l'avatar immédiatement
        window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { url } }));
      } else {
        toast.error("Échec de la mise à jour de la photo de profil.");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la photo de profil.");
    }
  };
  const photoInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 1. Informations personnelles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid items-center mb-6  justify-center">
          <img
            src={userPhoto}
            alt="Photo de profil"
            className="w-80 h-80 rounded-full border border-red-500 border-2"
          />

          <input
            type="file"
            multiple={false}
            hidden
            ref={photoInputRef}
            id="photo-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              updateProfilePhoto(file);
            }}
          />
          <button
            className="mt-4 bg-white text-black border border-black border-2 w-80 text-lg font-bold align-center items-center"
            onClick={() => photoInputRef.current?.click()}
          >
            Modifier la photo
          </button>
        </div>
        <div className="flex items-center mb-6">
          <CustomIcon
            name="SettingsIcon"
            className="w-6 h-6 text-indigo-600 mr-2"
          />
          <h2 className="text-xl font-semibold text-gray-900">
            Informations personnelles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-900">{user.first_name}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-900">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <CustomIcon
                  name="UserIcon"
                  className="w-4 h-4 text-gray-400 mr-2"
                />
                <span className="text-gray-900">{user.last_name}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organisation
              </label>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-900">{user.company_name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions de Sécurité */}
        <div className="mt-8 pt-4 border-t border-gray-100 space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
            <CustomIcon
              name="ShieldCheckIcon"
              className="w-5 h-5 text-indigo-600 mr-2"
            />
            Actions de Sécurité
          </h3>

          {/* Bouton Modifier le mot de passe */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              Changer mon mot de passe
            </span>
            <SweetButton
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition duration-150"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Modifier
            </SweetButton>
          </div>

          {/* Bouton Double Authentification (MFA) */}
          <div
            className={`flex justify-between items-center p-4 rounded-lg border ${
              user.is_2fa_enabled
                ? "bg-green-50 border-green-300"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-3">
              <CustomIcon
                name="KeyIcon"
                className={`w-5 h-5 ${user.is_2fa_enabled ? "text-green-600" : "text-gray-500"}`}
              />
              <div>
                <span className="text-sm font-medium text-gray-700 block">
                  Double Authentification (MFA/2FA)
                </span>
                <span
                  className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full mt-1 ${
                    user.is_2fa_enabled
                      ? "bg-green-600 text-white"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {user.is_2fa_enabled ? "Activée" : "Désactivée"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {user.is_2fa_enabled ? (
                <SweetButton
                  className="px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-md hover:bg-red-200 transition duration-150"
                  onClick={disableMfa}
                >
                  Désactiver
                </SweetButton>
              ) : (
                <SweetButton
                  className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition duration-150"
                  onClick={setupMFA}
                >
                  Activer
                </SweetButton>
              )}
            </div>
          </div>
        </div>

        {/* Modal pour changer le mot de passe */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              {/* En-tête du modal */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CustomIcon
                    name="LockClosedIcon"
                    className="w-5 h-5 text-indigo-600 mr-2"
                  />
                  Changer mon mot de passe
                </h3>
                <button
                  onClick={closePasswordModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <CustomIcon name="XMarkIcon" className="w-5 h-5" />
                </button>
              </div>

              {/* Formulaire */}
              <div className="p-6 space-y-4">
                {/* Mot de passe actuel avec toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                      placeholder="Entrez votre mot de passe actuel"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      <CustomIcon
                        name={showCurrentPassword ? "EyeSlashIcon" : "EyeIcon"}
                        className="w-5 h-5 text-gray-400 hover:text-gray-600"
                      />
                    </button>
                  </div>
                </div>

                {/* Nouveau mot de passe avec toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                      placeholder="Entrez votre nouveau mot de passe"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <CustomIcon
                        name={showNewPassword ? "EyeSlashIcon" : "EyeIcon"}
                        className="w-5 h-5 text-gray-400 hover:text-gray-600"
                      />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 8 caractères alphanumériques (lettres + chiffres)
                  </p>
                </div>

                {/* Confirmation avec toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                      placeholder="Confirmez votre nouveau mot de passe"
                      autoCapitalize="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <CustomIcon
                        name={showConfirmPassword ? "EyeSlashIcon" : "EyeIcon"}
                        className="w-5 h-5 text-gray-400 hover:text-gray-600"
                      />
                    </button>
                  </div>
                </div>

                {/* Message d'erreur */}
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{passwordError}</p>
                  </div>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  onClick={closePasswordModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition duration-150"
                >
                  Annuler
                </button>
                <SweetButton
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition duration-150"
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <span className="flex items-center">
                      <CustomIcon
                        name="ArrowPathIcon"
                        className="w-4 h-4 mr-2 animate-spin"
                      />
                      Modification...
                    </span>
                  ) : (
                    "Changer le mot de passe"
                  )}
                </SweetButton>
              </div>
            </div>
          </div>
        )}

        {/* Modal pour activer la MFA - CORRIGÉ */}
        {isSetupMfaModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
              {/* En-tête du modal */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CustomIcon
                    name="QrCodeIcon"
                    className="w-5 h-5 text-indigo-600 mr-2"
                  />
                  Activer la double authentification
                </h3>
                <button
                  onClick={() => setIsSetupMfaModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <CustomIcon name="XMarkIcon" className="w-5 h-5" />
                </button>
              </div>

              {/* Contenu du modal */}
              <div className="p-6 space-y-6">
                {/* QR Code Section */}
                <div className="flex flex-col items-center">
                  <div className="mb-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Scannez ce QR code avec votre application
                      d'authentification
                    </p>
                  </div>

                  <div className="bg-white p-4 border border-gray-300 rounded-lg mb-4">
                    <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
                      {/* QR Code Placeholder */}
                      <div className="text-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${mfaLink}`}
                          alt=""
                        />
                        <p className="text-sm text-gray-500">QR Code MFA</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                  <button
                    onClick={() => setIsSetupMfaModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition duration-150"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={activateMfa}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-green-500 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-150"
                  >
                    Activer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal pour désactiver la MFA - CORRIGÉ */}
        {isMfaModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CustomIcon
                    name="KeyIcon"
                    className="w-5 h-5 text-red-600 mr-2"
                  />
                  Désactiver la double authentification
                </h3>
                <button
                  onClick={() => setIsMfaModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <CustomIcon name="XMarkIcon" className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <CustomIcon
                      name="ExclamationTriangleIcon"
                      className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        Avertissement de sécurité
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        La désactivation de la MFA réduit la sécurité de votre
                        compte. Vous serez uniquement protégé par votre mot de
                        passe.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pour confirmer, entrez le code à 6 chiffres de votre
                    application d'authentification :
                  </label>
                  <div className="flex justify-center space-x-3 mb-4">
                    <input
                      type="text"
                      placeholder="123456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-lg font-mono"
                      value={disableMfaCode}
                      onChange={(e) => setDisableMfaCode(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  {mfaError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600 text-center">
                        {mfaError}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  onClick={() => setIsMfaModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition duration-150"
                >
                  Annuler
                </button>
                <SweetButton
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition duration-150"
                  onClick={activateMfa}
                >
                  Activer
                </SweetButton>
              </div>
            </div>
          </div>
        )}

        {/* Membre depuis */}
        <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <span className="w-4 h-4 text-gray-400 mr-2">
              <CustomIcon name="ClockIcon" className="w-4 h-4" />
            </span>
            <span className="text-sm text-gray-600">
              Membre depuis le {user?.created_at?.split("T")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Zone de danger (supprimée sur demande client) */}
      {false && <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
          <h2 className="text-xl font-semibold text-red-900">Zone de danger</h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-red-900 mb-2">
            Suppression du compte
          </h3>
          <p className="text-red-800 text-sm mb-3">
            ⚠️ Cette action est <span className="font-bold">irréversible</span>.
            En supprimant votre compte, vous perdrez toutes vos données,
            analyses et historiques.
          </p>

          {!showDeleteConfirmation ? (
            <SweetButton
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              <Trash className="w-4 h-4" />
              <span>Supprimer mon compte</span>
            </SweetButton>
          ) : (
            <div className="space-y-4">
              {/* Message d'alerte */}
              <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-900">
                      Êtes-vous sûr de vouloir supprimer votre compte ?
                    </h3>
                    <div className="mt-2 text-sm text-red-800">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Toutes vos données personnelles seront définitivement
                          effacées
                        </li>
                        <li>Vos analyses en cours seront perdues</li>
                        <li>Votre historique sera supprimé</li>
                        <li>Cette action ne peut pas être annulée</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Champ de confirmation */}
              <div>
                <label className="block text-sm font-medium text-red-900 mb-2">
                  Pour confirmer, tapez{" "}
                  <span className="font-bold text-red-700">"SUPPRIMER"</span>{" "}
                  ci-dessous :
                </label>
                <input
                  type="text"
                  placeholder='Tapez "SUPPRIMER"'
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                    deleteConfirmationText === "SUPPRIMER"
                      ? "border-green-500 focus:ring-green-500"
                      : "border-red-300 focus:ring-red-500"
                  }`}
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                />
                <div className="mt-1 flex items-center">
                  {deleteConfirmationText === "SUPPRIMER" ? (
                    <span className="text-xs text-green-600 flex items-center">
                      <CustomIcon
                        name="CheckCircleIcon"
                        className="w-4 h-4 mr-1"
                      />
                      Mot de confirmation correct
                    </span>
                  ) : deleteConfirmationText ? (
                    <span className="text-xs text-red-600 flex items-center">
                      <CustomIcon name="XCircleIcon" className="w-4 h-4 mr-1" />
                      Le texte ne correspond pas
                    </span>
                  ) : (
                    <span className="text-xs text-red-600">
                      Tapez "SUPPRIMER" pour confirmer
                    </span>
                  )}
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex space-x-3 pt-2">
                <SweetButton
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200 ${
                    deleteConfirmationText === "SUPPRIMER"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-300 text-red-100 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    deleteConfirmationText === "SUPPRIMER" &&
                    handleAccountDeletion()
                  }
                  disabled={deleteConfirmationText !== "SUPPRIMER"}
                >
                  <Trash className="w-4 h-4" />
                  <span>Supprimer définitivement mon compte</span>
                </SweetButton>

                <SweetButton
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition duration-200"
                  onClick={() => {
                    setShowDeleteConfirmation(false);
                    setDeleteConfirmationText("");
                  }}
                >
                  Annuler
                </SweetButton>
              </div>
            </div>
          )}
        </div>
      </div>}

      {/* 3. Tableau des analyses */}
      {/* <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <CustomIcon
            name="FileTextIcon"
            className="w-6 h-6 text-indigo-600 mr-2"
          />
          <h2 className="text-xl font-semibold text-gray-900">nalyses</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contexte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière modification
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userAnalysesStatic.map((analysis) => (
                <tr key={analysis.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {analysis.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {analysis.organization}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getContextColor(analysis.context)}`}
                    >
                      {analysis.context}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(analysis.status)}`}
                    >
                      {analysis.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {analysis.updatedAt}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {userAnalysesStatic.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Aucune analyse créée pour le moment.
            </p>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default ProfileTab;
