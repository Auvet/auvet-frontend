import { Box, Title, Text, Paper, SimpleGrid, Group } from '@mantine/core';
import { IconUser, IconPaw, IconCalendarEvent, IconVaccine } from '@tabler/icons-react';

export function FuncionarioHome() {
  return (
    <Box style={{ padding: '40px' }}>
      <Box mb="xl">
        <Title order={2} fw={700} style={{ color: '#1a1a1a', letterSpacing: '0.02em', marginBottom: 8 }}>
          Dashboard
        </Title>
        <Text size="lg" c="dimmed">
          Bem-vindo ao sistema de gestão veterinária
        </Text>
      </Box>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
        <Paper
          p="xl"
          radius="md"
          withBorder
          style={{
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
          }}
        >
          <Group gap="md">
            <Box
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: '#f8753715',
                color: '#f87537',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconUser size={24} />
            </Box>
            <Box>
              <Text size="sm" c="dimmed" fw={500}>Tutores</Text>
              <Text size="xl" fw={700} style={{ color: '#1a1a1a' }}>Gestão</Text>
            </Box>
          </Group>
        </Paper>

        <Paper
          p="xl"
          radius="md"
          withBorder
          style={{
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
          }}
        >
          <Group gap="md">
            <Box
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: '#f8753715',
                color: '#f87537',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconPaw size={24} />
            </Box>
            <Box>
              <Text size="sm" c="dimmed" fw={500}>Animais</Text>
              <Text size="xl" fw={700} style={{ color: '#1a1a1a' }}>Gestão</Text>
            </Box>
          </Group>
        </Paper>

        <Paper
          p="xl"
          radius="md"
          withBorder
          style={{
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
          }}
        >
          <Group gap="md">
            <Box
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: '#f8753715',
                color: '#f87537',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconCalendarEvent size={24} />
            </Box>
            <Box>
              <Text size="sm" c="dimmed" fw={500}>Consultas</Text>
              <Text size="xl" fw={700} style={{ color: '#1a1a1a' }}>Gestão</Text>
            </Box>
          </Group>
        </Paper>

        <Paper
          p="xl"
          radius="md"
          withBorder
          style={{
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
          }}
        >
          <Group gap="md">
            <Box
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: '#f8753715',
                color: '#f87537',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconVaccine size={24} />
            </Box>
            <Box>
              <Text size="sm" c="dimmed" fw={500}>Vacinas</Text>
              <Text size="xl" fw={700} style={{ color: '#1a1a1a' }}>Gestão</Text>
            </Box>
          </Group>
        </Paper>
      </SimpleGrid>
    </Box>
  );
}

