import { useEffect, useState } from 'react';
import { ConsultaRepository } from '@/repositories/ConsultaRepository';
import { AnimalClinicaRepository } from '@/repositories/AnimalClinicaRepository';
import { FuncionarioClinicaRepository } from '@/repositories/FuncionarioClinicaRepository';
import { getCnpj, getToken } from '@/utils/storage';
import { decodeJWT } from '@/utils/jwt';
import { cleanCPF } from '@/utils/cpfCnpj';
import type { Consulta } from '@/interfaces/consulta';
import { Paper, Table, Text, Title, Box, Badge } from '@mantine/core';

const consultaRepo = new ConsultaRepository();
const animalClinicaRepo = new AnimalClinicaRepository();
const funcionarioClinicaRepo = new FuncionarioClinicaRepository();

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

export function TutorConsultas() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [animais, setAnimais] = useState<Array<{ id: number; nome: string }>>([]);
  const [funcionarios, setFuncionarios] = useState<Array<{ cpf: string; nome: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
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
      const funcionariosRes = await funcionarioClinicaRepo.listByClinica(cnpj);

      if (animaisClinicaRes.data) {
        const cleanTutorCpf = cleanCPF(tutorCpf);
        const animaisFiltrados = animaisClinicaRes.data
          .filter(item => {
            const animalTutorCpf = item.animal?.tutorCpf || item.animal?.tutor?.cpf;
            if (!animalTutorCpf) return false;
            const cleanAnimalTutorCpf = cleanCPF(animalTutorCpf);
            return cleanAnimalTutorCpf === cleanTutorCpf;
          })
          .map(item => ({ id: item.animalId, nome: item.animal?.nome || '' }))
          .filter(a => a.id && a.nome);

        setAnimais(animaisFiltrados);

        const animalIds = animaisFiltrados.map(a => a.id);
        const allConsultas: Consulta[] = [];

        for (const animalId of animalIds) {
          try {
            const consultasRes = await consultaRepo.getByAnimalId(animalId);
            if (consultasRes.data) {
              allConsultas.push(...consultasRes.data);
            }
          } catch (err) {
            console.error(`Erro ao carregar consultas do animal ${animalId}:`, err);
          }
        }

        setConsultas(allConsultas);
      }

      if (funcionariosRes.data) {
        const funcionariosList = funcionariosRes.data
          .map(item => ({
            cpf: item.funcionarioCpf,
            nome: item.funcionario?.usuario?.nome || '',
          }))
          .filter(f => f.nome);
        setFuncionarios(funcionariosList);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'realizada':
        return 'green';
      case 'agendada':
        return 'blue';
      case 'cancelada':
        return 'red';
      case 'remarcada':
        return 'yellow';
      default:
        return 'gray';
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case 'realizada':
        return 'Realizada';
      case 'agendada':
        return 'Agendada';
      case 'cancelada':
        return 'Cancelada';
      case 'remarcada':
        return 'Remarcada';
      default:
        return status;
    }
  }

  return (
    <Box style={{ padding: '40px' }}>
      <Box mb="xl">
        <Title order={2} fw={700} style={{ color: '#1a1a1a', letterSpacing: '0.02em', marginBottom: 8 }}>
          Consultas dos Meus Animais
        </Title>
        <Text size="lg" c="dimmed">
          Consultas dos seus animais vinculados à clínica
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
          {error && <Text c="red" mb="md">{error}</Text>}
          
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
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Data</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Hora</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Animal</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Funcionário</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Motivo</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {consultas.map((consulta) => {
                  const animal = animais.find(a => a.id === consulta.animalId);
                  const funcionario = funcionarios.find(f => f.cpf === consulta.funcionarioCpf);
                  
                  return (
                    <Table.Tr key={consulta.id} style={{ transition: 'background-color 0.2s' }}>
                      <Table.Td style={{ padding: '16px' }}>{formatDate(consulta.data)}</Table.Td>
                      <Table.Td style={{ padding: '16px' }}>{formatTime(consulta.hora)}</Table.Td>
                      <Table.Td style={{ padding: '16px' }}>{animal?.nome || `Animal #${consulta.animalId}`}</Table.Td>
                      <Table.Td style={{ padding: '16px' }}>{funcionario?.nome || '-'}</Table.Td>
                      <Table.Td style={{ padding: '16px' }}>{consulta.motivo || '-'}</Table.Td>
                      <Table.Td style={{ padding: '16px' }}>
                        <Badge color={getStatusColor(consulta.status)}>
                          {getStatusLabel(consulta.status)}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
                {consultas.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--mantine-color-dimmed)' }}>
                      Nenhuma consulta encontrada para seus animais vinculados à clínica.
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

