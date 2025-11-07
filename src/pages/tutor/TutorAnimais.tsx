import { useEffect, useState } from 'react';
import { Paper, Table, Text, Title, Box } from '@mantine/core';
import { AnimalClinicaRepository } from '@/repositories/AnimalClinicaRepository';
import { getCnpj, getToken } from '@/utils/storage';
import { decodeJWT } from '@/utils/jwt';
import { cleanCPF } from '@/utils/cpfCnpj';
import type { AnimalClinicaItem } from '@/interfaces/animalClinica';

const animalClinicaRepo = new AnimalClinicaRepository();

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
        opacity: 0.2,
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

export function TutorAnimais() {
  const [animais, setAnimais] = useState<AnimalClinicaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnimais();
  }, []);

  async function loadAnimais() {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        return;
      }

      const decoded = decodeJWT(token);
      const tutorCpf = decoded?.cpf;
      
      if (!tutorCpf) {
        setError('CPF não encontrado no token.');
        return;
      }

      const cnpj = getCnpj();
      if (!cnpj) {
        setError('CNPJ da clínica não encontrado.');
        return;
      }

      const animaisClinicaRes = await animalClinicaRepo.listByClinica(cnpj);

      const animaisData = animaisClinicaRes.data ?? [];
      if (animaisData.length > 0) {
        const cleanTutorCpf = cleanCPF(tutorCpf);
        const animaisFiltrados = animaisData
          .filter((item: AnimalClinicaItem) => {
            const animalTutorCpf = item.animal?.tutorCpf || item.animal?.tutor?.cpf;
            if (!animalTutorCpf) return false;
            const cleanAnimalTutorCpf = cleanCPF(animalTutorCpf);
            return cleanAnimalTutorCpf === cleanTutorCpf;
          })
          .map((item: AnimalClinicaItem) => ({
            animalId: item.animalId,
            clinicaCnpj: cnpj,
            animal: item.animal,
          }));
        setAnimais(animaisFiltrados);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box style={{ padding: '40px' }}>
      <Box mb="xl">
        <Title order={2} fw={700} style={{ color: '#1a1a1a', letterSpacing: '0.02em', marginBottom: 8 }}>
          Meus Animais
        </Title>
        <Text size="lg" c="dimmed">
          Animais vinculados à clínica
        </Text>
      </Box>
      <Paper p="lg" radius="md" withBorder style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }}>
        <FloatingCircle size={80} top="10%" left="5%" delay={0.5} color="#f87537" />
        <FloatingCircle size={60} top="70%" left="2%" delay={1.5} color="#ff9f00" />
        <FloatingCircle size={100} top="40%" left="92%" delay={2} color="#f87537" />
        <FloatingCircle size={50} top="85%" left="95%" delay={0.8} color="#ff9f00" />
        <FloatingCircle size={70} top="20%" left="88%" delay={1.2} color="#f87537" />
        
        <Box style={{ position: 'relative', zIndex: 1 }}>
          {loading && <Text>Carregando...</Text>}
          {error && <Text c="red">{error}</Text>}
          {!loading && !error && (
            <Table
              withRowBorders
              highlightOnHover
              striped
              style={{
                background: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <Table.Thead style={{ background: '#f9f9f9' }}>
                <Table.Tr>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Nome</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Espécie</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Raça</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Sexo</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Idade</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Peso</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {animais.map((item) => (
                  <Table.Tr key={`${item.animalId}-${item.clinicaCnpj}`} style={{ transition: 'background-color 0.2s' }}>
                    <Table.Td style={{ padding: '16px' }}>{item.animal?.nome || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{item.animal?.especie || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{item.animal?.raca || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{item.animal?.sexo || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{item.animal?.idade || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{item.animal?.peso ? `${item.animal.peso} kg` : '-'}</Table.Td>
                  </Table.Tr>
                ))}
                {animais.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--mantine-color-dimmed)' }}>
                      Nenhum animal encontrado vinculado à clínica.
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          )}
        </Box>
      </Paper>
      <style>{`
        @keyframes floating {
          0% { transform: translate(0, 0px); }
          50% { transform: translate(0, -15px); }
          100% { transform: translate(0, 0px); }
        }
      `}</style>
    </Box>
  );
}