import { Box, Container, Stack, Title, Text, Group, Button } from '@mantine/core';
import { Link } from 'react-router-dom';

export function Privacy() {
  return (
    <Box style={{ minHeight: '100vh', background: '#f9f9f9', position: 'relative', overflow: 'hidden' }}>
      <Box style={{ position: 'absolute', width: 180, height: 180, borderRadius: '40%', background: 'linear-gradient(135deg, #f8753780, #f8753740)', top: '-60px', left: '-40px', filter: 'blur(30px)' }} />
      <Box style={{ position: 'absolute', width: 220, height: 220, borderRadius: '40%', background: 'linear-gradient(135deg, #ff9f0080, #ff9f0040)', bottom: '-80px', right: '-50px', filter: 'blur(40px)' }} />
      <Container size="xl" style={{ maxWidth: 900, paddingLeft: 10, paddingRight: 10, position: 'relative', zIndex: 10 }}>
        <Stack gap="xl" py={{ base: 40, md: 60 }}>
          <Stack gap="sm">
            <Title order={1} fw={700} style={{ color: '#1a1a1a', fontSize: 'clamp(28px, 4vw, 42px)' }}>
              Política de Privacidade
            </Title>
            <Text c="dimmed" style={{ lineHeight: 1.6 }}>
              Saiba como coletamos, utilizamos e protegemos dados pessoais no AuVet, em conformidade com a LGPD e demais legislações aplicáveis.
            </Text>
          </Stack>

          <Stack gap="lg" style={{ color: '#1a1a1a' }}>
            <Stack gap="sm">
              <Title order={3} fw={600} style={{ color: '#1a1a1a', fontSize: 'clamp(20px, 3vw, 26px)' }}>
                1. Dados Coletados
              </Title>
              <Text>
                Coletamos dados de identificação de clínicas, profissionais autorizados e pacientes sob tutela veterinária. Também armazenamos informações de acesso, preferências de uso e registros operacionais necessários para oferecer os nossos serviços.
              </Text>
            </Stack>

            <Stack gap="sm">
              <Title order={3} fw={600} style={{ color: '#1a1a1a', fontSize: 'clamp(20px, 3vw, 26px)' }}>
                2. Uso das Informações
              </Title>
              <Text>
                Utilizamos os dados para autenticação, personalização da experiência, emissão de relatórios, comunicação com usuários e melhoria contínua do AuVet. Não comercializamos informações pessoais e compartilhamos dados apenas mediante consentimento ou obrigação legal.
              </Text>
            </Stack>

            <Stack gap="sm">
              <Title order={3} fw={600} style={{ color: '#1a1a1a', fontSize: 'clamp(20px, 3vw, 26px)' }}>
                3. Segurança e Retenção
              </Title>
              <Text>
                Adotamos criptografia em trânsito, controle de acesso por perfis, monitoramento contínuo e backups regulares. Os dados permanecem armazenados enquanto o contrato estiver ativo ou pelo período necessário ao cumprimento de obrigações legais. Após este prazo, realizamos anonimização ou exclusão definitiva.
              </Text>
            </Stack>

            <Stack gap="sm">
              <Title order={3} fw={600} style={{ color: '#1a1a1a', fontSize: 'clamp(20px, 3vw, 26px)' }}>
                4. Direitos dos Titulares
              </Title>
              <Text>
                Os titulares podem solicitar confirmação de tratamento, acesso, correção, portabilidade ou exclusão de dados. Entre em contato com nosso suporte e responderemos conforme os prazos previstos em lei.
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

