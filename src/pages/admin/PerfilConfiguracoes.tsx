import { useEffect, useState } from 'react';
import { UsuarioRepository } from '@/repositories/UsuarioRepository';
import { ClinicaRepository } from '@/repositories/ClinicaRepository';
import { getToken, getCnpj } from '@/utils/storage';
import { decodeJWT } from '@/utils/jwt';
import { Paper, Title, Text, TextInput, Button, Group, Stack, Grid, Tabs, Divider, Box } from '@mantine/core';
import { IconUser, IconBuilding } from '@tabler/icons-react';

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

const usuarioRepo = new UsuarioRepository();
const clinicaRepo = new ClinicaRepository();

export function PerfilConfiguracoes() {
  const [userForm, setUserForm] = useState({
    cpf: '',
    nome: '',
    email: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    novaSenha: '',
    confirmarSenha: '',
  });
  const [clinicaForm, setClinicaForm] = useState({
    cnpj: '',
    nome: '',
    endereco: '',
    telefone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('perfil');

  useEffect(() => {
    loadUserData();
    loadClinicaData();
  }, []);

  async function loadUserData() {
    try {
      const token = getToken();
      if (!token) {
        setMessage('Token não encontrado. Faça login novamente.');
        return;
      }

      const decoded = decodeJWT(token);
      const cpf = decoded?.cpf;
      
      if (!cpf) {
        setMessage('Não foi possível identificar o CPF do usuário.');
        return;
      }

      const res = await usuarioRepo.getByCpf(cpf);
      if (res.data) {
        setUserForm({
          cpf: res.data.cpf || '',
          nome: res.data.nome || '',
          email: res.data.email || '',
        });
      }
    } catch (e) {
      console.error('Erro ao carregar dados do usuário:', e);
      setMessage((e as Error).message);
    }
  }

  async function loadClinicaData() {
    try {
      const cnpj = getCnpj();
      if (!cnpj) {
        return;
      }

      const res = await clinicaRepo.getByCnpj(cnpj);
      if (res.data) {
        setClinicaForm({
          cnpj: res.data.cnpj || '',
          nome: res.data.nome || '',
          endereco: res.data.endereco || '',
          telefone: res.data.telefone || '',
          email: res.data.email || '',
        });
      }
    } catch (e) {
      console.error('Erro ao carregar dados da clínica:', e);
      setMessage((e as Error).message);
    }
  }

  async function handleSaveUser(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!userForm.nome || !userForm.email) {
      setMessage('Nome e email são obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      await usuarioRepo.update(userForm.cpf, {
        nome: userForm.nome,
        email: userForm.email,
      });
      setMessage('Perfil atualizado com sucesso!');
      await loadUserData();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordMessage(null);

    if (!passwordForm.novaSenha || !passwordForm.confirmarSenha) {
      setPasswordMessage('Nova senha e confirmação são obrigatórios.');
      setLoadingPassword(false);
      return;
    }

    if (passwordForm.novaSenha !== passwordForm.confirmarSenha) {
      setPasswordMessage('As senhas não coincidem.');
      setLoadingPassword(false);
      return;
    }

    if (passwordForm.novaSenha.length < 6) {
      setPasswordMessage('A nova senha deve ter pelo menos 6 caracteres.');
      setLoadingPassword(false);
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setPasswordMessage('Token não encontrado. Faça login novamente.');
        setLoadingPassword(false);
        return;
      }

      const decoded = decodeJWT(token);
      const cpf = decoded?.cpf;
      
      if (!cpf) {
        setPasswordMessage('Não foi possível identificar o CPF do usuário.');
        setLoadingPassword(false);
        return;
      }

      await usuarioRepo.update(cpf, {
        senha: passwordForm.novaSenha,
      });
      setPasswordMessage('Senha alterada com sucesso!');
      setPasswordForm({
        novaSenha: '',
        confirmarSenha: '',
      });
    } catch (e) {
      setPasswordMessage((e as Error).message);
    } finally {
      setLoadingPassword(false);
    }
  }

  async function handleSaveClinica(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!clinicaForm.nome) {
      setMessage('Nome da clínica é obrigatório.');
      setLoading(false);
      return;
    }

    try {
      const cnpj = getCnpj();
      if (!cnpj) {
        setMessage('CNPJ da clínica não encontrado.');
        setLoading(false);
        return;
      }

      await clinicaRepo.update(cnpj, {
        nome: clinicaForm.nome,
        endereco: clinicaForm.endereco || null,
        telefone: clinicaForm.telefone || null,
        email: clinicaForm.email || null,
      });
      setMessage('Dados da clínica atualizados com sucesso!');
      await loadClinicaData();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box style={{ padding: '40px' }}>
      <Box mb="xl">
        <Title order={2} fw={700} style={{ color: '#1a1a1a', letterSpacing: '0.02em', marginBottom: 8 }}>
          Configurações
        </Title>
        <Text size="lg" c="dimmed">
          Gerencie seu perfil e as informações da clínica
        </Text>
      </Box>
      <Paper p="xl" radius="md" withBorder style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }}>
        <FloatingCircle size={80} top="10%" left="5%" delay={0.5} color="#f87537" />
        <FloatingCircle size={60} top="70%" left="2%" delay={1.5} color="#ff9f00" />
        <FloatingCircle size={100} top="40%" left="92%" delay={2} color="#f87537" />
        <FloatingCircle size={50} top="85%" left="95%" delay={0.8} color="#ff9f00" />
        <FloatingCircle size={70} top="20%" left="88%" delay={1.2} color="#f87537" />
        
        <Box style={{ position: 'relative', zIndex: 1 }}>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="perfil" leftSection={<IconUser size={16} />}>
            Meu Perfil
          </Tabs.Tab>
          <Tabs.Tab value="clinica" leftSection={<IconBuilding size={16} />}>
            Dados da Clínica
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="perfil" pt="md">
          <Stack gap="md">
            <form onSubmit={handleSaveUser}>
              <Stack gap="md">
                <Text fw={500} size="lg">Dados Pessoais</Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="CPF"
                      value={userForm.cpf}
                      disabled
                      readOnly
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Nome"
                      required
                      value={userForm.nome}
                      onChange={(e) => setUserForm({ ...userForm, nome: e.currentTarget.value })}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Email"
                      type="email"
                      required
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.currentTarget.value })}
                    />
                  </Grid.Col>
                </Grid>
                <Group justify="flex-end" mt="md">
                  <Button type="submit" loading={loading}>
                    Salvar Alterações
                  </Button>
                </Group>
                {message && (
                  <Text c={message.includes('sucesso') ? 'green' : 'red'} size="sm">
                    {message}
                  </Text>
                )}
              </Stack>
            </form>

            <Divider my="md" />

            <form onSubmit={handleChangePassword}>
              <Stack gap="md">
                <Text fw={500} size="lg">Alterar Senha</Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Nova Senha"
                      type="password"
                      required
                      value={passwordForm.novaSenha}
                      onChange={(e) => setPasswordForm({ ...passwordForm, novaSenha: e.currentTarget.value })}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Confirmar Nova Senha"
                      type="password"
                      required
                      value={passwordForm.confirmarSenha}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmarSenha: e.currentTarget.value })}
                    />
                  </Grid.Col>
                </Grid>
                <Group justify="flex-end" mt="md">
                  <Button type="submit" loading={loadingPassword}>
                    Alterar Senha
                  </Button>
                </Group>
                {passwordMessage && (
                  <Text c={passwordMessage.includes('sucesso') ? 'green' : 'red'} size="sm">
                    {passwordMessage}
                  </Text>
                )}
              </Stack>
            </form>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="clinica" pt="md">
          <form onSubmit={handleSaveClinica}>
            <Stack gap="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="CNPJ"
                    value={clinicaForm.cnpj}
                    disabled
                    readOnly
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Nome da Clínica"
                    required
                    value={clinicaForm.nome}
                    onChange={(e) => setClinicaForm({ ...clinicaForm, nome: e.currentTarget.value })}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    label="Endereço"
                    value={clinicaForm.endereco}
                    onChange={(e) => setClinicaForm({ ...clinicaForm, endereco: e.currentTarget.value })}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Telefone"
                    value={clinicaForm.telefone}
                    onChange={(e) => setClinicaForm({ ...clinicaForm, telefone: e.currentTarget.value })}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Email"
                    type="email"
                    value={clinicaForm.email}
                    onChange={(e) => setClinicaForm({ ...clinicaForm, email: e.currentTarget.value })}
                  />
                </Grid.Col>
              </Grid>
              <Group justify="flex-end" mt="md">
                <Button type="submit" loading={loading}>
                  Salvar Alterações
                </Button>
              </Group>
              {message && (
                <Text c={message.includes('sucesso') ? 'green' : 'red'} size="sm">
                  {message}
                </Text>
              )}
            </Stack>
          </form>
        </Tabs.Panel>
      </Tabs>
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
