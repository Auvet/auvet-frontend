import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppShell, Group, NavLink, ScrollArea, Text, Title, Button, Stack, Box, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLogout,
  IconPaw,
  IconCalendarEvent,
  IconVaccine,
  IconList,
  IconSettings,
} from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import auvetLogo from '@/assets/auvet-logo.png';

export function TutorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const [opened, setOpened] = useState({
    animais: location.pathname.startsWith('/dashboard/tutor/animais'),
    consultas: location.pathname.startsWith('/dashboard/tutor/consultas'),
    vacinas: location.pathname.startsWith('/dashboard/tutor/vacinas'),
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
          <Text fw={600} size="xs" c="dimmed" mt="md" mb={6}>Meus Pets</Text>
          
          <NavLink
            component={Link}
            variant="light"
            to="/dashboard/tutor"
            label="Dashboard"
            leftSection={<IconList size={18} />}
            active={location.pathname === '/dashboard/tutor'}
          />

          <NavLink
            label="Animais"
            leftSection={<IconPaw size={18} />}
            opened={opened.animais}
            onChange={() => setOpened((o) => ({ ...o, animais: !o.animais }))}
            variant="light"
          >
            <NavLink
              component={Link}
              to="/dashboard/tutor/animais"
              label="Lista de animais"
              leftSection={<IconList size={16} />}
              active={location.pathname === '/dashboard/tutor/animais'}
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
              to="/dashboard/tutor/consultas"
              label="Lista de consultas"
              leftSection={<IconList size={16} />}
              active={location.pathname === '/dashboard/tutor/consultas'}
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
              to="/dashboard/tutor/vacinas"
              label="Lista de vacinas"
              leftSection={<IconList size={16} />}
              active={location.pathname === '/dashboard/tutor/vacinas'}
              variant="light"
            />
          </NavLink>

          <Text fw={600} size="xs" c="dimmed" mt="md" mb={6}>Conta</Text>
          <NavLink
            component={Link}
            variant="light"
            to="/dashboard/tutor/perfil"
            label="Configurações"
            leftSection={<IconSettings size={18} />}
            active={location.pathname.startsWith('/dashboard/tutor/perfil')}
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

