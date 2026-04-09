import { Route, Routes, Outlet } from "react-router-dom";
import LoginPage from "./pages/Login";
import Inscription from "./pages/Inscription";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import SetupMFA from "./pages/SetupMFA";
import ProfileTab from "./pages/ProfileTab";
import RapportsPage from "./pages/RapportsPage";
import TokenWarning from "./pages/TokenWarning";
import EmailVerificationSuccess from "./pages/EmailVerificationSuccess";
import AnalysisTab from "./components/Analysis/AnalysisTab";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import UtilisateursActifs from "./pages/admin/UtilisateursActifs";
import UserDetailPage from "./pages/admin/UserDetail";
import JournalActivite from "./pages/admin/JournalActivite";
import Layout from "./components/layouts/Index";
import Dashboard from "./pages/Dashboard";
import AnalysesTableau from "./components/Analysis/analysesTables";
import EditAnalysis from "./components/Analysis/EditAnalysis";
import ShowAnalysis from "./components/Analysis/showAnalyse";
import AdminGuard from "./guards/AdminGuard";
import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";

function App() {
  return (
    <Routes>
      {/* ADMIN */}
      <Route path="/admin" element={<AdminGuard />}>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="utilisateurs" element={<UtilisateursActifs />} />
          <Route path="utilisateurs/:slug" element={<UserDetailPage />} />
          <Route path="journal" element={<JournalActivite />} />
        </Route>
      </Route>

      {/* PUBLIC */}
      <Route element={<GuestGuard />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/setup-mfa" element={<SetupMFA />} />
        <Route path="/token-warning" element={<TokenWarning />} />
        <Route
          path="/activate-account"
          element={<EmailVerificationSuccess />}
        />
      </Route>

      {/* PROTECTED USER */}
      <Route element={<AuthGuard />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis-tab" element={<AnalysisTab />} />
          <Route path="/edit-analysis-tab/:slug" element={<EditAnalysis />} />
          <Route path="/showanalysis/:slug" element={<ShowAnalysis />} />
          <Route path="/analysis" element={<AnalysesTableau />} />
          <Route path="/rapports-page" element={<RapportsPage />} />
          <Route path="/profil" element={<ProfileTab />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
