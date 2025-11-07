import { useEffect, useState, type ReactNode } from 'react';
import { Paper, Title, Text, SimpleGrid, Box, Loader, Group, Container } from '@mantine/core';
import {
  IconPaw,
  IconUsers,
  IconUser,
  IconCalendarEvent,
  IconVaccine,
} from '@tabler/icons-react';
import { getCnpj } from '@/utils/storage';
import { AnimalClinicaRepository } from '@/repositories/AnimalClinicaRepository';
import { FuncionarioClinicaRepository } from '@/repositories/FuncionarioClinicaRepository';
import { TutorClinicaRepository } from '@/repositories/TutorClinicaRepository';
import { ConsultaRepository } from '@/repositories/ConsultaRepository';
import { VacinaRepository } from '@/repositories/VacinaRepository';

function FloatingCircle({ size, top, left, delay = 0, color = '#f87537' }: {
  size: number;
  top: string;
  left: string;
  delay?: number;
  color?: string;
}) {
  return (
    <Box
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        opacity: 0.3,
        top,
        left,
        animation: `floating ${3 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

function BlobShape({ size, top, left, delay = 0, color = '#f87537' }: {
  size: number;
  top: string;
  left: string;
  delay?: number;
  color?: string;
}) {
  return (
    <Box
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '40%',
        background: `linear-gradient(135deg, ${color}80, ${color}40)`,
        top,
        left,
        animation: `floating ${4 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        filter: 'blur(20px)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

const animalClinicaRepo = new AnimalClinicaRepository();
const funcionarioClinicaRepo = new FuncionarioClinicaRepository();
const tutorClinicaRepo = new TutorClinicaRepository();
const consultaRepo = new ConsultaRepository();
const vacinaRepo = new VacinaRepository();

interface MetricCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <Paper
      p="xl"
      radius="md"
      withBorder
      style={{
        height: '100%',
        background: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
      }}
    >
      <Box
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: color,
          opacity: 0.1,
          zIndex: 0,
        }}
      />
      <Box style={{ position: 'relative', zIndex: 1 }}>
        <Group justify="space-between" align="flex-start" mb="md">
          <Box
            style={{
              color,
              padding: '12px',
              borderRadius: '12px',
              background: `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Group>
        <Text size="3xl" fw={700} mb="xs" style={{ color: '#1a1a1a' }}>
          {value}
        </Text>
        <Text size="sm" c="dimmed" fw={500}>
          {title}
        </Text>
      </Box>
    </Paper>
  );
}

export function Metricas() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    animais: 0,
    funcionarios: 0,
    tutores: 0,
    consultas: 0,
    vacinas: 0,
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  async function loadMetrics() {
    try {
      setLoading(true);
      const cnpj = getCnpj();
      if (!cnpj) {
        setLoading(false);
        return;
      }

      const [animaisRes, funcionariosRes, tutoresRes, consultasRes, vacinasRes] = await Promise.all([
        animalClinicaRepo.listByClinica(cnpj),
        funcionarioClinicaRepo.listByClinica(cnpj),
        tutorClinicaRepo.listByClinica(cnpj),
        consultaRepo.getAll(),
        vacinaRepo.getAll(),
      ]);

      const consultas = consultasRes.data?.filter((c) => c.clinicaCnpj === cnpj) || [];
      const vacinas = vacinasRes.data?.filter((v) => v.clinicaCnpj === cnpj) || [];

      setMetrics({
        animais: animaisRes.count || animaisRes.data?.length || 0,
        funcionarios: funcionariosRes.count || funcionariosRes.data?.length || 0,
        tutores: tutoresRes.count || tutoresRes.data?.length || 0,
        consultas: consultas.length,
        vacinas: vacinas.length,
      });
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', position: 'relative' }}>
        <Loader size="lg" color="#f87537" />
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: '100vh', background: 'white', position: 'relative' }}>
      <FloatingCircle size={140} top="12%" left="6%" delay={0.5} />
      <FloatingCircle size={110} top="68%" left="4%" delay={1.2} color="#ff9f00" />
      <BlobShape size={260} top="20%" left="75%" delay={0.8} color="#ff9f00" />
      <BlobShape size={220} top="65%" left="80%" delay={1.5} />
      <Container size="xl" style={{ maxWidth: 1195, paddingLeft: 40, paddingRight: 40, paddingTop: 40, paddingBottom: 60, position: 'relative' }}>
        <Box mb="xl">
          <Title order={1} fw={700} style={{ color: '#1a1a1a', letterSpacing: '0.02em', marginBottom: 8 }}>
            Métricas
          </Title>
          <Text size="lg" c="dimmed">
            Visão geral da sua clínica veterinária
          </Text>
        </Box>
        
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          <MetricCard
            title="Animais Cadastrados"
            value={metrics.animais}
            icon={<IconPaw size={36} />}
            color="#f87537"
          />
          <MetricCard
            title="Funcionários"
            value={metrics.funcionarios}
            icon={<IconUsers size={36} />}
            color="#f87537"
          />
          <MetricCard
            title="Tutores"
            value={metrics.tutores}
            icon={<IconUser size={36} />}
            color="#ff9f00"
          />
          <MetricCard
            title="Consultas"
            value={metrics.consultas}
            icon={<IconCalendarEvent size={36} />}
            color="#ff9f00"
          />
          <MetricCard
            title="Vacinas Aplicadas"
            value={metrics.vacinas}
            icon={<IconVaccine size={36} />}
            color="#f87537"
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
}

