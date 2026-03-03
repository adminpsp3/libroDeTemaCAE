// Registros.jsx — Material UI v5 — Mobile first
// npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  AddRounded,
  ArrowBackRounded,
  DeleteOutlineRounded,
  LogoutRounded,
  AssignmentOutlined,
  RefreshRounded,
  KeyboardDoubleArrowDownRounded,
  MenuBookRounded,
} from '@mui/icons-material';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const formatFecha = (fecha) => {
  if (!fecha) return { fecha: 'Sin fecha', dia: '' };
  try {
    const [y, m, d] = fecha.split('T')[0].split('-');
    // Usar UTC para evitar desfase de zona horaria
    const dateObj = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
    const diaSemana = DIAS[dateObj.getUTCDay()];
    return { fecha: `${d}/${m}/${y}`, dia: diaSemana };
  } catch {
    return { fecha, dia: '' };
  }
};

function CampoRegistro({ label, valor }) {
  return (
    <Box>
      <Typography
        variant="caption"
        fontWeight={700}
        color="primary"
        sx={{
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          fontSize: '0.7rem',
          display: 'block',
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        color="text.primary"
        sx={{ lineHeight: 1.7, fontSize: { xs: '0.92rem', sm: '0.9rem' } }}
      >
        {valor || '—'}
      </Typography>
    </Box>
  );
}

export default function Registros() {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [registroAEliminar, setRegistroAEliminar] = useState(null);
  const [tokenError, setTokenError] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [eliminarError, setEliminarError] = useState(null);
  const espacioCurricular = localStorage.getItem('espacioCurricular')?.trim() || '';

  useEffect(() => {
    const cargarRegistros = async () => {
      const dni = localStorage.getItem('login_password')?.trim() || '';
      const urlBase = localStorage.getItem('urlApi')?.trim() || '';

      if (!dni) {
        setError('No se encontró el DNI. Iniciá sesión nuevamente.');
        setLoading(false);
        return;
      }
      if (!urlBase) {
        setError('No se encontró la URL de API. Volvé a seleccionar el libro.');
        setLoading(false);
        return;
      }

      let url = `${urlBase}?action=registros&dni=${encodeURIComponent(dni)}`;
      if (espacioCurricular) url += `&ec=${encodeURIComponent(espacioCurricular)}`;

      try {
        const response = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-cache' });
        if (!response.ok) {
          const errorText = await response.text().catch(() => '');
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        setRegistros(data.registros || []);
      } catch (err) {
        console.error('[ERROR]', err);
        setError(`Error al cargar: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    cargarRegistros();
  }, []);

  const handleEliminarClick = (registro) => {
    if (!registro['N°']) {
      setTokenError(true);
      return;
    }
    setRegistroAEliminar(registro);
    setConfirmOpen(true);
  };

  const handleConfirmarEliminar = async () => {
    setConfirmOpen(false);
    setEliminando(true);
    setEliminarError(null);
    const token = registroAEliminar['N°'];
    const url = `https://script.google.com/macros/s/AKfycbysKaPOMGooPeqcGi5zcWXV_3Dzocp6i2WtrcZNn9s8poIr1WJv-xboxMELnbTbUnUr/exec?token=${encodeURIComponent(token)}`;
    try {
      const response = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      navigate('/registros');
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      console.error('[ERROR eliminar]', err);
      setEliminarError('No se pudo eliminar el registro. Intentá nuevamente.');
    } finally {
      setEliminando(false);
      setRegistroAEliminar(null);
    }
  };

  const handleCancelarEliminar = () => {
    setConfirmOpen(false);
    setRegistroAEliminar(null);
  };

  const handleRecargar = () => window.location.reload();

  const handleVolver = () => navigate(-1);
  const handleSalir = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: { xs: 3, md: 5 },
        px: { xs: 2, sm: 4 },
      }}
    >
      {/* ── Encabezado ── */}
      <Box sx={{ width: '100%', maxWidth: 720, mb: 4 }}>

        {/* Título + subtítulo */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
            Registro de clases
          </Typography>
          {espacioCurricular && (
            <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
              {espacioCurricular}
            </Typography>
          )}
          {!loading && !error && (
            <Typography variant="caption" color="text.disabled">
              {registros.length} registro{registros.length !== 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        {/* Acciones */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackRounded />}
            onClick={handleVolver}
            size="small"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Volver
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            
            <Tooltip title="Ir al final">
              <IconButton
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                aria-label="Ir al final de la página"
                sx={{
                  bgcolor: 'secondary.main',
                  color: '#fff',
                  width: 38,
                  height: 38,
                  '&:hover': { bgcolor: 'secondary.dark' },
                }}
              >
                <KeyboardDoubleArrowDownRounded />
              </IconButton>
            </Tooltip>
            <Tooltip title="Mis libros">
              <IconButton
                onClick={() => navigate('/libros')}
                aria-label="Ir a libros disponibles"
                sx={{
                  bgcolor: 'warning.main',
                  color: '#fff',
                  width: 38,
                  height: 38,
                  '&:hover': { bgcolor: 'warning.dark' },
                }}
              >
                <MenuBookRounded />
              </IconButton>
            </Tooltip>
            <Tooltip title="Nuevo registro">
              <IconButton
                onClick={() => navigate('/registros/nuevo')}
                aria-label="Nuevo registro"
                sx={{
                  bgcolor: 'success.main',
                  color: '#fff',
                  width: 38,
                  height: 38,
                  '&:hover': { bgcolor: 'success.dark' },
                }}
              >
                <AddRounded />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cerrar sesión">
              <IconButton
                onClick={handleSalir}
                aria-label="Salir"
                sx={{
                  bgcolor: 'error.main',
                  color: '#fff',
                  width: 38,
                  height: 38,
                  '&:hover': { bgcolor: 'error.dark' },
                }}
              >
                <LogoutRounded />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* ── Cargando ── */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <Alert severity="error" sx={{ borderRadius: 3, fontSize: '0.9rem', width: '100%', maxWidth: 720 }}>
          {error}
        </Alert>
      )}

      {/* ── Sin datos ── */}
      {!loading && !error && registros.length === 0 && (
        <Paper
          elevation={2}
          sx={{
            borderRadius: 4,
            p: { xs: 4, sm: 6 },
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            maxWidth: 720,
          }}
        >
          <AssignmentOutlined sx={{ fontSize: 56, color: 'primary.light' }} />
          <Typography variant="body1" fontWeight={500} color="text.secondary">
            No hay registros disponibles
          </Typography>
        </Paper>
      )}

      {/* ── Lista de registros ── */}
      {!loading && registros.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, sm: 2.5 },
            width: '100%',
            maxWidth: 720,
          }}
        >
          {registros.map((r, index) => {
            const { fecha, dia } = formatFecha(r['Fecha reg.']);
            return (
              <Paper
                key={r['N°'] || index}
                elevation={2}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 6px 20px rgba(25,118,210,0.15)' },
                }}
              >
                {/* ── Header azul ── */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: { xs: 2, sm: 3 },
                    py: 1.5,
                    bgcolor: 'primary.main',
                  }}
                >
                  {/* Número de clase + fecha + día */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Clase ${index + 1}`}
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
                        {dia}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}
                      >
                        {fecha}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Botón eliminar */}
                  <Tooltip title="Eliminar registro">
                    <IconButton
                      size="small"
                      onClick={() => handleEliminarClick(r)}
                      aria-label="Eliminar registro"
                      sx={{
                        color: 'rgba(255,255,255,0.75)',
                        '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' },
                      }}
                    >
                      <DeleteOutlineRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* ── Campos ── */}
                <Box
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: { xs: 2, sm: 2.5 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    bgcolor: '#fff',
                    textAlign: 'left',
                  }}
                >
                  <CampoRegistro
                    label="Contenidos / Tema"
                    valor={r['CONTENIDOS'] || 'No especificado'}
                  />
                  <Divider />
                  <CampoRegistro
                    label="Propuesta / Actividades"
                    valor={r['PROPUESTA / ACTIVIDADES / OTRO'] || 'Sin actividades registradas'}
                  />
                  <Divider />
                  <CampoRegistro
                    label="Observaciones"
                    valor={r['OBSERVACIONES'] || 'Sin observaciones'}
                  />
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}

      {/* ── Eliminando ── */}
      {eliminando && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 4 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary">Eliminando registro...</Typography>
        </Box>
      )}

      {/* ── Error al eliminar ── */}
      {eliminarError && (
        <Alert
          severity="error"
          onClose={() => setEliminarError(null)}
          sx={{ borderRadius: 3, fontSize: '0.9rem', width: '100%', maxWidth: 720, mt: 2 }}
        >
          {eliminarError}
        </Alert>
      )}

      {/* ── Error de token ── */}
      {tokenError && (
        <Alert
          severity="error"
          onClose={() => setTokenError(false)}
          sx={{ borderRadius: 3, fontSize: '0.9rem', width: '100%', maxWidth: 720, mt: 2 }}
        >
          No se puede eliminar: este registro no tiene un token válido.
        </Alert>
      )}

      {/* ── Diálogo de confirmación ── */}
      <Dialog
        open={confirmOpen}
        onClose={handleCancelarEliminar}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 4, mx: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          ¿Eliminar registro?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '0.95rem' }}>
            Esta acción no se puede deshacer. ¿Confirmás que querés eliminar este registro?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={handleCancelarEliminar}
            variant="outlined"
            fullWidth
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarEliminar}
            variant="contained"
            color="error"
            fullWidth
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
