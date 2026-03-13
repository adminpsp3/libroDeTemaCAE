// Nuevo_registro.jsx — Material UI v5 — Mobile first
// npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-date-pickers dayjs

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import {
  ArrowBackRounded,
  SaveRounded,
  CheckCircleRounded,
  CalendarMonthRounded,
} from '@mui/icons-material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

//const API_URL = localStorage.getItem('urlApi');
const API_URL = 'https://script.google.com/macros/s/AKfycbxH-cYnNeCkbz7zWHXRhDl0sNA6OwqSVLBiegiWyPkQOItLiHYXfCQJUu6H9FbNDH98/exec';
alert( API_URL);
//  'https://script.google.com/macros/s/AKfycbysKaPOMGooPeqcGi5zcWXV_3Dzocp6i2WtrcZNn9s8poIr1WJv-xboxMELnbTbUnUr/exec';

const formatFecha = (dayjsObj) => {
  if (!dayjsObj || !dayjsObj.isValid()) return '';
  return dayjsObj.format('DD/MM/YYYY');
};

export default function Nuevo_registro() {
  const navigate = useNavigate();

  const docente           = localStorage.getItem('docente')?.trim()           || '';
  const dni               = localStorage.getItem('login_password')?.trim()    || '';
  const espacioCurricular = localStorage.getItem('espacioCurricular')?.trim() || '';

  const hoy = dayjs();

  const [fechaCarga, setFechaCarga]   = useState(hoy);
  const [fechaReg, setFechaReg]       = useState(hoy);
  const [contenidos, setContenidos]   = useState('');
  const [propuesta, setPropuesta]     = useState('');
  const [observaciones, setObs]       = useState('');

  const [errores, setErrores]   = useState({});
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [exito, setExito]       = useState(false);

  const validar = () => {
    const e = {};
    if (!fechaCarga || !fechaCarga.isValid())   e.fechaCarga   = 'Fecha de carga requerida';
    if (!fechaReg   || !fechaReg.isValid())     e.fechaReg     = 'Fecha de la clase requerida';
    if (!contenidos.trim())                     e.contenidos   = 'Campo obligatorio';
    if (!propuesta.trim())                      e.propuesta    = 'Campo obligatorio';
    if (!observaciones.trim())                  e.observaciones = 'Campo obligatorio';
    return e;
  };

  const handleSubmit = async () => {
    setError(null);
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    const payload = {
      'Fecha de carga':                 formatFecha(fechaCarga),
      'Fecha reg.':                     formatFecha(fechaReg),
      'Docente':                        docente,
      'DNI':                            Number(dni) || dni,
      'ESPACIO CURRICULAR':             espacioCurricular,
      'CONTENIDOS':                     contenidos,
      'PROPUESTA / ACTIVIDADES / OTRO': propuesta,
      'OBSERVACIONES':                  observaciones,
    };

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Error desconocido');

      setExito(true);
      setTimeout(() => {
        navigate('/registros');
        setTimeout(() => window.location.reload(), 100);
      }, 1800);
    } catch (err) {
      console.error('[ERROR nuevo registro]', err);
      setError(`No se pudo guardar el registro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: { xs: 3, md: 5 },
          px: { xs: 0, sm: 4 },
        }}
      >
        <Container maxWidth="sm" disableGutters>

          {/* ── Encabezado ── */}
          <Box sx={{ width: '100%', maxWidth: 720, mb: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
                Nuevo registro
              </Typography>
              {espacioCurricular && (
                <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                  {espacioCurricular}
                </Typography>
              )}
              {docente && (
                <Typography variant="caption" color="text.disabled">
                  {docente}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackRounded />}
                onClick={() => navigate(-1)}
                size="small"
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Volver
              </Button>
            </Box>
          </Box>

          {/* ── Card formulario ── */}
          <Paper
            elevation={2}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: '0 6px 20px rgba(25,118,210,0.15)' },
            }}
          >
            {/* Header azul — igual que las cards de Registros */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: { xs: 2, sm: 3 },
                py: 1.5,
                bgcolor: 'primary.main',
              }}
            >
              <Chip
                label="Nuevo"
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.22)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  height: 26,
                }}
              />
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', display: 'block', lineHeight: 1.2 }}
                >
                  Datos del registro
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem' }}
                >
                  Todos los campos son obligatorios
                </Typography>
              </Box>
            </Box>

            {/* ── Cuerpo del formulario ── */}
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 2.5 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                bgcolor: '#fff',
                textAlign: 'left',
              }}
            >

              {/* Fechas */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <DatePicker
                  label="Fecha de carga *"
                  value={fechaCarga}
                  onChange={setFechaCarga}
                  format="DD/MM/YYYY"
                  slots={{ openPickerIcon: CalendarMonthRounded }}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { flex: 1, minWidth: 140 },
                      error: !!errores.fechaCarga,
                      helperText: errores.fechaCarga,
                    },
                  }}
                />
                <DatePicker
                  label="Fecha de la clase *"
                  value={fechaReg}
                  onChange={setFechaReg}
                  format="DD/MM/YYYY"
                  slots={{ openPickerIcon: CalendarMonthRounded }}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { flex: 1, minWidth: 140 },
                      error: !!errores.fechaReg,
                      helperText: errores.fechaReg,
                    },
                  }}
                />
              </Box>

              <Divider />

              {/* Solo lectura */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="Docente"
                  value={docente}
                  size="small"
                  sx={{ flex: 1, minWidth: 150 }}
                  InputProps={{ readOnly: true }}
                  variant="filled"
                />
                <TextField
                  label="DNI"
                  value={dni}
                  size="small"
                  sx={{ flex: 1, minWidth: 100 }}
                  InputProps={{ readOnly: true }}
                  variant="filled"
                />
              </Box>

              <TextField
                label="Espacio Curricular"
                value={espacioCurricular}
                size="small"
                fullWidth
                InputProps={{ readOnly: true }}
                variant="filled"
              />

              <Divider />

              {/* Campos editables */}
              <TextField
                label="Contenidos / Tema *"
                value={contenidos}
                onChange={(e) => { setContenidos(e.target.value); setErrores(p => ({ ...p, contenidos: '' })); }}
                multiline
                minRows={3}
                fullWidth
                placeholder="Describí los contenidos o temas trabajados en clase..."
                error={!!errores.contenidos}
                helperText={errores.contenidos}
              />

              <TextField
                label="Propuesta / Actividades *"
                value={propuesta}
                onChange={(e) => { setPropuesta(e.target.value); setErrores(p => ({ ...p, propuesta: '' })); }}
                multiline
                minRows={3}
                fullWidth
                placeholder="Describí las actividades realizadas..."
                error={!!errores.propuesta}
                helperText={errores.propuesta}
              />

              <TextField
                label="Observaciones *"
                value={observaciones}
                onChange={(e) => { setObs(e.target.value); setErrores(p => ({ ...p, observaciones: '' })); }}
                multiline
                minRows={2}
                fullWidth
                placeholder="Observaciones adicionales..."
                error={!!errores.observaciones}
                helperText={errores.observaciones}
              />

              {/* Error de API */}
              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {/* Éxito */}
              {exito && (
                <Alert
                  severity="success"
                  icon={<CheckCircleRounded fontSize="inherit" />}
                  sx={{ borderRadius: 2 }}
                >
                  ¡Registro guardado correctamente! Volviendo...
                </Alert>
              )}

              {/* Botón guardar */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveRounded />}
                onClick={handleSubmit}
                disabled={loading || exito}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  py: 1.4,
                  mt: 0.5,
                }}
              >
                {loading ? 'Guardando...' : 'Guardar registro'}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}
