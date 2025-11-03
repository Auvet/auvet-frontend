import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthService } from '@/services/AuthService';
import { FuncionarioClinicaRepository } from '@/repositories/FuncionarioClinicaRepository';
import { TutorClinicaRepository } from '@/repositories/TutorClinicaRepository';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { saveCnpj } from '@/utils/storage';
import { cleanCPF, validateCPF } from '@/utils/cpfCnpj';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Box,
  TextInput,
  Loader,
  Overlay,
  Modal,
  Paper,
  ScrollArea,
} from '@mantine/core';
import auvetLogo from '@/assets/auvet-logo.png';
import gatoLaranja from '@/assets/gato-laranja.png';

const authService = new AuthService();
const funcionarioClinicaRepo = new FuncionarioClinicaRepository();
const tutorClinicaRepo = new TutorClinicaRepository();

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
      }}
    />
  );
}

export function Login() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showClinicaSelect, setShowClinicaSelect] = useState(false);
  const [clinicas, setClinicas] = useState<Array<{ cnpj: string; nome: string; email: string | null }>>([]);
  const [pendingRole, setPendingRole] = useState<'admin' | 'funcionario' | 'tutor' | undefined>();
  const [pendingToken, setPendingToken] = useState<string>('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    const cpfValidation = validateCPF(cpf);
    if (!cpfValidation.isValid) {
      setMessage(cpfValidation.error || 'CPF inválido');
      setLoading(false);
      return;
    }
    
    try {
      const cleanCpfValue = cleanCPF(cpf);
      const { role, token } = await authService.login({ cpf: cleanCpfValue, senha });
      if (!token || !role) {
        setMessage('Login realizado, mas não foi possível identificar o perfil.');
        return;
      }

      let clinicasList: Array<{ cnpj: string; nome: string; email: string | null }> = [];
      
      if (role === 'admin' || role === 'funcionario') {
        const res = await funcionarioClinicaRepo.listByFuncionario(cleanCpfValue);
        clinicasList = res.data?.map((item: { funcionarioCpf: string; clinicaCnpj: string; clinica?: { cnpj: string; nome: string; email: string | null } }) => item.clinica || { cnpj: item.clinicaCnpj, nome: '', email: null }) || [];
      } else if (role === 'tutor') {
        const res = await tutorClinicaRepo.listByTutor(cleanCpfValue);
        clinicasList = res.data?.map((item: { tutorCpf: string; clinicaCnpj: string; clinica?: { cnpj: string; nome: string; email: string | null } }) => item.clinica || { cnpj: item.clinicaCnpj, nome: '', email: null }) || [];
      }

      if (clinicasList.length === 0) {
        setMessage('Usuário não está vinculado a nenhuma clínica.');
        return;
      }
      
      if (clinicasList.length === 1) {
        saveCnpj(clinicasList[0].cnpj);
        setSession({ token, role });
        if (role === 'admin') navigate('/dashboard/admin');
        else if (role === 'funcionario') navigate('/dashboard/funcionario');
        else if (role === 'tutor') navigate('/dashboard/tutor');
        return;
      }

      setClinicas(clinicasList);
      setPendingRole(role);
      setPendingToken(token);
      setShowClinicaSelect(true);
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectClinica(cnpj: string) {
    saveCnpj(cnpj);
    setSession({ token: pendingToken, role: pendingRole });
    setShowClinicaSelect(false);
    
    if (pendingRole === 'admin') navigate('/dashboard/admin');
    else if (pendingRole === 'funcionario') navigate('/dashboard/funcionario');
    else if (pendingRole === 'tutor') navigate('/dashboard/tutor');
  }

  function handleSobreClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById('sobre');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  function handleForgotPassword() {
    if (!cpf) {
      setMessage('Por favor, digite seu CPF primeiro.');
      return;
    }

    const cpfValidation = validateCPF(cpf);
    if (!cpfValidation.isValid) {
      setMessage(cpfValidation.error || 'CPF inválido');
      return;
    }

    setShowForgotPassword(true);
  }

  return (
    <Box style={{ minHeight: '100vh', background: 'white', position: 'relative', overflow: 'hidden' }}>
      <Box style={{ position: 'relative', paddingTop: 12 }}>
        <Container size="xl" style={{ maxWidth: 1195, paddingLeft: 10 }}>
          <Box
            style={{
              background: 'white',
              borderRadius: 32,
              padding: '12px 24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              position: 'sticky',
              top: 12,
              zIndex: 100,
            }}
          >
            <Group justify="space-between" align="center" wrap="nowrap">
              <Group gap="xs">
                <Group gap={8}>
                  <Box
                    component="img"
                    src={auvetLogo}
                    alt="AuVet Logo"
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: 'contain',
                    }}
                  />
                  <Title order={3} fw={700} style={{ color: '#1a1a1a', letterSpacing: '0.1em' }}>
                    AUVET
                  </Title>
                </Group>
              </Group>

              <Group gap="lg" visibleFrom="sm">
                <Text
                  component={Link}
                  to="/"
                  style={{
                    textDecoration: 'none',
                    color: '#1a1a1a',
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#f87537';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1a1a1a';
                  }}
                >
                  Home
                </Text>
                <Text
                  component="a"
                  href="#sobre"
                  onClick={handleSobreClick}
                  style={{
                    textDecoration: 'none',
                    color: '#1a1a1a',
                    fontSize: '15px',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                    e.currentTarget.style.textDecorationColor = '#ff9f00';
                    e.currentTarget.style.textDecorationThickness = '2px';
                    e.currentTarget.style.textUnderlineOffset = '6px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  Sobre nós
                </Text>
              </Group>
            </Group>
          </Box>
        </Container>
      </Box>

      <BlobShape size={200} top="-10%" left="-5%" delay={0} color="#f87537" />
      <BlobShape size={150} top="70%" left="-3%" delay={1} color="#f87537" />
      <FloatingCircle size={80} top="20%" left="8%" delay={0.5} color="#f87537" />
      <FloatingCircle size={60} top="80%" left="5%" delay={1.5} color="#ff9f00" />
      <FloatingCircle size={100} top="50%" left="85%" delay={2} color="#f87537" />

      <Box style={{ position: 'relative', zIndex: 10, paddingTop: 100, paddingBottom: 80 }}>
        {loading && (
          <Overlay
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1000,
            }}
          >
            <Stack align="center" gap="md">
              <Loader size="xl" color="#f87537" />
              <Text size="lg" fw={600} c="#1a1a1a">
                Processando...
              </Text>
            </Stack>
          </Overlay>
        )}
        
        <Container size="xl" style={{ maxWidth: 1195, paddingLeft: 10 }}>
          <Group align="flex-start" gap="xl" wrap="wrap">
            <Box
              flex={1}
              visibleFrom="md"
              style={{
                position: 'relative',
                minHeight: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={gatoLaranja}
                alt="Gato laranja"
                style={{
                  width: '100%',
                  maxWidth: 400,
                  height: 'auto',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 5,
                }}
              />
            </Box>

            <Stack flex={1} style={{ minWidth: 'min(300px, 100%)', maxWidth: 500 }} gap="md">
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Stack gap="md">
                <TextInput
                  label="CPF"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                  size="md"
                  radius="md"
                  style={{ width: '100%' }}
                />
                
                <TextInput
                  label="Senha"
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  size="md"
                  radius="md"
                  style={{ width: '100%' }}
                />

                <Text
                  component="a"
                  href="#"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleForgotPassword();
                  }}
                  style={{
                    color: '#999',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                  }}
                >
                  Esqueci minha senha
                </Text>

                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  radius="xl"
                  style={{
                    background: '#f87537',
                    marginTop: 48,
                    width: '100%',
                  }}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>

                {message && (
                  <Text size="sm" c="red" style={{ marginTop: 8 }}>
                    {message}
                  </Text>
                )}
              </Stack>
            </form>
            </Stack>
          </Group>
        </Container>
      </Box>

      <style>{`
        @keyframes floating {
          0% { transform: translate(0, 0px); }
          50% { transform: translate(0, -15px); }
          100% { transform: translate(0, 0px); }
        }
      `}</style>

      <Modal 
        opened={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
        title="Recuperação de Senha" 
        centered
        size="md"
        radius="md"
      >
        <Box style={{ position: 'relative', padding: '20px' }}>
          <Box
            style={{
              position: 'absolute',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#f87537',
              opacity: 0.15,
              top: -10,
              right: -10,
              zIndex: 0,
            }}
          />
          <Box
            style={{
              position: 'absolute',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#ff9f00',
              opacity: 0.2,
              bottom: 10,
              left: 10,
              zIndex: 0,
            }}
          />
          
          <Stack gap="lg" style={{ position: 'relative', zIndex: 10 }}>
            <Text size="md" ta="center" fw={500}>
              Recuperação de Senha
            </Text>
            
            <Stack gap="md">
              <Paper p="md" radius="md" withBorder style={{ background: '#fff4e6' }}>
                <Text size="sm" ta="center" c="#1a1a1a" fw={500} mb="xs">
                  Se você é administrador:
                </Text>
                <Text size="sm" ta="center" c="#1a1a1a">
                  Entre em contato com o suporte AuVet para recuperar sua senha.
                </Text>
              </Paper>
              
              <Paper p="md" radius="md" withBorder style={{ background: '#fff4e6' }}>
                <Text size="sm" ta="center" c="#1a1a1a" fw={500} mb="xs">
                  Se você é funcionário ou tutor:
                </Text>
                <Text size="sm" ta="center" c="#1a1a1a">
                  Fale com o administrador da sua clínica para recuperar sua senha.
                </Text>
              </Paper>
            </Stack>
            
            <Button
              onClick={() => setShowForgotPassword(false)}
              fullWidth
              size="md"
              radius="md"
              style={{ background: '#f87537' }}
            >
              Entendi
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal 
        opened={showClinicaSelect} 
        onClose={() => setShowClinicaSelect(false)} 
        title="Selecione a Clínica" 
        centered
        size="md"
        radius="md"
        styles={{
          body: {
            padding: 0,
            overflow: 'hidden',
          },
          content: {
            maxHeight: '80vh',
          },
        }}
      >
        <Box style={{ position: 'relative', padding: '20px' }}>
          <Box
            style={{
              position: 'absolute',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#f87537',
              opacity: 0.15,
              top: -10,
              right: -10,
              zIndex: 0,
            }}
          />
          <Box
            style={{
              position: 'absolute',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#ff9f00',
              opacity: 0.2,
              bottom: 10,
              left: 10,
              zIndex: 0,
            }}
          />
          <Box
            style={{
              position: 'absolute',
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: '#f87537',
              opacity: 0.2,
              top: '50%',
              right: 5,
              zIndex: 0,
            }}
          />
          
          <Stack gap="lg" style={{ position: 'relative', zIndex: 10 }}>
            <Text size="md" c="dimmed" ta="center">
              Você está vinculado a múltiplas clínicas.<br />Selecione qual deseja acessar:
            </Text>
            <ScrollArea 
              style={{ height: 400 }}
              scrollbarSize={6}
              offsetScrollbars
              type="scroll"
            >
              <Stack gap="md" style={{ paddingRight: 8 }}>
                {clinicas.map((clinica) => (
                  <Paper
                    key={clinica.cnpj}
                    p="lg"
                    radius="md"
                    withBorder
                    style={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      borderWidth: 2,
                      borderColor: 'transparent',
                    }}
                    onClick={() => handleSelectClinica(clinica.cnpj)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#f87537';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(248, 117, 55, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Stack gap={4}>
                      <Text fw={700} size="lg" c="#1a1a1a" style={{ letterSpacing: '0.01em' }}>
                        {clinica.nome || 'Nome não disponível'}
                      </Text>
                      <Text size="sm" c="dimmed" style={{ fontFamily: 'monospace' }}>
                        CNPJ: {clinica.cnpj}
                      </Text>
                      {clinica.email && (
                        <Text size="sm" c="dimmed">
                          {clinica.email}
                        </Text>
                      )}
                      <Box
                        mt="xs"
                        style={{
                          width: '40px',
                          height: 3,
                          background: '#f87537',
                          borderRadius: 2,
                        }}
                      />
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </ScrollArea>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
