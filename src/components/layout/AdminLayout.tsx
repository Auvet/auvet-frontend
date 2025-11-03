import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppShell, Group, NavLink, ScrollArea, Text, TextInput, Title, Button, Stack, Box, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLogout,
  IconUsers,
  IconUser,
  IconPaw,
  IconCalendarEvent,
  IconVaccine,
  IconList,
  IconPlus,
  IconSettings,
  IconChartBar,
} from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import auvetLogo from '@/assets/auvet-logo.png';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const [opened, setOpened] = useState({
    funcionarios: location.pathname.startsWith('/dashboard/admin/funcionarios'),
    tutores: location.pathname.startsWith('/dashboard/admin/tutores'),
    animais: location.pathname.startsWith('/dashboard/admin/animais'),
    consultas: location.pathname.startsWith('/dashboard/admin/consultas'),
    vacinas: location.pathname.startsWith('/dashboard/admin/vacinas'),
  });

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const prevPathname = useRef(location.pathname);
  const mobileOpenedRef = useRef(mobileOpened);

  useEffect(() => {
    mobileOpenedRef.current = mobileOpened;
  }, [mobileOpened]);

  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      if (window.innerWidth < 768 && mobileOpenedRef.current) {
        toggleMobile();
      }
      prevPathname.current = location.pathname;
    }
  }, [location.pathname, toggleMobile]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
            <Box
              component="img"
              src={auvetLogo}
              alt="AuVet Logo"
              style={{
                width: 40,
                height: 40,
                objectFit: 'contain',
              }}
            />
            <Title order={4} fw={700} style={{ color: '#1a1a1a', letterSpacing: '0.1em', lineHeight: 1.2 }}>
              AUVET
            </Title>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" withBorder style={{ display: 'flex', flexDirection: 'column' }}>
        <TextInput placeholder="Buscar" size="sm" mb="sm" />
        <ScrollArea style={{ flex: 1 }}>
          <NavLink
            component={Link}
            variant="light"
            to="/dashboard/admin"
            label="Métricas"
            leftSection={<IconChartBar size={18} />}
            active={location.pathname === '/dashboard/admin'}
          />
          <Text fw={600} size="xs" c="dimmed" mt="md" mb={6}>Gestão</Text>
          
          <NavLink
            label="Gestão de Funcionários"
            leftSection={<IconUsers size={18} />}
            opened={opened.funcionarios}
            onChange={() => setOpened((o) => ({ ...o, funcionarios: !o.funcionarios }))}
            variant="light"
          >
            <NavLink
              component={Link}
              to="/dashboard/admin/funcionarios"
              label="Lista de funcionários"
              leftSection={<IconList size={16} />}
              active={location.pathname === '/dashboard/admin/funcionarios'}
              variant="light"
            />
            <NavLink
              component={Link}
              to="/dashboard/admin/funcionarios/novo"
              label="Cadastrar funcionário"
              leftSection={<IconPlus size={16} />}
              active={location.pathname === '/dashboard/admin/funcionarios/novo'}
              variant="light"
            />
          </NavLink>

          <NavLink
            label="Tutores"
            leftSection={<IconUser size={18} />}
            opened={opened.tutores}
            onChange={() => setOpened((o) => ({ ...o, tutores: !o.tutores }))}
            variant="light"
          >
            <NavLink
              component={Link}
              to="/dashboard/admin/tutores"
              label="Lista de tutores"
              leftSection={<IconList size={16} />}
              active={location.pathname === '/dashboard/admin/tutores'}
              variant="light"
            />
            <NavLink
              component={Link}
              to="/dashboard/admin/tutores/novo"
              label="Cadastrar tutor"
              leftSection={<IconPlus size={16} />}
              active={location.pathname === '/dashboard/admin/tutores/novo'}
              variant="light"
            />
          </NavLink>

          <NavLink
            label="Animais"
            leftSection={<IconPaw size={18} />}
            opened={opened.animais}
            onChange={() => setOpened((o) => ({ ...o, animais: !o.animais }))}
            variant="light"
          >
            <NavLink
              component={Link}
              to="/dashboard/admin/animais"
              label="Lista de animais"
              leftSection={<IconList size={16} />}
              active={location.pathname === '/dashboard/admin/animais'}
              variant="light"
            />
            <NavLink
              component={Link}
              to="/dashboard/admin/animais/novo"
              label="Cadastrar animal"
              leftSection={<IconPlus size={16} />}
              active={location.pathname === '/dashboard/admin/animais/novo'}
              variant="light"
            />
          </NavLink>

          <NavLink
            label="Consultas"
            leftSection={<IconCalendarEvent size={18} />}
            opened={opened.consultas}
            onChange={() => setOpened((o) => ({ ...o, consultas: !o.consultas }))}
            variant="light"
          >
            <NavLink
              component={Link}
              to="/dashboard/admin/consultas"
              label="Lista de consultas"
              leftSection={<IconList size={16} />}
              active={location.pathname === '/dashboard/admin/consultas'}
              variant="light"
            />
            <NavLink
              component={Link}
              to="/dashboard/admin/consultas/nova"
              label="Cadastrar consulta"
              leftSection={<IconPlus size={16} />}
              active={location.pathname === '/dashboard/admin/consultas/nova'}
              variant="light"
            />
          </NavLink>

          <NavLink
            label="Vacinas"
            leftSection={<IconVaccine size={18} />}
            opened={opened.vacinas}
            onChange={() => setOpened((o) => ({ ...o, vacinas: !o.vacinas }))}
            variant="light"
          >
            <NavLink
              component={Link}
              to="/dashboard/admin/vacinas"
              label="Lista de vacinas"
              leftSection={<IconList size={16} />}
              active={location.pathname === '/dashboard/admin/vacinas'}
              variant="light"
            />
            <NavLink
              component={Link}
              to="/dashboard/admin/vacinas/nova"
              label="Cadastrar vacina"
              leftSection={<IconPlus size={16} />}
              active={location.pathname === '/dashboard/admin/vacinas/nova'}
              variant="light"
            />
          </NavLink>

          <Text fw={600} size="xs" c="dimmed" mt="md" mb={6}>Conta</Text>
          <NavLink
            component={Link}
            variant="light"
            to="/dashboard/admin/perfil"
            label="Configurações"
            leftSection={<IconSettings size={18} />}
            active={location.pathname.startsWith('/dashboard/admin/perfil')}
          />
        </ScrollArea>
        <Stack gap="xs" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
          <Button
            variant="light"
            color="red"
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
            fullWidth
          >
            Sair
          </Button>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}


