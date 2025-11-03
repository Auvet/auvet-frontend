import { useEffect, useState } from 'react';
import { UsuarioRepository } from '@/repositories/UsuarioRepository';
import { getToken } from '@/utils/storage';
import { decodeJWT } from '@/utils/jwt';
import { Paper, Title, Text, TextInput, Button, Group, Stack, Tabs, Divider, Box } from '@mantine/core';
import { IconUser, IconLock } from '@tabler/icons-react';

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

export function FuncionarioPerfil() {
  const [userForm, setUserForm] = useState({
    cpf: '',
    nome: '',
    email: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    novaSenha: '',
    confirmarSenha: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('perfil');

  useEffect(() => {
    loadUserData();
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
        setMessage('CPF não encontrado no token.');
        return;
      }

      const response = await usuarioRepo.getByCpf(cpf);
      
      if (response.data) {
        setUserForm({
          cpf: response.data.cpf,
          nome: response.data.nome,
          email: response.data.email,
        });
      }
    } catch (err) {
      setMessage((err as Error).message);
    }
  }

  async function handleSaveUser() {
    try {
      setLoading(true);
      setMessage(null);
      
      const token = getToken();
      if (!token) {
        setMessage('Token não encontrado. Faça login novamente.');
        return;
      }

      const decoded = decodeJWT(token);
      const cpf = decoded?.cpf;
      
      if (!cpf) {
        setMessage('CPF não encontrado no token.');
        return;
      }

      await usuarioRepo.update(cpf, {
        nome: userForm.nome,
        email: userForm.email,
      });

      setMessage('Perfil atualizado com sucesso!');
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword() {
    try {
      setLoadingPassword(true);
      setPasswordMessage(null);

      if (!passwordForm.novaSenha || !passwordForm.confirmarSenha) {
        setPasswordMessage('Preencha todos os campos.');
        return;
      }

      if (passwordForm.novaSenha.length < 6) {
        setPasswordMessage('A senha deve ter pelo menos 6 caracteres.');
        return;
      }

      if (passwordForm.novaSenha !== passwordForm.confirmarSenha) {
        setPasswordMessage('As senhas não coincidem.');
        return;
      }

      const token = getToken();
      if (!token) {
        setPasswordMessage('Token não encontrado. Faça login novamente.');
        return;
      }

      const decoded = decodeJWT(token);
      const cpf = decoded?.cpf;
      
      if (!cpf) {
        setPasswordMessage('CPF não encontrado no token.');
        return;
      }

      await usuarioRepo.update(cpf, {
        senha: passwordForm.novaSenha,
      });

      setPasswordMessage('Senha alterada com sucesso!');
      setPasswordForm({ novaSenha: '', confirmarSenha: '' });
    } catch (err) {
      setPasswordMessage((err as Error).message);
    } finally {
      setLoadingPassword(false);
    }
  }

  return (
    <Box style={{ padding: '40px' }}>
      <Box mb="xl">
        <Title order={2} fw={700} style={{ color: '#1a1a1a', letterSpacing: '0.02em', marginBottom: 8 }}>
          Configurações
        </Title>
        <Text size="lg" c="dimmed">
          Gerencie seu perfil e preferências
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
          </Tabs.List>

          <Tabs.Panel value="perfil" pt="xl">
            <Stack gap="xl">
              <Box>
                <Text fw={600} size="lg" mb="md">Dados Pessoais</Text>
                <Stack gap="md">
                  <TextInput
                    label="CPF"
                    value={userForm.cpf}
                    disabled
                    readOnly
                  />
                  <TextInput
                    label="Nome"
                    required
                    value={userForm.nome}
                    onChange={(e) => setUserForm({ ...userForm, nome: e.currentTarget.value })}
                  />
                  <TextInput
                    label="Email"
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.currentTarget.value })}
                  />
                  <Group justify="flex-start" mt="md">
                    <Button onClick={handleSaveUser} loading={loading}>
                      Salvar Alterações
                    </Button>
                    {message && (
                      <Text c={message.includes('sucesso') ? 'green' : 'red'} size="sm" fw={500}>
                        {message}
                      </Text>
                    )}
                  </Group>
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Group gap="xs" mb="md">
                  <IconLock size={20} style={{ color: 'var(--mantine-color-dimmed)' }} />
                  <Text fw={600} size="lg">Alterar Senha</Text>
                </Group>
                <Stack gap="md">
                  <TextInput
                    label="Nova Senha"
                    type="password"
                    required
                    placeholder="Digite a nova senha"
                    value={passwordForm.novaSenha}
                    onChange={(e) => setPasswordForm({ ...passwordForm, novaSenha: e.currentTarget.value })}
                  />
                  <TextInput
                    label="Confirmar Nova Senha"
                    type="password"
                    required
                    placeholder="Digite novamente a nova senha"
                    value={passwordForm.confirmarSenha}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmarSenha: e.currentTarget.value })}
                  />
                  <Group justify="flex-start" mt="md">
                    <Button onClick={handleChangePassword} loading={loadingPassword}>
                      Alterar Senha
                    </Button>
                    {passwordMessage && (
                      <Text c={passwordMessage.includes('sucesso') ? 'green' : 'red'} size="sm" fw={500}>
                        {passwordMessage}
                      </Text>
                    )}
                  </Group>
                </Stack>
              </Box>
            </Stack>
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

