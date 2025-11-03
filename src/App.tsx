import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { RegisterClinica } from '@/pages/RegisterClinica';
import { AdminDashboard } from '@/pages/dashboards/AdminDashboard';
import { FuncionarioDashboard } from '@/pages/dashboards/FuncionarioDashboard';
import { TutorDashboard } from '@/pages/dashboards/TutorDashboard';
import { FuncionariosList } from '@/pages/admin/FuncionariosList';
import { FuncionarioCreate } from '@/pages/admin/FuncionarioCreate';
import { TutoresList } from '@/pages/admin/TutoresList';
import { TutoresCreate } from '@/pages/admin/TutoresCreate';
import { AnimaisList } from '@/pages/admin/AnimaisList';
import { AnimaisCreate } from '@/pages/admin/AnimaisCreate';
import { ConsultasList } from '@/pages/admin/ConsultasList';
import { ConsultasCreate } from '@/pages/admin/ConsultasCreate';
import { VacinasList } from '@/pages/admin/VacinasList';
import { VacinasCreate } from '@/pages/admin/VacinasCreate';
import { PerfilConfiguracoes } from '@/pages/admin/PerfilConfiguracoes';
import { Metricas } from '@/pages/admin/Metricas';
import { FuncionarioHome } from '@/pages/funcionario/FuncionarioHome';
import { FuncionarioPerfil } from '@/pages/funcionario/FuncionarioPerfil';
import { TutorHome } from '@/pages/tutor/TutorHome';
import { TutorAnimais } from '@/pages/tutor/TutorAnimais';
import { TutorVacinas } from '@/pages/tutor/TutorVacinas';
import { TutorConsultas } from '@/pages/tutor/TutorConsultas';
import { TutorPerfil } from '@/pages/tutor/TutorPerfil';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar-clinica" element={<RegisterClinica />} />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Metricas />} />
          <Route path="funcionarios" element={<FuncionariosList />} />
          <Route path="funcionarios/novo" element={<FuncionarioCreate />} />
          <Route path="tutores" element={<TutoresList />} />
          <Route path="tutores/novo" element={<TutoresCreate />} />
          <Route path="animais" element={<AnimaisList />} />
          <Route path="animais/novo" element={<AnimaisCreate />} />
          <Route path="consultas" element={<ConsultasList />} />
          <Route path="consultas/nova" element={<ConsultasCreate />} />
          <Route path="vacinas/nova" element={<VacinasCreate />} />
          <Route path="vacinas" element={<VacinasList />} />
          <Route path="perfil" element={<PerfilConfiguracoes />} />
        </Route>
        <Route
          path="/dashboard/funcionario"
          element={
            <ProtectedRoute>
              <FuncionarioDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<FuncionarioHome />} />
          <Route path="tutores" element={<TutoresList />} />
          <Route path="tutores/novo" element={<TutoresCreate />} />
          <Route path="animais" element={<AnimaisList />} />
          <Route path="animais/novo" element={<AnimaisCreate />} />
          <Route path="consultas" element={<ConsultasList />} />
          <Route path="consultas/nova" element={<ConsultasCreate />} />
          <Route path="vacinas/nova" element={<VacinasCreate />} />
          <Route path="vacinas" element={<VacinasList />} />
          <Route path="perfil" element={<FuncionarioPerfil />} />
        </Route>
        <Route
          path="/dashboard/tutor"
          element={
            <ProtectedRoute>
              <TutorDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<TutorHome />} />
          <Route path="animais" element={<TutorAnimais />} />
          <Route path="consultas" element={<TutorConsultas />} />
          <Route path="vacinas" element={<TutorVacinas />} />
          <Route path="perfil" element={<TutorPerfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


