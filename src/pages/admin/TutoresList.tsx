import { useEffect, useState } from 'react';
import { TutorClinicaRepository } from '@/repositories/TutorClinicaRepository';
import { TutorRepository } from '@/repositories/TutorRepository';
import { UsuarioRepository } from '@/repositories/UsuarioRepository';
import { getCnpj } from '@/utils/storage';
import type { TutorClinicaItem } from '@/interfaces/tutor';
import { Paper, Table, Text, Title, Button, ActionIcon, Group, Modal, TextInput, Stack, Box, Card, Divider } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';

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

const repo = new TutorClinicaRepository();
const tutorRepo = new TutorRepository();
const usuarioRepo = new UsuarioRepository();

export function TutoresList() {
  const [items, setItems] = useState<TutorClinicaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<TutorClinicaItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<TutorClinicaItem | null>(null);
  const [editForm, setEditForm] = useState({ nome: '', email: '', telefone: '', endereco: '' });

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

  function openEdit(item: TutorClinicaItem) {
    setEditing(item);
    setEditForm({
      nome: item.tutor?.usuario?.nome || '',
      email: item.tutor?.usuario?.email || '',
      telefone: item.tutor?.telefone || '',
      endereco: item.tutor?.endereco || '',
    });
  }

  async function handleSaveEdit() {
    if (!editing) return;
    try {
      setLoading(true);
      setError(null);
      
      const cleanCpf = editing.tutorCpf.replace(/[^\d]/g, '');
      
      await usuarioRepo.update(cleanCpf, {
        nome: editForm.nome,
        email: editForm.email,
      });
      
      await tutorRepo.update(cleanCpf, {
        telefone: editForm.telefone,
        endereco: editForm.endereco,
      });
      
      setEditing(null);
      await loadItems();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(item: TutorClinicaItem) {
    try {
      setLoading(true);
      setError(null);
      await repo.deleteRelation(item.tutorCpf, item.clinicaCnpj);
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
          Tutores
        </Title>
        <Text size="lg" c="dimmed">
          Tutores vinculados à sua clínica
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
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Email</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Telefone</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Endereço</Table.Th>
                  <Table.Th style={{ fontWeight: 600, padding: '16px' }}>Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.map((it) => (
                  <Table.Tr key={`${it.tutorCpf}-${it.clinicaCnpj}`} style={{ transition: 'background-color 0.2s' }}>
                    <Table.Td style={{ padding: '16px' }}>{it.tutor?.usuario?.cpf || it.tutorCpf}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{it.tutor?.usuario?.nome || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{it.tutor?.usuario?.email || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{it.tutor?.telefone || '-'}</Table.Td>
                    <Table.Td style={{ padding: '16px' }}>{it.tutor?.endereco || '-'}</Table.Td>
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
                    <Table.Td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--mantine-color-dimmed)' }}>
                      Nenhum tutor encontrado para esta clínica.
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Box>

          <Stack gap="md" hiddenFrom="md">
            {items.map((it) => (
              <Card key={`${it.tutorCpf}-${it.clinicaCnpj}`} withBorder p="md" radius="md" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                <Group justify="space-between" mb="xs">
                  <Title order={4} style={{ color: '#1a1a1a' }}>
                    {it.tutor?.usuario?.nome || '-'}
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
                    <Text size="sm" fw={500}>{it.tutor?.usuario?.cpf || it.tutorCpf}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Email</Text>
                    <Text size="sm" fw={500}>{it.tutor?.usuario?.email || '-'}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Telefone</Text>
                    <Text size="sm" fw={500}>{it.tutor?.telefone || '-'}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Endereço</Text>
                    <Text size="sm" fw={500}>{it.tutor?.endereco || '-'}</Text>
                  </Group>
                </Stack>
              </Card>
            ))}
            {items.length === 0 && (
              <Card withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
                <Text c="dimmed">Nenhum tutor encontrado para esta clínica.</Text>
              </Card>
            )}
          </Stack>
        </>
      )}
        </Box>

      <Modal opened={editing !== null} onClose={() => setEditing(null)} title="Editar Tutor">
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
          <TextInput
            label="Telefone"
            value={editForm.telefone}
            onChange={(e) => setEditForm({ ...editForm, telefone: e.currentTarget.value })}
          />
          <TextInput
            label="Endereço"
            value={editForm.endereco}
            onChange={(e) => setEditForm({ ...editForm, endereco: e.currentTarget.value })}
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
            Tem certeza que deseja remover <strong>{deleteConfirm?.tutor?.usuario?.nome || deleteConfirm?.tutorCpf}</strong> da clínica?
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
