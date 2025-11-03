import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { VacinaRepository } from '@/repositories/VacinaRepository';
import { AnimalClinicaRepository } from '@/repositories/AnimalClinicaRepository';
import { getCnpj } from '@/utils/storage';
import type { Vacina } from '@/interfaces/vacina';
import { Paper, Table, Text, Title, Button, ActionIcon, Group, Modal, TextInput, Select, Stack, Grid, Collapse, Box, Card, Divider, Badge } from '@mantine/core';
import { IconEdit, IconTrash, IconFilter, IconX } from '@tabler/icons-react';
import { VACINAS, FABRICANTES_VACINAS } from '@/utils/enums';

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

const vacinaRepo = new VacinaRepository();
const animalClinicaRepo = new AnimalClinicaRepository();

export function VacinasList() {
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Vacina | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Vacina | null>(null);
  const [editForm, setEditForm] = useState({
    nome: '',
    fabricante: '',
    dataAplicacao: '',
    dataValidade: '',
    animalId: '',
  });
  const [vacinaOutros, setVacinaOutros] = useState('');
  const [fabricanteOutros, setFabricanteOutros] = useState('');
  const [animais, setAnimais] = useState<Array<{ id: number; nome: string; especie: string | null; tutorNome?: string }>>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    nome: '',
    fabricante: '',
    dataAplicacaoInicio: '',
    dataAplicacaoFim: '',
    dataValidadeInicio: '',
    dataValidadeFim: '',
    animalId: '',
    tutorNome: '',
    statusValidade: '',
  });

  useEffect(() => {
    const cnpj = getCnpj();
    if (cnpj) {
      loadVacinas();
      loadAnimais();
    }
  }, []);

  async function loadVacinas() {
    const cnpj = getCnpj();
    if (!cnpj) {
      setError('CNPJ da clínica não encontrado.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await vacinaRepo.getAll();
      const vacinasFiltradas = (res.data || []).filter(v => v.clinicaCnpj === cnpj);
      setVacinas(vacinasFiltradas);
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
      const animaisList = (res.data || [])
        .map(item => ({
          id: item.animal?.id || 0,
          nome: item.animal?.nome || '',
          especie: item.animal?.especie || null,
          tutorNome: item.animal?.tutor?.usuario?.nome || undefined,
        }))
        .filter(a => a.id > 0 && a.nome);
      setAnimais(animaisList);
    } catch (e) {
      console.error('Erro ao carregar animais:', e);
      setError('Erro ao carregar animais da clínica.');
    }
  }

  function openEdit(vacina: Vacina) {
    setEditing(vacina);
    const isOutros = !VACINAS.some(v => v.value === vacina.nome);
    const isFabricanteOutros = vacina.fabricante && !FABRICANTES_VACINAS.some(f => f.value === vacina.fabricante);
    
    setEditForm({
      nome: isOutros && vacina.nome ? 'Outros' : vacina.nome,
      fabricante: isFabricanteOutros && vacina.fabricante ? 'Outros' : (vacina.fabricante || ''),
      dataAplicacao: vacina.dataAplicacao.split('T')[0],
      dataValidade: vacina.dataValidade ? vacina.dataValidade.split('T')[0] : '',
      animalId: vacina.animalId.toString(),
    });
    setVacinaOutros(isOutros && vacina.nome ? vacina.nome : '');
    setFabricanteOutros(isFabricanteOutros && vacina.fabricante ? vacina.fabricante : '');
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

      const nomeVacina = editForm.nome === 'Outros' ? vacinaOutros : editForm.nome;
      if (!nomeVacina) {
        setError('Nome da vacina é obrigatório.');
        setLoading(false);
        return;
      }

      const fabricanteFinal = editForm.fabricante === 'Outros' ? fabricanteOutros : editForm.fabricante;

      await vacinaRepo.update(editing.id, {
        nome: nomeVacina,
        fabricante: fabricanteFinal || null,
        dataAplicacao: editForm.dataAplicacao,
        dataValidade: editForm.dataValidade || null,
        animalId: animalId,
        clinicaCnpj: cnpj,
      });
      
      setEditing(null);
      await loadVacinas();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(vacina: Vacina) {
    try {
      setLoading(true);
      setError(null);
      await vacinaRepo.delete(vacina.id);
      setDeleteConfirm(null);
      await loadVacinas();
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

  function isVencida(dataValidade: string | null): boolean {
    if (!dataValidade) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const validade = new Date(dataValidade);
    validade.setHours(0, 0, 0, 0);
    return validade < hoje;
  }

  function isVencendo(dataValidade: string | null): boolean {
    if (!dataValidade) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const validade = new Date(dataValidade);
    validade.setHours(0, 0, 0, 0);
    const diasRestantes = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diasRestantes >= 0 && diasRestantes <= 30;
  }

  function clearFilters() {
    setFilters({
      nome: '',
      fabricante: '',
      dataAplicacaoInicio: '',
      dataAplicacaoFim: '',
      dataValidadeInicio: '',
      dataValidadeFim: '',
      animalId: '',
      tutorNome: '',
      statusValidade: '',
    });
  }

  const filteredVacinas = useMemo(() => {
    return vacinas.filter((vacina) => {
      const animal = animais.find(a => a.id === vacina.animalId);

      if (filters.nome && !vacina.nome.toLowerCase().includes(filters.nome.toLowerCase())) {
        return false;
      }

      if (filters.fabricante && (!vacina.fabricante || !vacina.fabricante.toLowerCase().includes(filters.fabricante.toLowerCase()))) {
        return false;
      }

      if (filters.dataAplicacaoInicio) {
        const dataAplicacao = new Date(vacina.dataAplicacao);
        const dataInicio = new Date(filters.dataAplicacaoInicio);
        dataInicio.setHours(0, 0, 0, 0);
        dataAplicacao.setHours(0, 0, 0, 0);
        if (dataAplicacao < dataInicio) {
          return false;
        }
      }

      if (filters.dataAplicacaoFim) {
        const dataAplicacao = new Date(vacina.dataAplicacao);
        const dataFim = new Date(filters.dataAplicacaoFim);
        dataFim.setHours(23, 59, 59, 999);
        dataAplicacao.setHours(0, 0, 0, 0);
        if (dataAplicacao > dataFim) {
          return false;
        }
      }

      if (filters.dataValidadeInicio && vacina.dataValidade) {
        const dataValidade = new Date(vacina.dataValidade);
        const dataInicio = new Date(filters.dataValidadeInicio);
        dataInicio.setHours(0, 0, 0, 0);
        dataValidade.setHours(0, 0, 0, 0);
        if (dataValidade < dataInicio) {
          return false;
        }
      }

      if (filters.dataValidadeFim && vacina.dataValidade) {
        const dataValidade = new Date(vacina.dataValidade);
        const dataFim = new Date(filters.dataValidadeFim);
        dataFim.setHours(23, 59, 59, 999);
        dataValidade.setHours(0, 0, 0, 0);
        if (dataValidade > dataFim) {
          return false;
        }
      }

      if (filters.dataValidadeInicio && !vacina.dataValidade) {
        return false;
      }

      if (filters.dataValidadeFim && !vacina.dataValidade) {
        return false;
      }

      if (filters.animalId && vacina.animalId !== parseInt(filters.animalId)) {
        return false;
      }

      if (filters.tutorNome && !animal?.tutorNome?.toLowerCase().includes(filters.tutorNome.toLowerCase())) {
        return false;
      }

      if (filters.statusValidade) {
        if (filters.statusValidade === 'vencida' && !isVencida(vacina.dataValidade)) {
          return false;
        }
        if (filters.statusValidade === 'vencendo' && !isVencendo(vacina.dataValidade)) {
          return false;
        }
        if (filters.statusValidade === 'valida' && (isVencida(vacina.dataValidade) || isVencendo(vacina.dataValidade) || !vacina.dataValidade)) {
          return false;
        }
      }

      return true;
    });
  }, [vacinas, filters, animais]);

  return (
    <Box style={{ padding: '40px' }}>
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2} fw={700} style={{ color: '#1a1a1a', letterSpacing: '0.02em', marginBottom: 8 }}>
            Vacinas
          </Title>
          <Text size="lg" c="dimmed">
            Gerencie as vacinas aplicadas nos animais da clínica
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
          <Button component={Link} to="/dashboard/admin/vacinas/nova">
            Nova Vacina
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
                label="Nome da Vacina"
                placeholder="Digite o nome da vacina"
                value={filters.nome}
                onChange={(e) => setFilters({ ...filters, nome: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Fabricante"
                placeholder="Digite o fabricante"
                value={filters.fabricante}
                onChange={(e) => setFilters({ ...filters, fabricante: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Data Aplicação Início"
                type="date"
                value={filters.dataAplicacaoInicio}
                onChange={(e) => setFilters({ ...filters, dataAplicacaoInicio: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Data Aplicação Fim"
                type="date"
                value={filters.dataAplicacaoFim}
                onChange={(e) => setFilters({ ...filters, dataAplicacaoFim: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Data Validade Início"
                type="date"
                value={filters.dataValidadeInicio}
                onChange={(e) => setFilters({ ...filters, dataValidadeInicio: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Data Validade Fim"
                type="date"
                value={filters.dataValidadeFim}
                onChange={(e) => setFilters({ ...filters, dataValidadeFim: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Status de Validade"
                placeholder="Selecione o status"
                value={filters.statusValidade || null}
                onChange={(v) => setFilters({ ...filters, statusValidade: v || '' })}
                data={[
                  { value: 'valida', label: 'Válida' },
                  { value: 'vencendo', label: 'Vencendo (30 dias)' },
                  { value: 'vencida', label: 'Vencida' },
                ]}
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
            <Grid.Col span={12}>
              <TextInput
                label="Nome do Tutor"
                placeholder="Digite o nome do tutor"
                value={filters.tutorNome}
                onChange={(e) => setFilters({ ...filters, tutorNome: e.currentTarget.value })}
              />
            </Grid.Col>
          </Grid>
          <Text size="xs" c="dimmed" mt="sm">
            Mostrando {filteredVacinas.length} de {vacinas.length} vacinas
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
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Nome</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Fabricante</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Data Aplicação</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Data Validade</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Animal</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Tutor</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredVacinas.map((vacina) => {
                  const animal = animais.find(a => a.id === vacina.animalId);
                  const vencida = isVencida(vacina.dataValidade);
                  const vencendo = isVencendo(vacina.dataValidade);
                  
                  return (
                  <Table.Tr key={vacina.id} style={{ transition: 'background-color 0.2s' }}>
                    <Table.Td style={{ padding: '16px' }}>{vacina.nome}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{vacina.fabricante || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{formatDate(vacina.dataAplicacao)}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>
                      <Text c={vencida ? 'red' : vencendo ? 'yellow' : 'green'}>
                        {vacina.dataValidade ? formatDate(vacina.dataValidade) : '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{animal?.nome || `Animal #${vacina.animalId}`}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{animal?.tutorNome || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>
                      <Group gap="xs">
                        <ActionIcon color="blue" variant="light" onClick={() => openEdit(vacina)}>
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon color="red" variant="light" onClick={() => setDeleteConfirm(vacina)}>
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                  );
                })}
                {filteredVacinas.length === 0 && vacinas.length > 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--mantine-color-dimmed)' }}>
                      Nenhuma vacina encontrada com os filtros aplicados.
                    </Table.Td>
                  </Table.Tr>
                )}
                {vacinas.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--mantine-color-dimmed)' }}>
                      Nenhuma vacina encontrada para esta clínica.
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Box>

          <Stack gap="md" hiddenFrom="md">
            {filteredVacinas.map((vacina) => {
              const animal = animais.find(a => a.id === vacina.animalId);
              const vencida = isVencida(vacina.dataValidade);
              const vencendo = isVencendo(vacina.dataValidade);
              
              return (
                <Card key={vacina.id} withBorder p="md" radius="md" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                  <Group justify="space-between" mb="xs">
                    <Title order={4} style={{ color: '#1a1a1a' }}>
                      {vacina.nome}
                    </Title>
                    <Group gap="xs">
                      <ActionIcon color="blue" variant="light" onClick={() => openEdit(vacina)}>
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon color="red" variant="light" onClick={() => setDeleteConfirm(vacina)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                  <Divider mb="sm" />
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Fabricante</Text>
                      <Text size="sm" fw={500}>{vacina.fabricante || '-'}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Data Aplicação</Text>
                      <Text size="sm" fw={500}>{formatDate(vacina.dataAplicacao)}</Text>
                    </Group>
                    <Group justify="space-between" align="center">
                      <Text size="sm" c="dimmed">Data Validade</Text>
                      {vacina.dataValidade ? (
                        <Badge color={vencida ? 'red' : vencendo ? 'yellow' : 'green'} variant="light">
                          {formatDate(vacina.dataValidade)}
                        </Badge>
                      ) : (
                        <Text size="sm" fw={500}>-</Text>
                      )}
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Animal</Text>
                      <Text size="sm" fw={500}>{animal?.nome || `Animal #${vacina.animalId}`}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Tutor</Text>
                      <Text size="sm" fw={500}>{animal?.tutorNome || '-'}</Text>
                    </Group>
                  </Stack>
                </Card>
              );
            })}
            {filteredVacinas.length === 0 && vacinas.length > 0 && (
              <Card withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
                <Text c="dimmed">Nenhuma vacina encontrada com os filtros aplicados.</Text>
              </Card>
            )}
            {vacinas.length === 0 && (
              <Card withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
                <Text c="dimmed">Nenhuma vacina encontrada para esta clínica.</Text>
              </Card>
            )}
          </Stack>
        </>
      )}
        </Box>

      <Modal opened={editing !== null} onClose={() => setEditing(null)} title="Editar Vacina" size="lg">
        <Stack gap="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Nome da Vacina"
                required
                placeholder="Selecione a vacina"
                value={editForm.nome}
                onChange={(v) => setEditForm({ ...editForm, nome: v || '' })}
                data={VACINAS}
                searchable
              />
            </Grid.Col>
            {editForm.nome === 'Outros' && (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Especifique o nome da vacina"
                  required
                  placeholder="Digite o nome da vacina"
                  value={vacinaOutros}
                  onChange={(e) => setVacinaOutros(e.currentTarget.value)}
                />
              </Grid.Col>
            )}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Fabricante"
                placeholder="Selecione o fabricante"
                value={editForm.fabricante}
                onChange={(v) => setEditForm({ ...editForm, fabricante: v || '' })}
                data={FABRICANTES_VACINAS}
                searchable
                clearable
              />
            </Grid.Col>
            {editForm.fabricante === 'Outros' && (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Especifique o fabricante"
                  placeholder="Digite o nome do fabricante"
                  value={fabricanteOutros}
                  onChange={(e) => setFabricanteOutros(e.currentTarget.value)}
                />
              </Grid.Col>
            )}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Data de Aplicação"
                type="date"
                required
                value={editForm.dataAplicacao}
                onChange={(e) => setEditForm({ ...editForm, dataAplicacao: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Data de Validade"
                type="date"
                value={editForm.dataValidade}
                onChange={(e) => setEditForm({ ...editForm, dataValidade: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={12}>
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
            Tem certeza que deseja excluir a vacina <strong>{deleteConfirm?.nome || deleteConfirm?.id}</strong>?
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

