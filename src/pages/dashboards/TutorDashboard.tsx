import { Outlet } from 'react-router-dom';
import { TutorLayout } from '@/components/layout/TutorLayout';

export function TutorDashboard() {
  return (
    <TutorLayout>
      <Outlet />
    </TutorLayout>
  );
}


