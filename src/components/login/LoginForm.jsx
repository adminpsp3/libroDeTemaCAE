// src/components/login/LoginForm.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ClearIcon from '@mui/icons-material/Clear';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    dni: '',
  });

  const [showDni, setShowDni] = useState(false);

  const hasContent = formData.email.trim() !== '' || formData.dni.trim() !== '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickShowDni = () => {
    setShowDni((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
    alert('Formulario enviado (simulación)');
  };

  const handleReset = () => {
    setFormData({
      email: '',
      dni: '',
    });
    setShowDni(false);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, mb: 8 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
          position: 'relative', // necesario para posicionar el botón absoluto
        }}
      >
        {/* Botón de limpiar en la esquina superior derecha */}
        {hasContent && (
          <IconButton
            aria-label="limpiar formulario"
            onClick={handleReset}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'text.disabled',
              '&:hover': {
                color: 'error.main',
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}

        <Typography
          variant="h5"
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#1976d2', pr: 4 }} // espacio para no chocar con el botón
        >
          Iniciar Sesión
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="dni"
            label="DNI"
            type={showDni ? 'text' : 'password'}
            id="dni"
            autoComplete="off"
            value={formData.dni}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle dni visibility"
                    onClick={handleClickShowDni}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showDni ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{
              mt: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Ingresar
          </Button>

          <Box textAlign="center" sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              ¿Olvidaste tu contraseña?
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginForm;