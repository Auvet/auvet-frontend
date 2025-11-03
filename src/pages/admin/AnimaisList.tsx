import { useEffect, useState, useMemo } from 'react';
import { AnimalClinicaRepository } from '@/repositories/AnimalClinicaRepository';
import { AnimalRepository } from '@/repositories/AnimalRepository';
import { VacinaRepository } from '@/repositories/VacinaRepository';
import { ConsultaRepository } from '@/repositories/ConsultaRepository';
import { FuncionarioClinicaRepository } from '@/repositories/FuncionarioClinicaRepository';
import { getCnpj } from '@/utils/storage';
import type { AnimalClinicaItem } from '@/interfaces/animalClinica';
import type { Vacina } from '@/interfaces/vacina';
import type { Consulta } from '@/interfaces/consulta';
import { Paper, Table, Text, Title, Button, ActionIcon, Group, Modal, TextInput, NumberInput, Select, Stack, Grid, Collapse, Tabs, Badge, Box, Card, Divider } from '@mantine/core';
import { IconEdit, IconTrash, IconFilter, IconX, IconEye, IconVaccine, IconCalendar } from '@tabler/icons-react';
import { ESPECIES_ANIMAIS } from '@/utils/enums';

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

const repo = new AnimalClinicaRepository();
const animalRepo = new AnimalRepository();
const vacinaRepo = new VacinaRepository();
const consultaRepo = new ConsultaRepository();
const funcionarioClinicaRepo = new FuncionarioClinicaRepository();

export function AnimaisList() {
  const [items, setItems] = useState<AnimalClinicaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AnimalClinicaItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AnimalClinicaItem | null>(null);
  const [editForm, setEditForm] = useState({
    nome: '',
    especie: '',
    raca: '',
    sexo: '',
    idade: '',
    peso: '',
  });
  const [especieOutros, setEspecieOutros] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detailsAnimal, setDetailsAnimal] = useState<AnimalClinicaItem | null>(null);
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [funcionarios, setFuncionarios] = useState<Array<{ cpf: string; nome: string }>>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [filters, setFilters] = useState({
    nome: '',
    especie: '',
    raca: '',
    sexo: '',
    tutorNome: '',
    idadeMin: '',
    idadeMax: '',
    pesoMin: '',
    pesoMax: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const cnpj = getCnpj();
    if (!cnpj) {
      setError('CNPJ da clínica não encontrado. Cadastre ou selecione uma clínica.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await repo.listByClinica(cnpj);
      setItems(res.data || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function openEdit(item: AnimalClinicaItem) {
    setEditing(item);
    const especie = item.animal?.especie || '';
    const isOutros = !ESPECIES_ANIMAIS.some(e => e.value === especie);
    
    setEditForm({
      nome: item.animal?.nome || '',
      especie: isOutros && especie ? 'Outros' : especie,
      raca: item.animal?.raca || '',
      sexo: item.animal?.sexo || '',
      idade: item.animal?.idade?.toString() || '',
      peso: item.animal?.peso?.toString() || '',
    });
    setEspecieOutros(isOutros && especie ? especie : '');
  }

  async function handleSaveEdit() {
    if (!editing || !editing.animal) return;
    try {
      setLoading(true);
      setError(null);
      const especieFinal = editForm.especie === 'Outros' ? especieOutros : editForm.especie;
      
      const updateData: any = {
        nome: editForm.nome,
      };
      if (especieFinal) updateData.especie = especieFinal;
      if (editForm.raca) updateData.raca = editForm.raca;
      if (editForm.sexo) updateData.sexo = editForm.sexo;
      if (editForm.idade) updateData.idade = parseInt(editForm.idade);
      if (editForm.peso) updateData.peso = parseFloat(editForm.peso);
      
      await animalRepo.update(editing.animal.id, updateData);
      setEditing(null);
      await loadItems();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(item: AnimalClinicaItem) {
    if (!item.animal) return;
    try {
      setLoading(true);
      setError(null);
      await repo.deleteRelation(item.animal.id, item.clinicaCnpj);
      setDeleteConfirm(null);
      await loadItems();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setFilters({
      nome: '',
      especie: '',
      raca: '',
      sexo: '',
      tutorNome: '',
      idadeMin: '',
      idadeMax: '',
      pesoMin: '',
      pesoMax: '',
    });
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.nome && !item.animal?.nome?.toLowerCase().includes(filters.nome.toLowerCase())) {
        return false;
      }
      if (filters.especie && !item.animal?.especie?.toLowerCase().includes(filters.especie.toLowerCase())) {
        return false;
      }
      if (filters.raca && !item.animal?.raca?.toLowerCase().includes(filters.raca.toLowerCase())) {
        return false;
      }
      if (filters.sexo && item.animal?.sexo !== filters.sexo) {
        return false;
      }
      if (filters.tutorNome && !item.animal?.tutor?.usuario?.nome?.toLowerCase().includes(filters.tutorNome.toLowerCase())) {
        return false;
      }
      if (filters.idadeMin && (!item.animal?.idade || item.animal.idade < parseInt(filters.idadeMin))) {
        return false;
      }
      if (filters.idadeMax && (!item.animal?.idade || item.animal.idade > parseInt(filters.idadeMax))) {
        return false;
      }
      if (filters.pesoMin && (!item.animal?.peso || item.animal.peso < parseFloat(filters.pesoMin))) {
        return false;
      }
      if (filters.pesoMax && (!item.animal?.peso || item.animal.peso > parseFloat(filters.pesoMax))) {
        return false;
      }
      return true;
    });
  }, [items, filters]);

  const uniqueEspecies = useMemo(() => {
    const especies = new Set<string>();
    items.forEach((item) => {
      if (item.animal?.especie) {
        especies.add(item.animal.especie);
      }
    });
    return Array.from(especies).sort().map((e) => ({ value: e, label: e }));
  }, [items]);

  const uniqueRacas = useMemo(() => {
    const racas = new Set<string>();
    items.forEach((item) => {
      if (item.animal?.raca) {
        racas.add(item.animal.raca);
      }
    });
    return Array.from(racas).sort().map((r) => ({ value: r, label: r }));
  }, [items]);

  async function openDetails(item: AnimalClinicaItem) {
    if (!item.animal?.id) return;
    setDetailsAnimal(item);
    setLoadingDetails(true);
    try {
      const cnpj = getCnpj();
      const [vacinasRes, consultasRes, funcionariosRes] = await Promise.all([
        vacinaRepo.getByAnimalId(item.animal.id),
        consultaRepo.getByAnimalId(item.animal.id),
        cnpj ? funcionarioClinicaRepo.listByClinica(cnpj) : Promise.resolve({ data: [] }),
      ]);
      setVacinas(vacinasRes.data || []);
      setConsultas(consultasRes.data || []);
      
      if (funcionariosRes.data) {
        const funcionariosList = funcionariosRes.data
          .map(item => ({
            cpf: item.funcionario?.cpf || '',
            nome: item.funcionario?.usuario?.nome || '',
          }))
          .filter(f => f.cpf && f.nome);
        setFuncionarios(funcionariosList);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoadingDetails(false);
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
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2} fw={700} style={{ color: '#1a1a1a', letterSpacing: '0.02em', marginBottom: 8 }}>
            Animais
          </Title>
          <Text size="lg" c="dimmed">
            Animais vinculados à sua clínica
          </Text>
        </Box>
        <Button
          variant="light"
          leftSection={<IconFilter size={16} />}
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          Filtros
        </Button>
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
                label="Nome do Animal"
                placeholder="Digite o nome"
                value={filters.nome}
                onChange={(e) => setFilters({ ...filters, nome: e.currentTarget.value })}
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
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Espécie"
                placeholder="Digite a espécie"
                value={filters.especie}
                onChange={(e) => setFilters({ ...filters, especie: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Raça"
                placeholder="Digite a raça"
                value={filters.raca}
                onChange={(e) => setFilters({ ...filters, raca: e.currentTarget.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Sexo"
                placeholder="Selecione"
                value={filters.sexo || null}
                onChange={(v) => setFilters({ ...filters, sexo: v || '' })}
                data={[
                  { value: 'M', label: 'Macho' },
                  { value: 'F', label: 'Fêmea' },
                ]}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="Idade Mínima"
                placeholder="0"
                min={0}
                value={filters.idadeMin ? parseInt(filters.idadeMin) : undefined}
                onChange={(v) => setFilters({ ...filters, idadeMin: v?.toString() || '' })}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="Idade Máxima"
                placeholder="0"
                min={0}
                value={filters.idadeMax ? parseInt(filters.idadeMax) : undefined}
                onChange={(v) => setFilters({ ...filters, idadeMax: v?.toString() || '' })}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="Peso Mínimo (kg)"
                placeholder="0.00"
                min={0}
                decimalScale={2}
                value={filters.pesoMin ? parseFloat(filters.pesoMin) : undefined}
                onChange={(v) => setFilters({ ...filters, pesoMin: v?.toString() || '' })}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="Peso Máximo (kg)"
                placeholder="0.00"
                min={0}
                decimalScale={2}
                value={filters.pesoMax ? parseFloat(filters.pesoMax) : undefined}
                onChange={(v) => setFilters({ ...filters, pesoMax: v?.toString() || '' })}
                clearable
              />
            </Grid.Col>
          </Grid>
          <Text size="xs" c="dimmed" mt="sm">
            Mostrando {filteredItems.length} de {items.length} animais
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
      {error && <Text c="red">{error}</Text>}
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
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Espécie</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Raça</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Sexo</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Idade</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Peso (kg)</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Tutor</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredItems.map((it) => (
                  <Table.Tr key={`${it.animalId}-${it.clinicaCnpj}`} style={{ transition: 'background-color 0.2s' }}>
                    <Table.Td style={{ padding: '16px' }}>{it.animal?.nome || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{it.animal?.especie || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{it.animal?.raca || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{it.animal?.sexo || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{it.animal?.idade || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{it.animal?.peso || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{it.animal?.tutor?.usuario?.nome || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>
                      <Group gap="xs">
                        <ActionIcon color="green" variant="light" onClick={() => openDetails(it)}>
                          <IconEye size={16} />
                        </ActionIcon>
                        <ActionIcon color="blue" variant="light" onClick={() => openEdit(it)}>
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon color="red" variant="light" onClick={() => setDeleteConfirm(it)}>
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
                {filteredItems.length === 0 && items.length > 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: 'var(--mantine-color-dimmed)' }}>
                      Nenhum animal encontrado com os filtros aplicados.
                    </Table.Td>
                  </Table.Tr>
                )}
                {items.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: 'var(--mantine-color-dimmed)' }}>
                      Nenhum animal encontrado para esta clínica.
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Box>

          <Stack gap="md" hiddenFrom="md">
            {filteredItems.map((it) => (
              <Card key={`${it.animalId}-${it.clinicaCnpj}`} withBorder p="md" radius="md" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                <Group justify="space-between" mb="xs">
                  <Title order={4} style={{ color: '#1a1a1a' }}>
                    {it.animal?.nome || '-'}
                  </Title>
                  <Group gap="xs">
                    <ActionIcon color="green" variant="light" onClick={() => openDetails(it)}>
                      <IconEye size={16} />
                    </ActionIcon>
                    <ActionIcon color="blue" variant="light" onClick={() => openEdit(it)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon color="red" variant="light" onClick={() => setDeleteConfirm(it)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
                <Divider mb="sm" />
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Espécie</Text>
                    <Text size="sm" fw={500}>{it.animal?.especie || '-'}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Raça</Text>
                    <Text size="sm" fw={500}>{it.animal?.raca || '-'}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Sexo</Text>
                    <Text size="sm" fw={500}>{it.animal?.sexo || '-'}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Idade</Text>
                    <Text size="sm" fw={500}>{it.animal?.idade || '-'}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Peso</Text>
                    <Text size="sm" fw={500}>{it.animal?.peso ? `${it.animal.peso} kg` : '-'}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Tutor</Text>
                    <Text size="sm" fw={500}>{it.animal?.tutor?.usuario?.nome || '-'}</Text>
                  </Group>
                </Stack>
              </Card>
            ))}
            {filteredItems.length === 0 && items.length > 0 && (
              <Card withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
                <Text c="dimmed">Nenhum animal encontrado com os filtros aplicados.</Text>
              </Card>
            )}
            {items.length === 0 && (
              <Card withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
                <Text c="dimmed">Nenhum animal encontrado para esta clínica.</Text>
              </Card>
            )}
          </Stack>
        </>
      )}
        </Box>

      <Modal opened={editing !== null} onClose={() => setEditing(null)} title="Editar Animal">
        <Stack gap="md">
          <TextInput
            label="Nome"
            value={editForm.nome}
            onChange={(e) => setEditForm({ ...editForm, nome: e.currentTarget.value })}
            required
          />
          <Select
            label="Espécie"
            placeholder="Selecione a espécie"
            value={editForm.especie || null}
            onChange={(v) => setEditForm({ ...editForm, especie: v || '' })}
            data={ESPECIES_ANIMAIS}
            searchable
            clearable
          />
          {editForm.especie === 'Outros' && (
            <TextInput
              label="Especifique a espécie"
              required
              placeholder="Digite a espécie"
              value={especieOutros}
              onChange={(e) => setEspecieOutros(e.currentTarget.value)}
            />
          )}
          <TextInput
            label="Raça"
            value={editForm.raca}
            onChange={(e) => setEditForm({ ...editForm, raca: e.currentTarget.value })}
          />
          <Select
            label="Sexo"
            value={editForm.sexo}
            onChange={(v) => setEditForm({ ...editForm, sexo: v || '' })}
            data={[
              { value: 'M', label: 'Macho' },
              { value: 'F', label: 'Fêmea' },
            ]}
          />
          <NumberInput
            label="Idade"
            value={editForm.idade ? parseInt(editForm.idade) : undefined}
            onChange={(v) => setEditForm({ ...editForm, idade: v?.toString() || '' })}
            min={0}
          />
          <NumberInput
            label="Peso (kg)"
            value={editForm.peso ? parseFloat(editForm.peso) : undefined}
            onChange={(v) => setEditForm({ ...editForm, peso: v?.toString() || '' })}
            min={0}
            decimalScale={2}
          />
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

      <Modal opened={detailsAnimal !== null} onClose={() => setDetailsAnimal(null)} title={`Detalhes do Animal - ${detailsAnimal?.animal?.nome || ''}`} size="xl">
        <Tabs defaultValue="info">
          <Tabs.List>
            <Tabs.Tab value="info">Informações</Tabs.Tab>
            <Tabs.Tab value="vacinas" leftSection={<IconVaccine size={16} />}>
              Vacinas ({vacinas.length})
            </Tabs.Tab>
            <Tabs.Tab value="consultas" leftSection={<IconCalendar size={16} />}>
              Consultas ({consultas.length})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="info" pt="md">
            <Stack gap="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text size="sm" fw={500}>Nome:</Text>
                  <Text>{detailsAnimal?.animal?.nome || '-'}</Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text size="sm" fw={500}>Espécie:</Text>
                  <Text>{detailsAnimal?.animal?.especie || '-'}</Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text size="sm" fw={500}>Raça:</Text>
                  <Text>{detailsAnimal?.animal?.raca || '-'}</Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text size="sm" fw={500}>Sexo:</Text>
                  <Text>{detailsAnimal?.animal?.sexo === 'M' ? 'Macho' : detailsAnimal?.animal?.sexo === 'F' ? 'Fêmea' : '-'}</Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text size="sm" fw={500}>Idade:</Text>
                  <Text>{detailsAnimal?.animal?.idade ? `${detailsAnimal.animal.idade} anos` : '-'}</Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text size="sm" fw={500}>Peso:</Text>
                  <Text>{detailsAnimal?.animal?.peso ? `${detailsAnimal.animal.peso} kg` : '-'}</Text>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Text size="sm" fw={500}>Tutor:</Text>
                  <Text>{detailsAnimal?.animal?.tutor?.usuario?.nome || '-'}</Text>
                </Grid.Col>
              </Grid>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="vacinas" pt="md">
            {loadingDetails ? (
              <Text>Carregando vacinas...</Text>
            ) : vacinas.length === 0 ? (
              <Text c="dimmed">Nenhuma vacina cadastrada para este animal.</Text>
            ) : (
              <Table withRowBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nome</Table.Th>
                    <Table.Th>Fabricante</Table.Th>
                    <Table.Th>Data Aplicação</Table.Th>
                    <Table.Th>Data Validade</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {vacinas.map((vacina) => (
                    <Table.Tr key={vacina.id}>
                      <Table.Td>{vacina.nome}</Table.Td>
                      <Table.Td>{vacina.fabricante || '-'}</Table.Td>
                      <Table.Td>{formatDate(vacina.dataAplicacao)}</Table.Td>
                      <Table.Td>
                        {vacina.dataValidade ? (
                          <Text c={new Date(vacina.dataValidade) < new Date() ? 'red' : 'green'}>
                            {formatDate(vacina.dataValidade)}
                          </Text>
                        ) : (
                          '-'
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="consultas" pt="md">
            {loadingDetails ? (
              <Text>Carregando consultas...</Text>
            ) : consultas.length === 0 ? (
              <Text c="dimmed">Nenhuma consulta cadastrada para este animal.</Text>
            ) : (
              <Table withRowBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Data</Table.Th>
                    <Table.Th>Hora</Table.Th>
                    <Table.Th>Funcionário</Table.Th>
                    <Table.Th>Motivo</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {consultas.map((consulta) => {
                    const funcionario = funcionarios.find(f => f.cpf === consulta.funcionarioCpf);
                    
                    return (
                      <Table.Tr key={consulta.id}>
                        <Table.Td>{formatDate(consulta.data)}</Table.Td>
                        <Table.Td>{formatTime(consulta.hora)}</Table.Td>
                        <Table.Td>{funcionario?.nome || '-'}</Table.Td>
                        <Table.Td>{consulta.motivo || '-'}</Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(consulta.status)}>
                            {getStatusLabel(consulta.status)}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            )}
          </Tabs.Panel>
        </Tabs>
      </Modal>

      <Modal opened={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Confirmar Exclusão">
        <Stack gap="md">
          <Text>
            Tem certeza que deseja remover <strong>{deleteConfirm?.animal?.nome || deleteConfirm?.animalId}</strong> da clínica?
          </Text>
          <Text size="sm" c="dimmed">
            Esta ação remove apenas o vínculo com a clínica. O animal não será deletado do sistema.
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
