import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  SimpleGrid,
  Paper,
  Box,
} from '@mantine/core';
import { IconCalendarEvent, IconUser, IconShield, IconBrandInstagram } from '@tabler/icons-react';
import auvetLogo from '@/assets/auvet-logo.png';
import landingPage1 from '@/assets/landing-page-1.png';
import animalGato from '@/assets/animal-gato.png';
import animalHamster from '@/assets/animal-hamster.png';
import animalCachorro from '@/assets/animal-cachorro.png';
import animalPassaro from '@/assets/animal-passaro.png';
import animalCoelho from '@/assets/animal-coelho.png';
import patas from '@/assets/patas.png';

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

export function Home() {
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <Box style={{ minHeight: '100vh', background: '#f9f9f9', position: 'relative', overflow: 'hidden' }}>
      <Box style={{ position: 'relative', paddingTop: 12, paddingLeft: 10, paddingRight: 10 }}>
        <Container size="xl" style={{ maxWidth: 1195, paddingLeft: 0 }}>
          <Box
            style={{
              background: 'white',
              borderRadius: 32,
              padding: 'clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px)',
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
                  width: 'clamp(32px, 5vw, 40px)',
                  height: 'clamp(32px, 5vw, 40px)',
                  objectFit: 'contain',
                }}
              />
              <Title order={3} fw={700} style={{ color: '#1a1a1a', letterSpacing: '0.1em', fontSize: 'clamp(14px, 3vw, 20px)' }}>
                AUVET
              </Title>
            </Group>
          </Group>

          <Group gap="lg" visibleFrom="sm">
            <Text
              component={Link}
              to="/"
              style={{
                textDecoration: location.pathname === '/' ? 'underline' : 'none',
                textDecorationColor: '#f87537',
                textDecorationThickness: '2px',
                textUnderlineOffset: '6px',
                color: location.pathname === '/' ? '#f87537' : '#1a1a1a',
                fontWeight: location.pathname === '/' ? 600 : 400,
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              Home
            </Text>
            <Text
              component="a"
              href="#sobre"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('sobre');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
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

      <Box style={{ position: 'relative', paddingTop: 'clamp(20px, 5vw, 40px)', paddingBottom: 'clamp(40px, 8vw, 80px)', overflow: 'hidden', paddingLeft: 10, paddingRight: 10 }}>
        <BlobShape size={200} top="10%" left="-5%" delay={0} color="#f87537" />
        <BlobShape size={150} top="60%" left="90%" delay={1} color="#ff9f00" />
        <Box hiddenFrom="sm">
          <FloatingCircle size={40} top="20%" left="85%" delay={0.5} color="#f87537" />
          <FloatingCircle size={30} top="70%" left="5%" delay={1.5} color="#ff9f00" />
        </Box>
        <Box visibleFrom="sm">
          <FloatingCircle size={80} top="20%" left="85%" delay={0.5} color="#f87537" />
          <FloatingCircle size={60} top="70%" left="5%" delay={1.5} color="#ff9f00" />
          <FloatingCircle size={100} top="40%" left="75%" delay={2} color="#f87537" />
          <FloatingCircle size={50} top="80%" left="92%" delay={0.8} />
        </Box>

        <Box style={{ position: 'relative', zIndex: 10 }}>
          <Container size="xl" style={{ maxWidth: 1195, paddingLeft: 0 }}>
            <Group align="flex-start" gap="xl" wrap="wrap">
              <Stack 
                flex={1} 
                style={{ minWidth: 'min(300px, 100%)', maxWidth: '100%' }} 
                mt={{ base: 20, md: 40 }}
                className="fade-in"
              >
                <Title
                  order={1}
                  fw={700}
                  lh={1.2}
                  style={{ 
                    color: '#1a1a1a',
                    fontSize: 'clamp(24px, 6vw, 54px)',
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #f87537 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Gestão completa para sua clínica veterinária
                </Title>
                <Text 
                  c="dimmed" 
                  mt="md" 
                  style={{ 
                    lineHeight: 1.6, 
                    fontSize: 'clamp(14px, 2vw, 16px)',
                  }}
                >
                  Organize pacientes, tutores e atendimentos em um só lugar, de forma simples e prática.
                </Text>
                <Group mt="xl" gap="md" wrap="wrap" style={{ width: '100%' }}>
                  <Button
                    component={Link}
                    to="/registrar-clinica"
                    size="lg"
                    radius="xl"
                    className="button-glow"
                    style={{
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                      color: 'white',
                      width: '100%',
                      maxWidth: '100%',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(26, 26, 26, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 26, 26, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(26, 26, 26, 0.3)';
                    }}
                  >
                    Cadastrar clínica
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    size="lg"
                    variant="outline"
                    radius="xl"
                    style={{
                      borderColor: '#1a1a1a',
                      color: '#1a1a1a',
                      background: 'transparent',
                      width: '100%',
                      maxWidth: '100%',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#1a1a1a';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 26, 26, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#1a1a1a';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Entrar
                  </Button>
                </Group>
              </Stack>

              <Box 
                flex={1}
                visibleFrom="md"
                style={{ 
                  position: 'relative', 
                  minHeight: 500,
                  flex: '1 1 0',
                  overflow: 'hidden',
                  transform: `translateY(${scrollY * 0.3}px)`,
                  transition: 'transform 0.1s ease-out',
                }}
                className="hero-image fade-in"
              >
                <Box
                  component="img"
                  src={landingPage1}
                  alt="Ilustração AuVet"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'left center',
                    display: 'block',
                    filter: 'drop-shadow(0 10px 30px rgba(248, 117, 55, 0.2))',
                    transition: 'filter 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'drop-shadow(0 15px 40px rgba(248, 117, 55, 0.3))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'drop-shadow(0 10px 30px rgba(248, 117, 55, 0.2))';
                  }}
                />
              </Box>
            </Group>
          </Container>
        </Box>
      </Box>

      <Box style={{ background: '#f9f9f9', paddingTop: 'clamp(40px, 6vw, 60px)', paddingBottom: 'clamp(40px, 6vw, 60px)', position: 'relative', overflow: 'hidden', paddingLeft: 10, paddingRight: 10 }}>
        <Box hiddenFrom="sm">
          <FloatingCircle size={30} top="10%" left="2%" delay={0.3} color="#f87537" />
        </Box>
        <Box visibleFrom="sm">
          <FloatingCircle size={60} top="10%" left="2%" delay={0.3} color="#f87537" />
          <Box
            style={{
              position: 'absolute',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#ff9f00',
              opacity: 0.3,
              top: '70%',
              right: '5%',
              animation: `floating ${3 + 1.2}s ease-in-out infinite`,
              animationDelay: '1.2s',
              zIndex: 1,
            }}
          />
          <BlobShape size={180} top="50%" left="-3%" delay={0.6} color="#f87537" />
        </Box>
        
        <Container size="xl" style={{ maxWidth: 1195, paddingLeft: 0, position: 'relative', zIndex: 10 }}>
          <Stack gap="xl" mb={40}>
            <Title order={2} fw={700} ta="center" style={{ color: '#1a1a1a', fontSize: 'clamp(20px, 4vw, 32px)' }}>
              Suporte para qualquer animal
            </Title>
            <Group gap="xl" justify="center" wrap="wrap" style={{ width: '100%', gap: 'clamp(12px, 3vw, 24px)' }}>
              <Box
                className="fade-in animal-card"
                style={{
                  width: 'clamp(80px, 15vw, 140px)',
                  height: 'clamp(80px, 15vw, 140px)',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f87537 0%, #ff9f00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'clamp(10px, 2vw, 18px)',
                  flex: '0 0 auto',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(248, 117, 55, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(248, 117, 55, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(248, 117, 55, 0.3)';
                }}
              >
                <Box
                  component="img"
                  src={animalGato}
                  alt="Gato"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Box
                className="fade-in animal-card"
                style={{
                  width: 'clamp(80px, 15vw, 140px)',
                  height: 'clamp(80px, 15vw, 140px)',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'clamp(10px, 2vw, 18px)',
                  flex: '0 0 auto',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ff9f00 0%, #f87537 100%)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 159, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                <Box
                  component="img"
                  src={animalHamster}
                  alt="Hamster"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Box
                className="fade-in animal-card"
                style={{
                  width: 'clamp(80px, 15vw, 140px)',
                  height: 'clamp(80px, 15vw, 140px)',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'clamp(10px, 2vw, 18px)',
                  flex: '0 0 auto',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ff9f00 0%, #f87537 100%)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 159, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                <Box
                  component="img"
                  src={animalCachorro}
                  alt="Cachorro"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Box
                className="fade-in animal-card"
                style={{
                  width: 'clamp(80px, 15vw, 140px)',
                  height: 'clamp(80px, 15vw, 140px)',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'clamp(10px, 2vw, 18px)',
                  flex: '0 0 auto',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ff9f00 0%, #f87537 100%)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 159, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                <Box
                  component="img"
                  src={animalPassaro}
                  alt="Pássaro"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Box
                className="fade-in animal-card"
                style={{
                  width: 'clamp(80px, 15vw, 140px)',
                  height: 'clamp(80px, 15vw, 140px)',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'clamp(10px, 2vw, 18px)',
                  flex: '0 0 auto',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ff9f00 0%, #f87537 100%)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 159, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                <Box
                  component="img"
                  src={animalCoelho}
                  alt="Coelho"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Group>
          </Stack>
        </Container>
      </Box>

      <Box id="sobre" style={{ background: 'white', paddingTop: 'clamp(40px, 8vw, 80px)', paddingBottom: 'clamp(40px, 8vw, 80px)', position: 'relative', scrollMarginTop: '80px', overflow: 'hidden', paddingLeft: 10, paddingRight: 10 }}>
        <Box hiddenFrom="sm">
          <FloatingCircle size={35} top="15%" left="8%" delay={0.4} color="#ff9f00" />
        </Box>
        <Box visibleFrom="sm">
          <FloatingCircle size={70} top="15%" left="8%" delay={0.4} color="#ff9f00" />
          <Box
            style={{
              position: 'absolute',
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: '#f87537',
              opacity: 0.3,
              top: '60%',
              right: '8%',
              animation: `floating ${3 + 1.8}s ease-in-out infinite`,
              animationDelay: '1.8s',
              zIndex: 1,
            }}
          />
          <Box
            style={{
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: '40%',
              background: `linear-gradient(135deg, #ff9f0080, #ff9f0040)`,
              top: '30%',
              right: '-5%',
              animation: `floating ${4 + 1}s ease-in-out infinite`,
              animationDelay: '1s',
              filter: 'blur(20px)',
              zIndex: 1,
            }}
          />
          <Box
            style={{
              position: 'absolute',
              width: 160,
              height: 160,
              borderRadius: '40%',
              background: `linear-gradient(135deg, #f8753780, #f8753740)`,
              bottom: '10%',
              left: '-4%',
              animation: `floating ${4 + 0.7}s ease-in-out infinite`,
              animationDelay: '0.7s',
              filter: 'blur(20px)',
              zIndex: 1,
            }}
          />
        </Box>
        
        <Container size="xl" style={{ maxWidth: 1195, paddingLeft: 0, position: 'relative', zIndex: 10 }}>
          <Stack align="center" gap="md" mb={60}>
            <Title order={2} fw={700} style={{ color: '#1a1a1a', fontSize: 'clamp(28px, 3vw, 36px)' }}>
              Tudo em um só <Text span c="#f87537" inherit>lugar</Text>
            </Title>
            <Text size="lg" c="dimmed" maw={600} ta="center">
              Auvet combina todas as ferramentas necessárias para gerenciar sua clínica veterinária de forma completa e profissional.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 20, sm: 30 }} mt={{ base: 30, sm: 40 }} ref={cardsRef}>
            <Paper
              p="xl"
              radius="md"
              shadow="md"
              className="fade-in card-hover"
              style={{ 
                position: 'relative', 
                paddingTop: 60,
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(248, 117, 55, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Box
                className="icon-box"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f87537 0%, #ff9f00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: -32,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 4px 15px rgba(248, 117, 55, 0.4)',
                  transition: 'all 0.3s ease',
                }}
              >
                <IconCalendarEvent size={32} color="white" />
              </Box>
              <Title order={4} mt="md" mb="sm" style={{ color: '#1a1a1a' }}>
                Gestão de Consultas
              </Title>
              <Text c="dimmed" size="sm">
                Agende e gerencie consultas de forma simples e eficiente. Controle o calendário completo da sua clínica.
              </Text>
            </Paper>

            <Paper
              p="xl"
              radius="md"
              shadow="md"
              className="fade-in card-hover"
              style={{ 
                position: 'relative', 
                paddingTop: 60,
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 159, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Box
                className="icon-box"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff9f00 0%, #f87537 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: -32,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 4px 15px rgba(255, 159, 0, 0.4)',
                  transition: 'all 0.3s ease',
                }}
              >
                <IconUser size={32} color="white" />
              </Box>
              <Title order={4} mt="md" mb="sm" style={{ color: '#1a1a1a' }}>
                Controle de Pacientes
              </Title>
              <Text c="dimmed" size="sm">
                Mantenha o histórico completo dos animais e seus tutores. Acesso rápido a todas as informações importantes.
              </Text>
            </Paper>

            <Paper
              p="xl"
              radius="md"
              shadow="md"
              className="fade-in card-hover"
              style={{ 
                position: 'relative', 
                paddingTop: 60,
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(248, 117, 55, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Box
                className="icon-box"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f87537 0%, #ff9f00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: -32,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 4px 15px rgba(248, 117, 55, 0.4)',
                  transition: 'all 0.3s ease',
                }}
              >
                <IconShield size={32} color="white" />
              </Box>
              <Title order={4} mt="md" mb="sm" style={{ color: '#1a1a1a' }}>
                Sistema Seguro
              </Title>
              <Text c="dimmed" size="sm">
                Proteção total dos dados da sua clínica. Sistema confiável com backups automáticos e segurança de alto nível.
              </Text>
            </Paper>
          </SimpleGrid>
        </Container>
      </Box>

      <Box style={{ background: 'linear-gradient(135deg, #fff4e6 0%, #fff9f0 100%)', paddingTop: 'clamp(40px, 8vw, 80px)', paddingBottom: 'clamp(40px, 8vw, 80px)', position: 'relative', overflow: 'hidden', paddingLeft: 10, paddingRight: 10 }}>
        <Box hiddenFrom="sm">
          <FloatingCircle size={50} top="20%" left="10%" delay={0.5} color="#f87537" />
        </Box>
        <Box visibleFrom="sm">
          <FloatingCircle size={100} top="20%" left="10%" delay={0.5} color="#f87537" />
          <Box
            style={{
              position: 'absolute',
              width: 65,
              height: 65,
              borderRadius: '50%',
              background: '#ff9f00',
              opacity: 0.3,
              bottom: '25%',
              right: '12%',
              animation: `floating ${3 + 1.5}s ease-in-out infinite`,
              animationDelay: '1.5s',
              zIndex: 1,
            }}
          />
          <Box
            style={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: '40%',
              background: `linear-gradient(135deg, #f8753780, #f8753740)`,
              top: '-5%',
              right: '-5%',
              animation: `floating ${4 + 1.2}s ease-in-out infinite`,
              animationDelay: '1.2s',
              filter: 'blur(20px)',
              zIndex: 1,
            }}
          />
          <Box
            style={{
              position: 'absolute',
              width: 180,
              height: 180,
              borderRadius: '40%',
              background: `linear-gradient(135deg, #ff9f0080, #ff9f0040)`,
              bottom: '-8%',
              left: '-3%',
              animation: `floating ${4 + 0.9}s ease-in-out infinite`,
              animationDelay: '0.9s',
              filter: 'blur(20px)',
              zIndex: 1,
            }}
          />
        </Box>
        
        <Container size="md" style={{ position: 'relative', zIndex: 10, paddingLeft: 0 }}>
          <Stack align="center" gap="lg">
            <Title order={2} fw={700} ta="center" style={{ color: '#1a1a1a', fontSize: 'clamp(24px, 5vw, 40px)' }}>
              Pronto para começar?
            </Title>
            <Text size="lg" c="dimmed" ta="center" maw={500} style={{ fontSize: 'clamp(14px, 2vw, 18px)' }}>
              Cadastre sua clínica agora e comece a gerenciar seus pacientes de forma profissional.
            </Text>
            <Stack gap="md" mt="md" align="stretch" hiddenFrom="sm" style={{ width: '100%', maxWidth: 500 }}>
              <Button
                component={Link}
                to="/registrar-clinica"
                size="lg"
                radius="xl"
                style={{ 
                  background: 'linear-gradient(135deg, #f87537 0%, #ff9f00 100%)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(248, 117, 55, 0.4)',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(248, 117, 55, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(248, 117, 55, 0.4)';
                }}
              >
                Cadastrar Clínica
              </Button>
              <Button
                component={Link}
                to="/login"
                size="lg"
                variant="outline"
                radius="xl"
                style={{
                  borderColor: '#ff9f00',
                  color: '#ff9f00',
                  transition: 'all 0.3s ease',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ff9f00';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 159, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#ff9f00';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Já tenho conta
              </Button>
            </Stack>
            <Group mt="md" gap="md" visibleFrom="sm" style={{ width: '100%', maxWidth: 500 }}>
              <Button
                component={Link}
                to="/registrar-clinica"
                size="lg"
                radius="xl"
                style={{ 
                  background: 'linear-gradient(135deg, #f87537 0%, #ff9f00 100%)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(248, 117, 55, 0.4)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(248, 117, 55, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(248, 117, 55, 0.4)';
                }}
              >
                Cadastrar Clínica
              </Button>
              <Button
                component={Link}
                to="/login"
                size="lg"
                variant="outline"
                radius="xl"
                style={{
                  borderColor: '#ff9f00',
                  color: '#ff9f00',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ff9f00';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 159, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#ff9f00';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Já tenho conta
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      <Box style={{ background: 'white', paddingTop: 'clamp(40px, 8vw, 80px)', paddingBottom: 'clamp(20px, 4vw, 40px)', position: 'relative', overflow: 'hidden', paddingLeft: 10, paddingRight: 10 }}>
        <Box
          component="img"
          src={patas}
          alt="Pegadas"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(300px, 60vw, 600px)',
            height: 'auto',
            opacity: 0.15,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        
        <Box hiddenFrom="sm">
          <Box
            style={{
              position: 'absolute',
              bottom: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f87537, #ff9f00)',
              opacity: 0.2,
              filter: 'blur(40px)',
              zIndex: 1,
            }}
          />
        </Box>
        <Box visibleFrom="sm">
          <Box
            style={{
              position: 'absolute',
              bottom: -100,
              right: -100,
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f87537, #ff9f00)',
              opacity: 0.2,
              filter: 'blur(60px)',
              zIndex: 1,
            }}
          />
        </Box>

        <Container size="xl" style={{ maxWidth: 1195, paddingLeft: 0, position: 'relative', zIndex: 10 }}>
          <Stack gap="md" style={{ maxWidth: 500 }}>
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

            <Text size="md" style={{ color: '#1a1a1a', lineHeight: 1.6 }}>
              Sistema de gestão para clínicas<br />
              veterinárias. Facilite o atendimento e tenha<br />
              mais tempo para cuidar dos animais.
            </Text>

            <Box
              component="a"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                background: '#1a1a1a',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <IconBrandInstagram size={24} color="white" />
            </Box>
            <Group gap="md" mt="md">
              <Text
                component={Link}
                to="/termos-de-uso"
                style={{
                  color: '#999',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '15px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Termos de Uso
              </Text>
              <Text
                component={Link}
                to="/politica-de-privacidade"
                style={{
                  color: '#999',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '15px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Política de Privacidade
              </Text>
            </Group>
          </Stack>

          <Text
            size="sm"
            ta="center"
            mt={60}
            style={{ color: '#999', position: 'relative', zIndex: 10 }}
          >
            © Copyright Auvet 2025. Design by Auvet.
          </Text>
        </Container>
      </Box>

      <style>{`
        @keyframes floating {
          0% { transform: translate(0, 0px); }
          50% { transform: translate(0, -15px); }
          100% { transform: translate(0, 0px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .fade-in {
          opacity: 0;
        }
        .fade-in.animate-in {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .card-hover:hover .icon-box {
          transform: translateX(-50%) scale(1.1) rotate(5deg);
        }
        .animal-card:hover img {
          transform: scale(1.1);
          transition: transform 0.3s ease;
        }
        .button-glow {
          position: relative;
          overflow: hidden;
        }
        .button-glow::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        .button-glow:hover::before {
          left: 100%;
        }
        @media (max-width: 768px) {
          .hero-image {
            width: 100% !important;
            margin-top: 20px;
            transform: none !important;
          }
          .fade-in {
            animation-delay: 0s !important;
          }
        }
        @media (min-width: 769px) {
          .hero-image {
            flex: 1 1 0;
            min-width: 300px;
          }
        }
        @media (max-width: 480px) {
          .animal-card {
            width: 70px !important;
            height: 70px !important;
          }
        }
      `}</style>
    </Box>
  );
}
