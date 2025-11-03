import { useState } from 'react';
import { AuthService } from '@/services/AuthService';
import { Button, Grid, Paper, Text, TextInput, Title, Group, Box } from '@mantine/core';
import { getCnpj } from '@/utils/storage';
import { cleanCPF, validateCPF } from '@/utils/cpfCnpj';

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

const authService = new AuthService();

export function TutoresCreate() {
  const [form, setForm] = useState({
    cpf: '',
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    endereco: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    const cpfValidation = validateCPF(form.cpf);
    if (!cpfValidation.isValid) {
      setMessage(cpfValidation.error || 'CPF inválido');
      setLoading(false);
      return;
    }
    
    try {
      const cnpj = getCnpj();
      if (!cnpj) {
        setMessage('CNPJ da clínica não encontrado.');
        return;
      }

      const cleanCpfValue = cleanCPF(form.cpf);
      await authService.registerTutor({
        cpf: cleanCpfValue,
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        telefone: form.telefone || undefined,
        endereco: form.endereco || undefined,
        clinicas: [cnpj],
      });

      setMessage('Tutor cadastrado e vinculado à clínica com sucesso!');
      setForm({ cpf: '', nome: '', email: '', senha: '', telefone: '', endereco: '' });
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box style={{ padding: '40px' }}>
      <Box mb="xl">
        <Title order={2} fw={700} style={{ color: '#1a1a1a', letterSpacing: '0.02em', marginBottom: 8 }}>
          Cadastrar Tutor
        </Title>
        <Text size="lg" c="dimmed">
          Crie um novo tutor e vincule à clínica atual
        </Text>
      </Box>
      <Paper p="xl" radius="md" withBorder style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }}>
        <FloatingCircle size={80} top="10%" left="5%" delay={0.5} color="#f87537" />
        <FloatingCircle size={60} top="70%" left="2%" delay={1.5} color="#ff9f00" />
        <FloatingCircle size={100} top="40%" left="92%" delay={2} color="#f87537" />
        <FloatingCircle size={50} top="85%" left="95%" delay={0.8} color="#ff9f00" />
        <FloatingCircle size={70} top="20%" left="88%" delay={1.2} color="#f87537" />
        
        <Box style={{ position: 'relative', zIndex: 1 }}>
      <form onSubmit={handleSubmit}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="CPF" required value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.currentTarget.value })} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="Nome" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.currentTarget.value })} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.currentTarget.value })} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="Senha" type="password" required value={form.senha} onChange={(e) => setForm({ ...form, senha: e.currentTarget.value })} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="Telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.currentTarget.value })} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="Endereço" value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.currentTarget.value })} />
          </Grid.Col>
        </Grid>
        <Group justify="flex-start" mt="md">
          <Button type="submit" loading={loading} size="lg" radius="xl">Cadastrar</Button>
          {message && <Text c={message.includes('sucesso') ? 'green' : 'red'} size="sm" fw={500}>{message}</Text>}
        </Group>
      </form>
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

