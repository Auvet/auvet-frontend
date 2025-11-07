import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Paper, Table, Text, Title, Button, ActionIcon, Group, Modal, TextInput, Select, Stack, Grid, Collapse, Box, Card, Divider, Textarea } from '@mantine/core';
import { IconEdit, IconTrash, IconFilter, IconX } from '@tabler/icons-react';
import { ConsultaRepository } from '@/repositories/ConsultaRepository';
import { AnimalClinicaRepository } from '@/repositories/AnimalClinicaRepository';
import { FuncionarioClinicaRepository } from '@/repositories/FuncionarioClinicaRepository';
import { getCnpj } from '@/utils/storage';
import type { Consulta } from '@/interfaces/consulta';
import type { AnimalClinicaItem } from '@/interfaces/animalClinica';
import type { FuncionarioClinicaItem } from '@/interfaces/funcionarioClinica';

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

const consultaRepo = new ConsultaRepository();
const animalClinicaRepo = new AnimalClinicaRepository();
const funcionarioClinicaRepo = new FuncionarioClinicaRepository();

const STATUS_CONSULTA = [
  { value: 'agendada', label: 'Agendada' },
  { value: 'realizada', label: 'Realizada' },
  { value: 'cancelada', label: 'Cancelada' },
  { value: 'remarcada', label: 'Remarcada' },
];

export function ConsultasList() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Consulta | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Consulta | null>(null);
  const [editForm, setEditForm] = useState({
    data: '',
    hora: '',
    motivo: '',
    status: 'agendada',
    observacoes: '',
    animalId: '',
    funcionarioCpf: '',
  });
  const [animais, setAnimais] = useState<Array<{ id: number; nome: string; especie: string | null; tutorNome?: string }>>([]);
  const [funcionarios, setFuncionarios] = useState<Array<{ cpf: string; nome: string }>>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    dataInicio: '',
    dataFim: '',
    status: '',
    animalId: '',
    funcionarioCpf: '',
    tutorNome: '',
    motivo: '',
  });

  useEffect(() => {
    const cnpj = getCnpj();
    if (cnpj) {
      loadConsultas();
      loadAnimais();
      loadFuncionarios();
    }
  }, []);

  async function loadConsultas() {
    const cnpj = getCnpj();
    if (!cnpj) {
      setError('CNPJ da clínica não encontrado.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await consultaRepo.getAll();
      const consultasFiltradas = (res.data ?? []).filter((consulta) => consulta.clinicaCnpj === cnpj);
      setConsultas(consultasFiltradas);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function loadAnimais() {
    const cnpj = getCnpj();
    if (!cnpj) {
      setError('CNPJ da clínica não encontrado.');
      return;
    }
    try {
      const res = await animalClinicaRepo.listByClinica(cnpj);
      const animaisList = (res.data ?? [])
        .map((item: AnimalClinicaItem) => ({
          id: item.animal?.id || 0,
          nome: item.animal?.nome || '',
          especie: item.animal?.especie || null,
          tutorNome: item.animal?.tutor?.usuario?.nome || undefined,
        }))
        .filter((animal) => animal.id > 0 && animal.nome);
      setAnimais(animaisList);
    } catch (e) {
      console.error('Erro ao carregar animais:', e);
      setError('Erro ao carregar animais da clínica.');
    }
  }

  async function loadFuncionarios() {
    const cnpj = getCnpj();
    if (!cnpj) {
      setError('CNPJ da clínica não encontrado.');
      return;
    }
    try {
      const res = await funcionarioClinicaRepo.listByClinica(cnpj);
      const funcionariosList = (res.data ?? [])
        .map((item: FuncionarioClinicaItem) => ({
          cpf: item.funcionarioCpf,
          nome: item.funcionario?.usuario?.nome || '',
        }))
        .filter((funcionario) => funcionario.nome && funcionario.cpf);
      setFuncionarios(funcionariosList);
    } catch (e) {
      console.error('Erro ao carregar funcionários:', e);
      setError('Erro ao carregar funcionários da clínica.');
    }
  }

  function openEdit(consulta: Consulta) {
    setEditing(consulta);
    const horaHora = new Date(consulta.hora);
    
    setEditForm({
      data: consulta.data.split('T')[0],
      hora: `${horaHora.getHours().toString().padStart(2, '0')}:${horaHora.getMinutes().toString().padStart(2, '0')}`,
      motivo: consulta.motivo || '',
      status: consulta.status,
      observacoes: consulta.observacoes || '',
      animalId: consulta.animalId.toString(),
      funcionarioCpf: consulta.funcionarioCpf,
    });
  }

  async function handleSaveEdit() {
    if (!editing) return;
    try {
      setLoading(true);
      setError(null);
      
      const cnpj = getCnpj();
      if (!cnpj) {
        setError('CNPJ da clínica não encontrado.');
        setLoading(false);
        return;
      }

      const animalId = parseInt(editForm.animalId);
      const animalExiste = animais.some(a => a.id === animalId);
      if (!animalExiste) {
        setError('Animal selecionado não pertence à clínica.');
        setLoading(false);
        return;
      }

      const funcionarioExiste = funcionarios.some(f => f.cpf === editForm.funcionarioCpf);
      if (!funcionarioExiste) {
        setError('Funcionário selecionado não pertence à clínica.');
        setLoading(false);
        return;
      }

      const dataHora = new Date(editForm.data);
      const [hours, minutes] = editForm.hora.split(':').map(Number);
      const horaHora = new Date(dataHora);
      horaHora.setHours(hours, minutes, 0, 0);

      await consultaRepo.update(editing.id, {
        data: editForm.data,
        hora: horaHora.toISOString(),
        motivo: editForm.motivo || null,
        status: editForm.status,
        observacoes: editForm.observacoes || null,
        animalId: animalId,
        funcionarioCpf: editForm.funcionarioCpf,
        clinicaCnpj: cnpj,
      });
      
      setEditing(null);
      await loadConsultas();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(consulta: Consulta) {
    try {
      setLoading(true);
      setError(null);
      await consultaRepo.delete(consulta.id);
      setDeleteConfirm(null);
      await loadConsultas();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(consulta: Consulta, newStatus: string) {
    try {
      setLoading(true);
      setError(null);
      await consultaRepo.update(consulta.id, { status: newStatus });
      await loadConsultas();
    } catch (e) {
      setError((e as Error).message);
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

  function clearFilters() {
    setFilters({
      dataInicio: '',
      dataFim: '',
      status: '',
      animalId: '',
      funcionarioCpf: '',
      tutorNome: '',
      motivo: '',
    });
  }

  const filteredConsultas = useMemo(() => {
    return consultas.filter((consulta) => {
      const animal = animais.find(a => a.id === consulta.animalId);
      if (filters.dataInicio) {
        const dataConsulta = new Date(consulta.data);
        const dataInicio = new Date(filters.dataInicio);
        dataInicio.setHours(0, 0, 0, 0);
        dataConsulta.setHours(0, 0, 0, 0);
        if (dataConsulta < dataInicio) {
          return false;
        }
      }

      if (filters.dataFim) {
        const dataConsulta = new Date(consulta.data);
        const dataFim = new Date(filters.dataFim);
        dataFim.setHours(23, 59, 59, 999);
        dataConsulta.setHours(0, 0, 0, 0);
        if (dataConsulta > dataFim) {
          return false;
        }
      }

      if (filters.status && consulta.status !== filters.status) {
        return false;
      }

      if (filters.animalId && consulta.animalId !== parseInt(filters.animalId)) {
        return false;
      }

      if (filters.funcionarioCpf && consulta.funcionarioCpf !== filters.funcionarioCpf) {
        return false;
      }

      if (filters.tutorNome && !animal?.tutorNome?.toLowerCase().includes(filters.tutorNome.toLowerCase())) {
        return false;
      }

      if (filters.motivo && !consulta.motivo?.toLowerCase().includes(filters.motivo.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [consultas, filters, animais, funcionarios]);


  return (
    <Box style={{ padding: '40px' }}>
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2} fw={700} style={{ color: '#1a1a1a', letterSpacing: '0.02em', marginBottom: 8 }}>
            Consultas
          </Title>
          <Text size="lg" c="dimmed">
            Gerencie as consultas da clínica
          </Text>
        </Box>
        <Group gap="xs">
          <Button
            variant="light"
            leftSection={<IconFilter size={16} />}
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            Filtros
          </Button>
          <Button component={Link} to="/dashboard/admin/consultas/nova">
            Nova Consulta
          </Button>
        </Group>
      </Group>

      <Collapse in={filtersOpen}>
        <Paper p="md" withBorder mb="md" style={{ background: '#f9f9f9' }}>
          <Group justify="space-between" mb="md">
            <Text fw={500}>Filtros de Busca</Text>
            <Button variant="subtle" size="xs" leftSection={<IconX size={14} />} onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </Group>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Data Início"
                type="date"
                value={filters.dataInicio}
                onChange={(e) => setFilters({ ...filters, dataInicio: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Data Fim"
                type="date"
                value={filters.dataFim}
                onChange={(e) => setFilters({ ...filters, dataFim: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Status"
                placeholder="Selecione o status"
                value={filters.status || null}
                onChange={(v) => setFilters({ ...filters, status: v || '' })}
                data={STATUS_CONSULTA}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Animal"
                placeholder="Selecione o animal"
                value={filters.animalId || null}
                onChange={(v) => setFilters({ ...filters, animalId: v || '' })}
                data={animais.map(a => ({ value: a.id.toString(), label: `${a.nome}${a.especie ? ` (${a.especie})` : ''}` }))}
                searchable
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Funcionário"
                placeholder="Selecione o funcionário"
                value={filters.funcionarioCpf || null}
                onChange={(v) => setFilters({ ...filters, funcionarioCpf: v || '' })}
                data={funcionarios.map(f => ({ value: f.cpf, label: f.nome }))}
                searchable
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Nome do Tutor"
                placeholder="Digite o nome do tutor"
                value={filters.tutorNome}
                onChange={(e) => setFilters({ ...filters, tutorNome: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Motivo"
                placeholder="Digite o motivo da consulta"
                value={filters.motivo}
                onChange={(e) => setFilters({ ...filters, motivo: e.currentTarget.value })}
              />
            </Grid.Col>
          </Grid>
          <Text size="xs" c="dimmed" mt="sm">
            Mostrando {filteredConsultas.length} de {consultas.length} consultas
          </Text>
        </Paper>
      </Collapse>

      <Paper p="lg" radius="md" withBorder style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }} mt="md">
        <FloatingCircle size={80} top="10%" left="5%" delay={0.5} color="#f87537" />
        <FloatingCircle size={60} top="70%" left="2%" delay={1.5} color="#ff9f00" />
        <FloatingCircle size={100} top="40%" left="92%" delay={2} color="#f87537" />
        <FloatingCircle size={50} top="85%" left="95%" delay={0.8} color="#ff9f00" />
        <FloatingCircle size={70} top="20%" left="88%" delay={1.2} color="#f87537" />
        
        <Box style={{ position: 'relative', zIndex: 1 }}>
      {loading && <Text>Carregando...</Text>}
      {error && <Text c="red" mb="md">{error}</Text>}
      
      {!loading && !error && (
        <>
          <Box visibleFrom="md">
            <Table
              withRowBorders
              highlightOnHover
              striped
              style={{
                background: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Table.Thead>
                <Table.Tr style={{ background: '#f9f9f9' }}>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Data</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Hora</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Animal</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Tutor</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Funcionário</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Motivo</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Status</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredConsultas.map((consulta) => {
                  const animal = animais.find(a => a.id === consulta.animalId);
                  const funcionario = funcionarios.find(f => f.cpf === consulta.funcionarioCpf);
                  
                  return (
                  <Table.Tr key={consulta.id} style={{ transition: 'background-color 0.2s' }}>
                    <Table.Td style={{ padding: '16px' }}>{formatDate(consulta.data)}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{formatTime(consulta.hora)}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{animal?.nome || `Animal #${consulta.animalId}`}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{animal?.tutorNome || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{funcionario?.nome || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{consulta.motivo || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>
                      <Select
                        value={consulta.status}
                        onChange={(v) => v && handleStatusChange(consulta, v)}
                        data={STATUS_CONSULTA}
                        size="xs"
                        style={{ width: 150 }}
                      />
                    </Table.Td>
                    <Table.Td style={{ padding: '16px' }}>
                      <Group gap="xs">
                        <ActionIcon color="blue" variant="light" onClick={() => openEdit(consulta)}>
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon color="red" variant="light" onClick={() => setDeleteConfirm(consulta)}>
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                  );
                })}
                {filteredConsultas.length === 0 && consultas.length > 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: 'var(--mantine-color-dimmed)' }}>
                      Nenhuma consulta encontrada com os filtros aplicados.
                    </Table.Td>
                  </Table.Tr>
                )}
                {consultas.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: 'var(--mantine-color-dimmed)' }}>
                      Nenhuma consulta encontrada para esta clínica.
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Box>

          <Stack gap="md" hiddenFrom="md">
            {filteredConsultas.map((consulta) => {
              const animal = animais.find(a => a.id === consulta.animalId);
              const funcionario = funcionarios.find(f => f.cpf === consulta.funcionarioCpf);
              
              return (
                <Card key={consulta.id} withBorder p="md" radius="md" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                  <Group justify="space-between" mb="xs">
                    <Title order={4} style={{ color: '#1a1a1a' }}>
                      {formatDate(consulta.data)} - {formatTime(consulta.hora)}
                    </Title>
                    <Group gap="xs">
                      <ActionIcon color="blue" variant="light" onClick={() => openEdit(consulta)}>
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon color="red" variant="light" onClick={() => setDeleteConfirm(consulta)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                  <Divider mb="sm" />
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Animal</Text>
                      <Text size="sm" fw={500}>{animal?.nome || `Animal #${consulta.animalId}`}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Tutor</Text>
                      <Text size="sm" fw={500}>{animal?.tutorNome || '-'}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Funcionário</Text>
                      <Text size="sm" fw={500}>{funcionario?.nome || '-'}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Motivo</Text>
                      <Text size="sm" fw={500}>{consulta.motivo || '-'}</Text>
                    </Group>
                    <Group justify="space-between" align="center">
                      <Text size="sm" c="dimmed">Status</Text>
                      <Select
                        value={consulta.status}
                        onChange={(v) => v && handleStatusChange(consulta, v)}
                        data={STATUS_CONSULTA}
                        size="xs"
                        style={{ width: 150 }}
                      />
                    </Group>
                  </Stack>
                </Card>
              );
            })}
            {filteredConsultas.length === 0 && consultas.length > 0 && (
              <Card withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
                <Text c="dimmed">Nenhuma consulta encontrada com os filtros aplicados.</Text>
              </Card>
            )}
            {consultas.length === 0 && (
              <Card withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
                <Text c="dimmed">Nenhuma consulta encontrada para esta clínica.</Text>
              </Card>
            )}
          </Stack>
        </>
      )}
        </Box>

      <Modal opened={editing !== null} onClose={() => setEditing(null)} title="Editar Consulta" size="lg">
        <Stack gap="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Data"
                type="date"
                required
                value={editForm.data}
                onChange={(e) => setEditForm({ ...editForm, data: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Hora"
                type="time"
                required
                value={editForm.hora}
                onChange={(e) => setEditForm({ ...editForm, hora: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Animal"
                required
                placeholder="Selecione o animal"
                value={editForm.animalId}
                onChange={(v) => setEditForm({ ...editForm, animalId: v || '' })}
                data={animais.map(a => ({ value: a.id.toString(), label: `${a.nome}${a.especie ? ` (${a.especie})` : ''}` }))}
                searchable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Funcionário"
                required
                placeholder="Selecione o funcionário"
                value={editForm.funcionarioCpf}
                onChange={(v) => setEditForm({ ...editForm, funcionarioCpf: v || '' })}
                data={funcionarios.map(f => ({ value: f.cpf, label: f.nome }))}
                searchable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Motivo"
                placeholder="Motivo da consulta"
                value={editForm.motivo}
                onChange={(e) => setEditForm({ ...editForm, motivo: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Status"
                required
                value={editForm.status}
                onChange={(v) => setEditForm({ ...editForm, status: v || 'agendada' })}
                data={STATUS_CONSULTA}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Observações"
                placeholder="Observações sobre a consulta"
                value={editForm.observacoes}
                onChange={(e) => setEditForm({ ...editForm, observacoes: e.currentTarget.value })}
                minRows={3}
                autosize
              />
            </Grid.Col>
          </Grid>
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} loading={loading}>
              Salvar
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Confirmar Exclusão">
        <Stack gap="md">
          <Text>
            Tem certeza que deseja excluir a consulta do animal <strong>{deleteConfirm?.animal?.nome || deleteConfirm?.id}</strong>?
          </Text>
          <Text size="sm" c="dimmed">
            Esta ação não pode ser desfeita.
          </Text>
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button color="red" onClick={() => deleteConfirm && handleDelete(deleteConfirm)} loading={loading}>
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>
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

