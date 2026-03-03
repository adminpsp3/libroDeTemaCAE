// Login.jsx — Material UI v5 + react-hook-form (Controller) + validaciones
// npm install @mui/material @emotion/react @emotion/styled @mui/icons-material react-hook-form

import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Typography,
  Alert,
} from '@mui/material';

import {
  Visibility,
  VisibilityOff,
  EmailRounded,
  LockRounded,
} from '@mui/icons-material';

export default function Login() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { username: '', password: '' },
    mode: 'onTouched', // valida al salir del campo
  });

  const [showPassword, setShowPassword] = useState(false);
  const [clave] = useState('docente');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem('login_username');
    const savedPassword = localStorage.getItem('login_password');
    if (savedUsername) setValue('username', savedUsername);
    if (savedPassword) setValue('password', savedPassword);
  }, [setValue]);

  const onSubmit = async (data) => {
    localStorage.setItem('login_username', data.username || '');
    localStorage.setItem('login_password', data.password || '');

    setErrorMsg('');
    setIsLoading(true);

    const dni = data.password.trim();

    const url = `https://script.google.com/macros/s/AKfycbyofpMHjhWlfVZwRxYzhAJzppEmkNL37m7tWIyxwUvkxWBrG9sHKvdamlUX1hW1zXcr/exec?dni=${encodeURIComponent(dni)}&clave=${encodeURIComponent(clave)}`;

    try {
      const response = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-cache' });
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const text = await response.text();
      const esValido = text.trim().toLowerCase() === 'true';

      if (esValido) {
        localStorage.setItem('estado', 'logueado');
        navigate('/selector');
      } else {
        setErrorMsg('Los datos ingresados son incorrectos. Verifica tu usuario y DNI.');
      }
    } catch (error) {
      console.error('Error al consultar la API:', error);
      setErrorMsg('Hubo un problema al conectar con el servidor. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const isBusy = isLoading || isSubmitting;

  // Estilos compartidos para los inputs
  const inputSx = {
    borderRadius: 2,
    fontSize: '1rem',
    minHeight: 64,
  };

  // Estilos del ícono con fondo azul
  const iconBox = (Icon) => (
    <InputAdornment position="start">
      <Box
        sx={{
          bgcolor: 'primary.main',
          borderRadius: 1,
          p: '4px 6px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Icon sx={{ color: '#fff', fontSize: 20 }} />
      </Box>
    </InputAdornment>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#e8f0fe',
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          width: '100%',
          maxWidth: 460,
          borderRadius: 4,
          bgcolor: '#ffffff',
        }}
      >
        {/* Título */}
        <Typography
          variant="h5"
          component="h1"
          align="center"
          fontWeight={700}
          color="primary"
          sx={{ mb: 4, fontSize: '1.75rem' }}
        >
          Iniciar sesión
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          {/* Campo: Correo electrónico / Username */}
          <Controller
            name="username"
            control={control}
            rules={{
              required: 'El correo electrónico es obligatorio',
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres',
              },
            }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.username} variant="outlined">
                <InputLabel htmlFor="username">Correo electrónico *</InputLabel>
                <OutlinedInput
                  {...field}
                  id="username"
                  type="text"
                  label="Correo electrónico *"
                  startAdornment={iconBox(EmailRounded)}
                  sx={inputSx}
                />
                {errors.username && (
                  <FormHelperText sx={{ mx: 0, mt: 0.5 }}>
                    {errors.username.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Campo: DNI */}
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'El DNI es obligatorio',
              minLength: {
                value: 7,
                message: 'El DNI debe tener al menos 7 dígitos',
              },
              pattern: {
                value: /^[0-9]+$/,
                message: 'El DNI solo debe contener números',
              },
            }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.password} variant="outlined">
                <InputLabel htmlFor="password">DNI *</InputLabel>
                <OutlinedInput
                  {...field}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  label="DNI *"
                  startAdornment={iconBox(LockRounded)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        aria-label={showPassword ? 'Ocultar DNI' : 'Mostrar DNI'}
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={inputSx}
                />
                {errors.password && (
                  <FormHelperText sx={{ mx: 0, mt: 0.5 }}>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Error de servidor */}
          {errorMsg && (
            <Alert severity="error" sx={{ py: 0.5, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          {/* Botón Ingresar */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isBusy}
            sx={{
              mt: 1,
              py: 1.8,
              fontWeight: 700,
              fontSize: '1.1rem',
              borderRadius: 3,
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(25, 118, 210, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 18px rgba(25, 118, 210, 0.5)',
              },
            }}
          >
            {isBusy ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <span>Verificando...</span>
              </Box>
            ) : (
              <span>Ingresar</span>
            )}
          </Button>

          {/* Link olvidaste contraseña */}
          <Box sx={{ textAlign: 'center' }}>
            <Link
              href="#"
              variant="body2"
              underline="hover"
              color="text.secondary"
              sx={{ fontSize: '0.95rem' }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
