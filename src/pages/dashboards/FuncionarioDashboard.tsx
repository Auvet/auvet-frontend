import { Outlet } from 'react-router-dom';
import { FuncionarioLayout } from '@/components/layout/FuncionarioLayout';

export function FuncionarioDashboard() {
  return (
    <FuncionarioLayout>
      <Outlet />
    </FuncionarioLayout>
  );
}


