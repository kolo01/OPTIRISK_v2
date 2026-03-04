import { Route, Routes, Outlet } from 'react-router-dom'
import LoginPage from './pages/Login'
import Inscription from './pages/Inscription'
import ResetPassword from './pages/ResetPassword'
import ForgotPassword from './pages/ForgotPassword'
import ChangePassword from './pages/ChangePassword'
import SetupMFA from './pages/SetupMFA'
import ProfileTab from './pages/ProfileTab'
import RapportsPage from './pages/RapportsPage'
import TokenWarning from './pages/TokenWarning'
import EmailVerificationSuccess from './pages/EmailVerificationSuccess'
import AnalysisTab from './components/Analysis/AnalysisTab'
// Import des pages ADMIN
import DashboardAdmin from './pages/admin/DashboardAdmin'
import UtilisateursActifs from './pages/admin/UtilisateursActifs'
import JournalActivite from './pages/admin/JournalActivite'


// Import du layout
import Layout from './components/layouts/Index';
import Dashboard from './pages/Dashboard'
import AnalysesTableau from './components/Analysis/analysesTables'

function App() {
  return (
    <Routes>
      {/* Routes ADMIN avec Layout */}
      <Route path="/admin" element={<Layout><Outlet /></Layout>}>
        <Route index element={<DashboardAdmin />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/utilisateurs" element={<UtilisateursActifs />} />
        <Route path="/admin/journal" element={<JournalActivite />} />
      </Route>

      {/* Routes sans layout (pages d'authentification) */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/setup-mfa" element={<SetupMFA />} />
      <Route path="/token-warning" element={<TokenWarning />} />
      
      <Route path="/activate-account" element={<EmailVerificationSuccess />} />


        {/* Dashboard/Accueil */}

        {/* Pages principales */}

        <Route path="/analysis-tab" element={
          <Layout>
            <AnalysisTab />
          </Layout>
          } />

           <Route path="/analysis" element={
          <Layout>
            <AnalysesTableau />
          </Layout>
          } />

        <Route path="/rapports-page" element={
          <Layout>
                <RapportsPage />
              </Layout>
              } />
        

        {/* Profil et paramètres */}
        
        <Route path="/profil" element={
          <Layout>
            <ProfileTab />
          </Layout>
        } />
        <Route path="/dashboard" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />

    </Routes>
  )
}

export default App