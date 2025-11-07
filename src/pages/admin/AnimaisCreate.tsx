import { useState } from 'react';
import { AnimalRepository } from '@/repositories/AnimalRepository';
import { AnimalClinicaRepository } from '@/repositories/AnimalClinicaRepository';
import { Button, Grid, NumberInput, Paper, Text, TextInput, Title, Group, Select, Box } from '@mantine/core';
import { getCnpj } from '@/utils/storage';
import { cleanCPF, validateCPF } from '@/utils/cpfCnpj';
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

const animalRepo = new AnimalRepository();
const animalClinicaRepo = new AnimalClinicaRepository();

export function AnimaisCreate() {
  const [form, setForm] = useState({
    nome: '',
    especie: '',
    raca: '',
    sexo: '',
    idade: '',
    peso: '',
    tutorCpf: '',
  });
  const [especieOutros, setEspecieOutros] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    if (!form.nome || !form.tutorCpf) {
      setMessage('Nome e CPF do tutor são obrigatórios.');
      setLoading(false);
      return;
    }
    
    const cpfValidation = validateCPF(form.tutorCpf);
    if (!cpfValidation.isValid) {
      setMessage(cpfValidation.error || 'CPF do tutor inválido');
      setLoading(false);
      return;
    }
    
    try {
      const cnpj = getCnpj();
      if (!cnpj) {
        setMessage('CNPJ da clínica não encontrado.');
        return;
      }

      const cleanTutorCpf = cleanCPF(form.tutorCpf);
      const especieFinal = form.especie === 'Outros' ? especieOutros : form.especie;
      
      const animalData: any = {
        nome: form.nome,
        tutorCpf: cleanTutorCpf,
      };
      if (especieFinal) animalData.especie = especieFinal;
      if (form.raca) animalData.raca = form.raca;
      if (form.sexo) animalData.sexo = form.sexo;
      if (form.idade) animalData.idade = parseInt(form.idade);
      if (form.peso) animalData.peso = parseFloat(form.peso);

      const response = await animalRepo.createAnimal(animalData);
      
      if (response.data?.id) {
        await animalClinicaRepo.createRelation(response.data.id, cnpj);
        setMessage('Animal cadastrado e vinculado à clínica com sucesso!');
        setForm({ 
          nome: '', 
          especie: '', 
          raca: '', 
          sexo: '', 
          idade: '', 
          peso: '', 
          tutorCpf: '' 
        });
        setEspecieOutros('');
      } else {
        setMessage('Erro ao cadastrar animal.');
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
          Cadastrar Animal
        </Title>
        <Text size="lg" c="dimmed">
          Crie um novo animal e vincule à clínica atual
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
              label="Nome"
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.currentTarget.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="CPF do Tutor"
              required
              placeholder="000.000.000-00"
              value={form.tutorCpf}
              onChange={(e) => setForm({ ...form, tutorCpf: e.currentTarget.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Espécie"
              placeholder="Selecione a espécie"
              value={form.especie || null}
              onChange={(v) => setForm({ ...form, especie: v || '' })}
              data={ESPECIES_ANIMAIS}
              searchable
              clearable
            />
          </Grid.Col>
          {form.especie === 'Outros' && (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Especifique a espécie"
                required
                placeholder="Digite a espécie"
                value={especieOutros}
                onChange={(e) => setEspecieOutros(e.currentTarget.value)}
              />
            </Grid.Col>
          )}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Raça"
              placeholder="Ex: Golden Retriever, Persa"
              value={form.raca}
              onChange={(e) => setForm({ ...form, raca: e.currentTarget.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Sexo"
              value={form.sexo || null}
              onChange={(v) => setForm({ ...form, sexo: v || '' })}
              data={[
                { value: 'M', label: 'Macho' },
                { value: 'F', label: 'Fêmea' },
              ]}
              clearable
              placeholder="Selecione"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Idade"
              min={0}
              value={form.idade === '' ? undefined : Number(form.idade)}
              onChange={(value) =>
                setForm({
                  ...form,
                  idade: value === '' ? '' : value.toString(),
                })
              }
              placeholder="0"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Peso (kg)"
              min={0}
              decimalScale={2}
              value={form.peso === '' ? undefined : Number(form.peso)}
              onChange={(value) =>
                setForm({
                  ...form,
                  peso: value === '' ? '' : value.toString(),
                })
              }
              placeholder="0.00"
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
