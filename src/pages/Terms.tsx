import { Box, Container, Stack, Title, Text, Group, Button } from '@mantine/core';
import { Link } from 'react-router-dom';

export function Terms() {
  return (
    <Box style={{ minHeight: '100vh', background: '#f9f9f9', position: 'relative', overflow: 'hidden' }}>
      <Box style={{ position: 'absolute', width: 180, height: 180, borderRadius: '40%', background: 'linear-gradient(135deg, #f8753780, #f8753740)', top: '-60px', left: '-40px', filter: 'blur(30px)' }} />
      <Box style={{ position: 'absolute', width: 220, height: 220, borderRadius: '40%', background: 'linear-gradient(135deg, #ff9f0080, #ff9f0040)', bottom: '-80px', right: '-50px', filter: 'blur(40px)' }} />
      <Container size="xl" style={{ maxWidth: 900, paddingLeft: 10, paddingRight: 10, position: 'relative', zIndex: 10 }}>
        <Stack gap="xl" py={{ base: 40, md: 60 }}>
          <Stack gap="sm">
            <Title order={1} fw={700} style={{ color: '#1a1a1a', fontSize: 'clamp(28px, 4vw, 42px)' }}>
              Termos de Uso
            </Title>
            <Text c="dimmed" style={{ lineHeight: 1.6 }}>
              Estes Termos de Uso estabelecem as regras para utilização da plataforma AuVet por clínicas veterinárias e profissionais autorizados.
            </Text>
          </Stack>

          <Stack gap="lg" style={{ color: '#1a1a1a' }}>
            <Stack gap="sm">
              <Title order={3} fw={600} style={{ color: '#1a1a1a', fontSize: 'clamp(20px, 3vw, 26px)' }}>
                1. Aceitação dos Termos
              </Title>
              <Text>
                Ao acessar o AuVet, você declara possuir autorização para representar a clínica cadastrada e concorda em cumprir integralmente estes Termos de Uso. Mudanças relevantes serão comunicadas pelos canais oficiais e a data da última atualização será informada nesta página.
              </Text>
            </Stack>

            <Stack gap="sm">
              <Title order={3} fw={600} style={{ color: '#1a1a1a', fontSize: 'clamp(20px, 3vw, 26px)' }}>
                2. Uso da Plataforma
              </Title>
              <Text>
                O AuVet deve ser utilizado exclusivamente para fins relacionados à gestão da clínica veterinária. Você se compromete a fornecer dados verdadeiros, manter informações atualizadas e a não compartilhar credenciais com terceiros não autorizados.
              </Text>
              <Text>
                É proibido realizar engenharia reversa, explorar vulnerabilidades ou executar ações que comprometam a disponibilidade, a confidencialidade ou a integridade do sistema. Caso identifique falhas, comunique imediatamente o nosso time de suporte.
              </Text>
            </Stack>

            <Stack gap="sm">
              <Title order={3} fw={600} style={{ color: '#1a1a1a', fontSize: 'clamp(20px, 3vw, 26px)' }}>
                3. Responsabilidades
              </Title>
              <Text>
                A clínica é responsável por definir perfis de acesso, orientar os colaboradores sobre boas práticas e garantir o uso adequado da plataforma. O AuVet não se responsabiliza por informações inseridas de maneira incorreta ou não autorizada.
              </Text>
              <Text>
                Reservamo-nos o direito de suspender ou encerrar contas que violem estes Termos ou a legislação aplicável, bem como adotar medidas legais cabíveis em casos de uso indevido.
              </Text>
            </Stack>

            <Stack gap="sm">
              <Title order={3} fw={600} style={{ color: '#1a1a1a', fontSize: 'clamp(20px, 3vw, 26px)' }}>
                4. Atualizações e Disponibilidade
              </Title>
              <Text>
                Trabalhamos continuamente para aprimorar o AuVet. Novas funcionalidades, correções e melhorias podem ser disponibilizadas sem aviso prévio, mantendo o compromisso com estabilidade e segurança. Eventuais períodos de manutenção serão comunicados quando possível.
              </Text>
            </Stack>
          </Stack>

          <Group justify="space-between" align="center" mt="lg">
            <Text c="dimmed" size="sm">
              Última atualização: 08 de novembro de 2025
            </Text>
            <Button component={Link} to="/" size="md" radius="xl" variant="outline" style={{ borderColor: '#f87537', color: '#f87537' }}>
              Voltar para a Home
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}

