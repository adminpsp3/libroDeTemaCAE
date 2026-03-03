// Selector.jsx — Material UI v5
// npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';

const cards = [
  {
    id: 1,
    image: 'https://thumbs.dreamstime.com/b/palabras-de-pensamiento-estrat%C3%A9gico-sobre-la-forma-del-cerebro-y-los-papeles-cerebral-243317198.jpg',
    titulo: 'Planificaciones',
    subtitulo: 'Instrumento académico dinámico',
    descripcion: 'Es la hipótesis de trabajo que organiza el proceso de enseñanza. Actúa como un puente entre el currículo teórico y la práctica en el aula, permitiendo anticipar, dar coherencia y evaluar las acciones pedagógicas de forma flexible y sistemática.',
  },
  {
    id: 2,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR52bQ4qSU8wx_zs2QdkJyJVbzwkiT0kjfp9Q&s',
    titulo: 'Libros de temas',
    subtitulo: 'Registros académico digital ',
    descripcion: 'Es el documento oficial y legal que registra la actividad diaria del aula. Funciona como la memoria técnica del proceso educativo, donde se asientan fehacientemente los contenidos dictados, las actividades realizadas y las novedades del grupo para garantizar la continuidad pedagógica.',
  },
];

export default function Selector() {
  const [estado, setEstado] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const valorGuardado = localStorage.getItem('estado');
    setEstado(valorGuardado || 'No logueado');
  }, []);

  const handleIngresar = (id) => {
    if (id === 2) {
      if (estado === 'logueado') navigate('/libros');
      return;
    }
    console.log('Ingresando a sección con id:', id);
  };

  return (
    // Página completa — fondo blanco
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 4 },
      }}
    >
      {/* Encabezado */}
      <Box sx={{ textAlign: 'center', mb: 5, width: '100%' }}>
        <Typography variant="h4" component="h2" fontWeight={700} color="primary" gutterBottom>
          Selección de operaciones
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" fontSize="1.1rem">
          ¿A dónde querés ir hoy?
        </Typography>
      </Box>

      {/*
        Contenedor de cards:
        - Mobile: columna, cada card ocupa 100% del ancho de pantalla
        - Desktop: fila, cada card tiene 340px fijo, centradas
      */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          alignItems: { xs: 'stretch', sm: 'flex-start' },
          gap: 3,
          width: '100%',
          maxWidth: { xs: '100%', sm: 740 }, // 340 * 2 + gap
        }}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            elevation={3}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              // Mobile: ocupa todo el ancho | Desktop: ancho fijo
              flex: { xs: '1 1 100%', sm: '0 0 340px' },
              maxWidth: { xs: '100%', sm: 340 },
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 32px rgba(25, 118, 210, 0.2)',
              },
            }}
          >
            {/* Imagen con overlay — altura fija para mantener proporción */}
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="180"
                image={card.image}
                alt={card.titulo}
                loading="lazy"
                sx={{ objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(25,118,210,0.25))',
                }}
              />
            </Box>

            {/* Contenido */}
            <CardContent
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 3,
              }}
            >
              <Typography variant="h6" fontWeight={700} color="text.primary">
                {card.titulo}
              </Typography>

              <Typography
                variant="caption"
                fontWeight={600}
                color="primary"
                sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
              >
                {card.subtitulo}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ flexGrow: 1, lineHeight: 1.6 }}
              >
                {card.descripcion}
              </Typography>

              <Button
                variant="contained"
                fullWidth
                onClick={() => handleIngresar(card.id)}
                sx={{
                  mt: 2,
                  py: 1.2,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  '&:hover': { boxShadow: '0 6px 16px rgba(25, 118, 210, 0.45)' },
                }}
              >
                Ingresar
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
