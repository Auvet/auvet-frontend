import { useEffect, useState } from 'react';
import { FuncionarioClinicaRepository } from '@/repositories/FuncionarioClinicaRepository';
import { FuncionarioRepository } from '@/repositories/FuncionarioRepository';
import { UsuarioRepository } from '@/repositories/UsuarioRepository';
import { getCnpj } from '@/utils/storage';
import type { FuncionarioClinicaItem } from '@/interfaces/funcionarioClinica';
import { Paper, Table, Text, Title, Button, ActionIcon, Group, Modal, TextInput, Select, Stack, Box, Card, Divider } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { CARGOS_VETERINARIOS } from '@/utils/enums';

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

const repo = new FuncionarioClinicaRepository();
const funcRepo = new FuncionarioRepository();
const usuarioRepo = new UsuarioRepository();

export function FuncionariosList() {
  const [items, setItems] = useState<FuncionarioClinicaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<FuncionarioClinicaItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<FuncionarioClinicaItem | null>(null);
  const [editForm, setEditForm] = useState({ nome: '', email: '', cargo: '', registroProfissional: '', status: 'ativo' });
  const [cargoOutros, setCargoOutros] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const cnpj = getCnpj();
    if (!cnpj) {
      setError('CNPJ da clínica não encontrado. Cadastre ou selecione uma clínica.');
      return;
    }
    (async () => {
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
    })();
  }

  function openEdit(item: FuncionarioClinicaItem) {
    setEditing(item);
    const cargo = item.funcionario?.cargo || '';
    const isOutros = !CARGOS_VETERINARIOS.some(c => c.value === cargo);
    
    setEditForm({
      nome: item.funcionario?.usuario?.nome || '',
      email: item.funcionario?.usuario?.email || '',
      cargo: isOutros && cargo ? 'Outros' : cargo,
      registroProfissional: item.funcionario?.registroProfissional || '',
      status: item.funcionario?.status || 'ativo',
    });
    setCargoOutros(isOutros && cargo ? cargo : '');
  }

  async function handleSaveEdit() {
    if (!editing) return;
    try {
      setLoading(true);
      setError(null);
      
      const cleanCpf = editing.funcionarioCpf.replace(/[^\d]/g, '');
      const cargoFinal = editForm.cargo === 'Outros' ? cargoOutros : editForm.cargo;
      
      if (!cargoFinal) {
        setError('Cargo é obrigatório.');
        setLoading(false);
        return;
      }
      
      await usuarioRepo.update(cleanCpf, {
        nome: editForm.nome,
        email: editForm.email,
      });
      
      await funcRepo.update(cleanCpf, {
        cargo: cargoFinal,
        registroProfissional: editForm.registroProfissional,
        status: editForm.status,
        nivelAcesso: 2,
      });
      
      setEditing(null);
      await loadItems();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(item: FuncionarioClinicaItem) {
    try {
      setLoading(true);
      setError(null);
      await repo.deleteRelation(item.funcionarioCpf, item.clinicaCnpj);
      setDeleteConfirm(null);
      await loadItems();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box style={{ padding: '40px' }}>
      <Box mb="xl">
        <Title order={2} fw={700} style={{ color: '#1a1a1a', letterSpacing: '0.02em', marginBottom: 8 }}>
          Gestão de Funcionários
        </Title>
        <Text size="lg" c="dimmed">
          Funcionários vinculados à sua clínica
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
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>CPF</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Nome</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Cargo</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Status</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.map((it) => (
                  <Table.Tr key={`${it.funcionarioCpf}-${it.clinicaCnpj}`} style={{ transition: 'background-color 0.2s' }}>
                    <Table.Td style={{ padding: '16px' }}>{it.funcionario?.usuario?.cpf || it.funcionarioCpf}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{it.funcionario?.usuario?.nome || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{it.funcionario?.cargo || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{it.funcionario?.status || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>
                      <Group gap="xs">
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
                {items.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--mantine-color-dimmed)' }}>
                      Nenhum funcionário encontrado para esta clínica.
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Box>

          <Stack gap="md" hiddenFrom="md">
            {items.map((it) => (
              <Card key={`${it.funcionarioCpf}-${it.clinicaCnpj}`} withBorder p="md" radius="md" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                <Group justify="space-between" mb="xs">
                  <Title order={4} style={{ color: '#1a1a1a' }}>
                    {it.funcionario?.usuario?.nome || '-'}
                  </Title>
                  <Group gap="xs">
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
                    <Text size="sm" c="dimmed">CPF</Text>
                    <Text size="sm" fw={500}>{it.funcionario?.usuario?.cpf || it.funcionarioCpf}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Cargo</Text>
                    <Text size="sm" fw={500}>{it.funcionario?.cargo || '-'}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Status</Text>
                    <Text size="sm" fw={500}>{it.funcionario?.status || '-'}</Text>
                  </Group>
                </Stack>
              </Card>
            ))}
            {items.length === 0 && (
              <Card withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
                <Text c="dimmed">Nenhum funcionário encontrado para esta clínica.</Text>
              </Card>
            )}
          </Stack>
        </>
      )}
        </Box>

      <Modal opened={editing !== null} onClose={() => setEditing(null)} title="Editar Funcionário">
        <Stack gap="md">
          <TextInput
            label="Nome"
            required
            value={editForm.nome}
            onChange={(e) => setEditForm({ ...editForm, nome: e.currentTarget.value })}
          />
          <TextInput
            label="Email"
            type="email"
            required
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.currentTarget.value })}
          />
          <Select
            label="Cargo"
            required
            placeholder="Selecione o cargo"
            value={editForm.cargo}
            onChange={(v) => setEditForm({ ...editForm, cargo: v || '' })}
            data={CARGOS_VETERINARIOS}
            searchable
          />
          {editForm.cargo === 'Outros' && (
            <TextInput
              label="Especifique o cargo"
              required
              placeholder="Digite o cargo"
              value={cargoOutros}
              onChange={(e) => setCargoOutros(e.currentTarget.value)}
            />
          )}
          <TextInput
            label="Registro Profissional"
            value={editForm.registroProfissional}
            onChange={(e) => setEditForm({ ...editForm, registroProfissional: e.currentTarget.value })}
          />
          <Select
            label="Status"
            value={editForm.status}
            onChange={(v) => setEditForm({ ...editForm, status: v || 'ativo' })}
            data={[
              { value: 'ativo', label: 'Ativo' },
              { value: 'inativo', label: 'Inativo' },
            ]}
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

      <Modal opened={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} title="Confirmar Exclusão">
        <Stack gap="md">
          <Text>
            Tem certeza que deseja remover <strong>{deleteConfirm?.funcionario?.usuario?.nome || deleteConfirm?.funcionarioCpf}</strong> da clínica?
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


