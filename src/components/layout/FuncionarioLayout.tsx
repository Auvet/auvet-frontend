import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppShell, Group, NavLink, ScrollArea, Text, Title, Button, Stack, Box, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLogout,
  IconUser,
  IconPaw,
  IconCalendarEvent,
  IconVaccine,
  IconList,
  IconPlus,
  IconSettings,
} from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import auvetLogo from '@/assets/auvet-logo.png';

export function FuncionarioLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const [opened, setOpened] = useState({
    tutores: location.pathname.startsWith('/dashboard/funcionario/tutores'),
    animais: location.pathname.startsWith('/dashboard/funcionario/animais'),
    consultas: location.pathname.startsWith('/dashboard/funcionario/consultas'),
    vacinas: location.pathname.startsWith('/dashboard/funcionario/vacinas'),
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
        <style>{`
          [data-mantine-nav-link] {
            transition: all 0.2s ease;
          }
          [data-mantine-nav-link]:hover {
            background-color: var(--mantine-color-gray-1);
          }
          [data-mantine-nav-link][data-active="true"] {
            background-color: var(--mantine-color-orange-0);
            color: var(--mantine-color-orange-9);
          }
        `}</style>
        <ScrollArea style={{ flex: 1 }}>
          <Text fw={600} size="xs" c="dimmed" mt="md" mb={6}>Gestão</Text>
          
          <NavLink
            label="Tutores"
            leftSection={<IconUser size={18} />}
            opened={opened.tutores}
            onChange={() => setOpened((o) => ({ ...o, tutores: !o.tutores }))}
            variant="light"
          >
            <NavLink
              component={Link}
              to="/dashboard/funcionario/tutores"
              label="Lista de tutores"
              leftSection={<IconList size={16} />}
              active={location.pathname === '/dashboard/funcionario/tutores'}
              variant="light"
            />
            <NavLink
              component={Link}
              to="/dashboard/funcionario/tutores/novo"
              label="Cadastrar tutor"
              leftSection={<IconPlus size={16} />}
              active={location.pathname === '/dashboard/funcionario/tutores/novo'}
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
              to="/dashboard/funcionario/animais"
              label="Lista de animais"
              leftSection={<IconList size={16} />}
              active={location.pathname === '/dashboard/funcionario/animais'}
              variant="light"
            />
            <NavLink
              component={Link}
              to="/dashboard/funcionario/animais/novo"
              label="Cadastrar animal"
              leftSection={<IconPlus size={16} />}
              active={location.pathname === '/dashboard/funcionario/animais/novo'}
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
              to="/dashboard/funcionario/consultas"
              label="Lista de consultas"
              leftSection={<IconList size={16} />}
              active={location.pathname === '/dashboard/funcionario/consultas'}
              variant="light"
            />
            <NavLink
              component={Link}
              to="/dashboard/funcionario/consultas/nova"
              label="Cadastrar consulta"
              leftSection={<IconPlus size={16} />}
              active={location.pathname === '/dashboard/funcionario/consultas/nova'}
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
              to="/dashboard/funcionario/vacinas"
              label="Lista de vacinas"
              leftSection={<IconList size={16} />}
              active={location.pathname === '/dashboard/funcionario/vacinas'}
              variant="light"
            />
            <NavLink
              component={Link}
              to="/dashboard/funcionario/vacinas/nova"
              label="Cadastrar vacina"
              leftSection={<IconPlus size={16} />}
              active={location.pathname === '/dashboard/funcionario/vacinas/nova'}
              variant="light"
            />
          </NavLink>

          <Text fw={600} size="xs" c="dimmed" mt="md" mb={6}>Conta</Text>
          <NavLink
            component={Link}
            variant="light"
            to="/dashboard/funcionario/perfil"
            label="Configurações"
            leftSection={<IconSettings size={18} />}
            active={location.pathname.startsWith('/dashboard/funcionario/perfil')}
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

