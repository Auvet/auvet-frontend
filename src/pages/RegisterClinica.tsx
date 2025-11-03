import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RegistrationService } from '@/services/RegistrationService';
import { AuthService } from '@/services/AuthService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cleanCPF, cleanCNPJ, validateCPF, validateCNPJ } from '@/utils/cpfCnpj';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Box,
  TextInput,
  Grid,
  Loader,
  Overlay,
} from '@mantine/core';
import auvetLogo from '@/assets/auvet-logo.png';
import gatoLaranja from '@/assets/gato-laranja.png';

const registrationService = new RegistrationService();
const authService = new AuthService();

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

export function RegisterClinica() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [admin, setAdmin] = useState({
    cpf: '',
    nome: '',
    email: '',
    senha: '',
    registroProfissional: '',
  });

  const [clinica, setClinica] = useState({
    cnpj: '',
    nome: '',
    endereco: '',
    telefone: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [step, setStep] = useState<'admin' | 'clinica'>('admin');

  async function handleAdminSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    const cpfValidation = validateCPF(admin.cpf);
    if (!cpfValidation.isValid) {
      setMessage(cpfValidation.error || 'CPF inválido');
      setLoading(false);
      return;
    }
    
    try {
      setStep('clinica');
      setMessage(null);
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleClinicaSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    const cnpjValidation = validateCNPJ(clinica.cnpj);
    if (!cnpjValidation.isValid) {
      setMessage(cnpjValidation.error || 'CNPJ inválido');
      setLoading(false);
      return;
    }
    
    try {
      const cleanCpfValue = cleanCPF(admin.cpf);
      const cleanCnpjValue = cleanCNPJ(clinica.cnpj);

      await registrationService.registerAdminThenClinic(
        {
          cpf: cleanCpfValue,
          nome: admin.nome,
          email: admin.email,
          senha: admin.senha,
          cargo: 'Administrador',
          registroProfissional: admin.registroProfissional,
          nivelAcesso: 5,
        },
        {
          cnpj: cleanCnpjValue,
          nome: clinica.nome,
          endereco: clinica.endereco,
          telefone: clinica.telefone,
          email: clinica.email,
          administradorCpf: cleanCpfValue,
        }
      );
      
      const { role, token } = await authService.login({ cpf: cleanCpfValue, senha: admin.senha });
      if (token) setSession({ token, role });
      
      setMessage('Clínica cadastrada com sucesso!');
      setTimeout(() => {
        navigate('/dashboard/admin');
      }, 1500);
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
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

      <Box style={{ position: 'relative', zIndex: 10, paddingTop: 60, paddingBottom: 80 }}>
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
          <Group align="flex-start" gap="xl" wrap="wrap" justify="flex-end">
            <Box
              visibleFrom="lg"
              style={{
                position: 'relative',
                minHeight: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: 400,
                marginRight: 'auto',
                flex: '0 0 auto',
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

            <Stack flex={1} style={{ minWidth: 'min(300px, 100%)', maxWidth: 800, width: '100%' }} gap="xl">
              {step === 'admin' ? (
                <form onSubmit={handleAdminSubmit}>
                  <Stack gap="lg">
                    <Grid gutter="md">
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                          label="CPF"
                          placeholder="000.000.000-00"
                          value={admin.cpf}
                          onChange={(e) => setAdmin({ ...admin, cpf: e.target.value })}
                          required
                          size="md"
                          radius="md"
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                          label="Registro Profissional"
                          placeholder="CRMV1234"
                          value={admin.registroProfissional}
                          onChange={(e) => setAdmin({ ...admin, registroProfissional: e.target.value })}
                          required
                          size="md"
                          radius="md"
                        />
                      </Grid.Col>
                    </Grid>

                    <TextInput
                      label="Nome"
                      placeholder="Nome completo"
                      value={admin.nome}
                      onChange={(e) => setAdmin({ ...admin, nome: e.target.value })}
                      required
                      size="md"
                      radius="md"
                    />

                    <TextInput
                      label="Email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={admin.email}
                      onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                      required
                      size="md"
                      radius="md"
                    />

                    <TextInput
                      label="Senha"
                      type="password"
                      placeholder="Digite sua senha"
                      value={admin.senha}
                      onChange={(e) => setAdmin({ ...admin, senha: e.target.value })}
                      required
                      size="md"
                      radius="md"
                    />

                    <Button
                      type="submit"
                      disabled={loading}
                      size="lg"
                      radius="xl"
                      style={{
                        background: '#f87537',
                        marginTop: 32,
                        width: '100%',
                      }}
                    >
                      Próximo
                    </Button>

                    {message && (
                      <Text size="sm" c="red" style={{ marginTop: 8 }}>
                        {message}
                      </Text>
                    )}
                  </Stack>
                </form>
              ) : (
                <form onSubmit={handleClinicaSubmit}>
                  <Stack gap="lg">
                    <Grid gutter="md">
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                          label="Nome da Clínica"
                          placeholder="Nome da Clínica"
                          value={clinica.nome}
                          onChange={(e) => setClinica({ ...clinica, nome: e.target.value })}
                          required
                          size="md"
                          radius="md"
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                          label="CNPJ"
                          placeholder="00.000.000/0001-00"
                          value={clinica.cnpj}
                          onChange={(e) => setClinica({ ...clinica, cnpj: e.target.value })}
                          required
                          size="md"
                          radius="md"
                        />
                      </Grid.Col>
                    </Grid>

                    <TextInput
                      label="Email Address"
                      type="email"
                      placeholder="E-mail address"
                      value={clinica.email}
                      onChange={(e) => setClinica({ ...clinica, email: e.target.value })}
                      required
                      size="md"
                      radius="md"
                    />

                    <TextInput
                      label="Endereço"
                      placeholder="Endereço"
                      value={clinica.endereco}
                      onChange={(e) => setClinica({ ...clinica, endereco: e.target.value })}
                      required
                      size="md"
                      radius="md"
                    />

                    <TextInput
                      label="Telefone"
                      placeholder="00 00000-0000"
                      value={clinica.telefone}
                      onChange={(e) => setClinica({ ...clinica, telefone: e.target.value })}
                      required
                      size="md"
                      radius="md"
                    />

                    <Group gap="md" mt="xl">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        radius="xl"
                        onClick={() => setStep('admin')}
                        style={{
                          borderColor: '#999',
                          color: '#999',
                          flex: 1,
                        }}
                      >
                        Voltar
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        size="lg"
                        radius="xl"
                        style={{
                          background: '#f87537',
                          flex: 1,
                        }}
                      >
                        {loading ? 'Cadastrando...' : 'Cadastrar Clínica'}
                      </Button>
                    </Group>

                    {message && (
                      <Text size="sm" c={message.includes('sucesso') ? 'green' : 'red'} style={{ marginTop: 8 }}>
                        {message}
                      </Text>
                    )}
                  </Stack>
                </form>
              )}
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
    </Box>
  );
}
