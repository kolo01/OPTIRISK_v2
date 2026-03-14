import { Route, Routes, Outlet } from "react-router-dom";
import LoginPage from "./pages/Login";
import AuthenticatedGuard from "./guards/AuthenticatedGuard";
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
// Import des pages ADMIN
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import UtilisateursActifs from "./pages/admin/UtilisateursActifs";
import UserDetailPage from "./pages/admin/UserDetail";
import JournalActivite from "./pages/admin/JournalActivite";

// Import du layout
import Layout from "./components/layouts/Index";
import Dashboard from "./pages/Dashboard";
import AnalysesTableau from "./components/Analysis/analysesTables";
import EditAnalysis from "./components/Analysis/EditAnalysis";
import ShowAnalysis from "./components/Analysis/showAnalyse";
import AdminGuard from "./guards/AdminGuard";

function App() {
  return (
    <Routes>
      {/* Routes ADMIN avec Layout */}
      <Route
        path="/admin"
        element={
          <AdminGuard>
          <Layout>
            <Outlet />
          </Layout>
          </AdminGuard>
        }
      >
        <Route index element={<AdminGuard><DashboardAdmin /></AdminGuard>} />
        <Route path="/admin/dashboard" element={<AdminGuard><DashboardAdmin /></AdminGuard>} />
        <Route path="/admin/utilisateurs" element={<AdminGuard><UtilisateursActifs /></AdminGuard>} />
        <Route path="/admin/utilisateurs/:slug" element={<AdminGuard><UserDetailPage /></AdminGuard>} />
        <Route path="/admin/journal" element={<AdminGuard><JournalActivite /></AdminGuard>} />
      </Route>

      {/* Routes sans layout (pages d'authentification) */}
      <Route path="/" element={<AuthenticatedGuard><LoginPage /></AuthenticatedGuard>} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/setup-mfa" element={<SetupMFA />} />
      <Route path="/token-warning" element={<TokenWarning />} />

      <Route path="/activate-account" element={<EmailVerificationSuccess />} />

      {/* Dashboard/Accueil */}

      {/* Pages principales */}

      <Route
        path="/analysis-tab"
        element={
          <Layout>
            <AnalysisTab />
          </Layout>
        }
      />

      <Route
        path="/edit-analysis-tab/:slug"
        element={
          <Layout>
            <EditAnalysis/>
          </Layout>
        }
      />
      <Route
        path="/showanalysis/:slug"
        element={
          <Layout>
            <ShowAnalysis />
          </Layout>
        }
      />

      <Route
        path="/analysis"
        element={
          <Layout>
            <AnalysesTableau />
          </Layout>
        }
      />

      <Route
        path="/rapports-page"
        element={
          <Layout>
            <RapportsPage />
          </Layout>
        }
      />

      {/* Profil et paramètres */}

      <Route
        path="/profil"
        element={
          <Layout>
            <ProfileTab />
          </Layout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
