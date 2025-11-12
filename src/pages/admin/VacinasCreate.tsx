import { useState, useEffect } from 'react';
import { Button, Grid, Paper, Text, TextInput, Title, Group, Select, Box } from '@mantine/core';
import { VacinaRepository } from '@/repositories/VacinaRepository';
import { AnimalClinicaRepository } from '@/repositories/AnimalClinicaRepository';
import { getCnpj } from '@/utils/storage';
import { VACINAS, FABRICANTES_VACINAS } from '@/utils/enums';
import type { AnimalClinicaItem } from '@/interfaces/animalClinica';

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

export function VacinasCreate() {
  const [form, setForm] = useState({
    nome: '',
    fabricante: '',
    dataAplicacao: '',
    dataValidade: '',
    animalId: '',
  });
  const [vacinaOutros, setVacinaOutros] = useState('');
  const [fabricanteOutros, setFabricanteOutros] = useState('');
  const [animais, setAnimais] = useState<Array<{ id: number; nome: string; especie: string | null }>>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadAnimais();
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    if (!form.nome || !form.dataAplicacao || !form.animalId) {
      setMessage('Nome, data de aplicação e animal são obrigatórios.');
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

      const nomeVacina = form.nome === 'Outros' ? vacinaOutros : form.nome;
      
      if (!nomeVacina) {
        setMessage('Nome da vacina é obrigatório.');
        setLoading(false);
        return;
      }

      const fabricanteFinal = form.fabricante === 'Outros' ? fabricanteOutros : form.fabricante;

      const vacinaData = {
        nome: nomeVacina,
        fabricante: fabricanteFinal || null,
        dataAplicacao: form.dataAplicacao,
        dataValidade: form.dataValidade || null,
        animalId: animalId,
        clinicaCnpj: cnpj,
      };

      const response = await vacinaRepo.createVacina(vacinaData);
      
      if (response.data?.id) {
        setMessage('Vacina cadastrada com sucesso!');
        setForm({ 
          nome: '', 
          fabricante: '', 
          dataAplicacao: '', 
          dataValidade: '', 
          animalId: '' 
        });
        setVacinaOutros('');
        setFabricanteOutros('');
      } else {
        setMessage('Erro ao cadastrar vacina.');
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
          Cadastrar Vacina
        </Title>
        <Text size="lg" c="dimmed">
          Cadastre uma nova vacina aplicada em um animal
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
            <Select
              label="Nome da Vacina"
              required
              placeholder="Selecione a vacina"
              value={form.nome || null}
              onChange={(v) => setForm({ ...form, nome: v || '' })}
              data={VACINAS}
              searchable
              clearable
              key={form.nome === '' ? 'vacina-reset' : 'vacina'}
            />
          </Grid.Col>
          {form.nome === 'Outros' && (
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
              value={form.fabricante || null}
              onChange={(v) => setForm({ ...form, fabricante: v || '' })}
              data={FABRICANTES_VACINAS}
              searchable
              clearable
              key={form.fabricante === '' ? 'fabricante-reset' : 'fabricante'}
            />
          </Grid.Col>
          {form.fabricante === 'Outros' && (
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
              value={form.dataAplicacao}
              onChange={(e) => setForm({ ...form, dataAplicacao: e.currentTarget.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Data de Validade"
              type="date"
              value={form.dataValidade}
              onChange={(e) => setForm({ ...form, dataValidade: e.currentTarget.value })}
            />
          </Grid.Col>
          <Grid.Col span={12}>
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

