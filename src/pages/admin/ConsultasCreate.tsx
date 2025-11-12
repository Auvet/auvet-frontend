import { useState, useEffect } from 'react';
import { Button, Grid, Paper, Text, TextInput, Title, Group, Select, Box, Textarea } from '@mantine/core';
import { ConsultaRepository } from '@/repositories/ConsultaRepository';
import { AnimalClinicaRepository } from '@/repositories/AnimalClinicaRepository';
import { FuncionarioClinicaRepository } from '@/repositories/FuncionarioClinicaRepository';
import type { AnimalClinicaItem } from '@/interfaces/animalClinica';
import type { FuncionarioClinicaItem } from '@/interfaces/funcionarioClinica';
import { getCnpj } from '@/utils/storage';

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

export function ConsultasCreate() {
  const [form, setForm] = useState({
    data: '',
    hora: '',
    motivo: '',
    status: 'agendada',
    observacoes: '',
    animalId: '',
    funcionarioCpf: '',
  });
  const [animais, setAnimais] = useState<Array<{ id: number; nome: string; especie: string | null }>>([]);
  const [funcionarios, setFuncionarios] = useState<Array<{ cpf: string; nome: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadAnimais();
    loadFuncionarios();
  }, []);

  async function loadAnimais() {
    const cnpj = getCnpj();
    if (!cnpj) {
      setMessage('CNPJ da clínica não encontrado.');
      return;
    }
    try {
      const res = await animalClinicaRepo.listByClinica(cnpj);
      const animaisList = (res.data ?? [])
        .map((item: AnimalClinicaItem) => ({
          id: item.animal?.id || 0,
          nome: item.animal?.nome || '',
          especie: item.animal?.especie || null,
        }))
        .filter((animal) => animal.id > 0 && animal.nome);
      setAnimais(animaisList);
    } catch (e) {
      console.error('Erro ao carregar animais:', e);
      setMessage('Erro ao carregar animais da clínica.');
    }
  }

  async function loadFuncionarios() {
    const cnpj = getCnpj();
    if (!cnpj) {
      setMessage('CNPJ da clínica não encontrado.');
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
      setMessage('Erro ao carregar funcionários da clínica.');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    if (!form.data || !form.hora || !form.animalId || !form.funcionarioCpf) {
      setMessage('Data, hora, animal e funcionário são obrigatórios.');
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

      const animalId = parseInt(form.animalId);
      const animalExiste = animais.some(a => a.id === animalId);
      if (!animalExiste) {
        setMessage('Animal selecionado não pertence à clínica.');
        setLoading(false);
        return;
      }

      const funcionarioExiste = funcionarios.some(f => f.cpf === form.funcionarioCpf);
      if (!funcionarioExiste) {
        setMessage('Funcionário selecionado não pertence à clínica.');
        setLoading(false);
        return;
      }

      const dataDate = new Date(form.data);
      const [hours, minutes] = form.hora.split(':').map(Number);
      const horaDate = new Date(dataDate);
      horaDate.setHours(hours, minutes, 0, 0);

      const consultaData = {
        data: form.data,
        hora: horaDate.toISOString(),
        motivo: form.motivo || null,
        status: form.status,
        observacoes: form.observacoes || null,
        animalId: parseInt(form.animalId),
        funcionarioCpf: form.funcionarioCpf,
        clinicaCnpj: cnpj,
      };

      const response = await consultaRepo.createConsulta(consultaData);
      
      if (response.data?.id) {
        setMessage('Consulta cadastrada com sucesso!');
        setForm({ 
          data: '', 
          hora: '', 
          motivo: '', 
          status: 'agendada', 
          observacoes: '', 
          animalId: '', 
          funcionarioCpf: '' 
        });
      } else {
        setMessage('Erro ao cadastrar consulta.');
      }
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
          Cadastrar Consulta
        </Title>
        <Text size="lg" c="dimmed">
          Crie uma nova consulta para um animal
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
            <TextInput
              label="Data"
              type="date"
              required
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.currentTarget.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Hora"
              type="time"
              required
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.currentTarget.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Animal"
              required
              placeholder="Selecione o animal"
              value={form.animalId || null}
              onChange={(v) => setForm({ ...form, animalId: v || '' })}
              data={animais.map(a => ({ value: a.id.toString(), label: `${a.nome}${a.especie ? ` (${a.especie})` : ''}` }))}
              searchable
              clearable
              key={form.animalId === '' ? 'animal-reset' : 'animal'}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Funcionário"
              required
              placeholder="Selecione o funcionário"
              value={form.funcionarioCpf || null}
              onChange={(v) => setForm({ ...form, funcionarioCpf: v || '' })}
              data={funcionarios.map(f => ({ value: f.cpf, label: f.nome }))}
              searchable
              clearable
              key={form.funcionarioCpf === '' ? 'funcionario-reset' : 'funcionario'}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Motivo"
              placeholder="Motivo da consulta"
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.currentTarget.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Status"
              required
              value={form.status}
              onChange={(v) => setForm({ ...form, status: v || 'agendada' })}
              data={STATUS_CONSULTA}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Observações"
              placeholder="Observações sobre a consulta"
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.currentTarget.value })}
              minRows={3}
              autosize
            />
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

