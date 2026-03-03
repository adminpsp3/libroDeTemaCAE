// Libros_disponibles.jsx — Material UI v5
// npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';

import { MenuBookRounded, SchoolRounded } from '@mui/icons-material';

export default function Libros_disponibles() {
  const navigate = useNavigate();

  const [estado, setEstado] = useState('No logueado');
  const [dni, setDni] = useState('');
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const valorGuardado = localStorage.getItem('estado');
    setEstado(valorGuardado || 'No logueado');
    const savedDni = localStorage.getItem('login_password');
    setDni(savedDni || '');
  }, []);

  useEffect(() => {
    if (!dni || dni === 'No DNI ingresado') {
      setLoading(false);
      setError('No se encontró DNI. Iniciá sesión primero.');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const url = `https://script.google.com/macros/s/AKfycbyofpMHjhWlfVZwRxYzhAJzppEmkNL37m7tWIyxwUvkxWBrG9sHKvdamlUX1hW1zXcr/exec?dni=${encodeURIComponent(dni)}`;

      try {
        const response = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-cache' });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setRegistros(data || []);
      } catch (err) {
        console.error('Error al obtener datos:', err);
        setError('No se pudieron cargar los registros. Intentá más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dni]);

  const handleSelect = (index, registro) => {
    setSelectedIndex(index);
    localStorage.setItem('urlApi', registro.urlApi || '');
    localStorage.setItem('espacioCurricular', registro['Espacio Curricular'] || '');
    localStorage.setItem('docente', registro.Docente || '');
    navigate('/registros');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#ffffff',
        py: { xs: 4, md: 6 },
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        {/* Encabezado */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h5"
            component="h1"
            fontWeight={700}
            color="primary"
            gutterBottom
          >
            Mis Libros de Tema disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Seleccioná un libro para ver sus detalles
          </Typography>
        </Box>

        {/* Estado: cargando */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Estado: error */}
        {!loading && error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Estado: sin datos */}
        {!loading && !error && registros.length === 0 && (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            No se encontraron registros para este DNI.
          </Alert>
        )}

        {/* Lista de registros */}
        {!loading && registros.length > 0 && (
          <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <List disablePadding>
              {registros.map((reg, idx) => {
                const isSelected = selectedIndex === reg['#'];
                const isLast = idx === registros.length - 1;

                return (
                  <Box key={reg['#']}>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => handleSelect(reg['#'], reg)}
                      sx={{
                        px: 3,
                        py: 2,
                        transition: 'background 0.15s',
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          '&:hover': { bgcolor: 'primary.dark' },
                          '& .MuiTypography-root': { color: '#fff' },
                          '& .MuiAvatar-root': {
                            bgcolor: 'rgba(255,255,255,0.25)',
                          },
                          '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.75)' },
                        },
                        '&:hover': {
                          bgcolor: 'rgba(25,118,210,0.08)',
                        },
                      }}
                    >
                      {/* Avatar con ícono */}
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: isSelected ? 'rgba(255,255,255,0.25)' : 'primary.main',
                            width: 44,
                            height: 44,
                          }}
                        >
                          <MenuBookRounded sx={{ fontSize: 22, color: '#fff' }} />
                        </Avatar>
                      </ListItemAvatar>

                      {/* Texto principal y secundario */}
                      <ListItemText
                        primary={
                          <Typography fontWeight={600} fontSize="0.95rem">
                            {reg['Espacio Curricular']}
                          </Typography>
                        }
                        secondary={
                          <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, mt: 0.3 }}>
                            <Typography variant="caption" component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <SchoolRounded sx={{ fontSize: 13 }} />
                              {reg.Docente}
                            </Typography>
                            <Typography variant="caption" component="span">
                              Curso y División: <strong>{reg.CyD}</strong>
                            </Typography>
                            <Typography variant="caption" component="span">
                              DNI: {reg.DNI} · #{reg['#']}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItemButton>

                    {!isLast && <Divider component="li" />}
                  </Box>
                );
              })}
            </List>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
