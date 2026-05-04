import { useState, useEffect } from 'react';
import { Avatar, Box, Typography, Paper, useTheme, Divider, useMediaQuery } from '@mui/material';
import { useAuth } from '../../hooks';
import defaultAvatar from '../../assets/avatar.png';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export const PerfilPage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const monthName = currentTime.toLocaleString('es-ES', { month: 'long' });
  const timeString = currentTime.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  const dayNumber = currentTime.getDate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 150px)',
        p: { xs: 1, sm: 2, md: 4 },
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Decorative Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          left: '5%',
          width: { xs: 150, md: 300 },
          height: { xs: 150, md: 300 },
          background: `radial-gradient(circle, ${theme.palette.primary.main}11 0%, transparent 70%)`,
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: { xs: 6, sm: 8 },
          overflow: 'visible',
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          zIndex: 1,
        }}
      >
        {/* Tilted Small Card */}
        <Paper
          elevation={10}
          sx={{
            position: 'absolute',
            top: { xs: -20, sm: -30 },
            right: { xs: -10, sm: -20 },
            width: { xs: 100, sm: 130 },
            height: { xs: 100, sm: 130 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            borderRadius: { xs: 4, sm: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            transform: 'rotate(12deg)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'rotate(5deg) scale(1.05)',
            },
            zIndex: 2,
            p: 1.5,
            boxShadow: `0 15px 30px ${theme.palette.primary.main}44`,
          }}
        >
          <CalendarMonthIcon sx={{ fontSize: { xs: 20, sm: 24 }, mb: 0.5, opacity: 0.9 }} />
          <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="900" sx={{ lineHeight: 1 }}>
            {dayNumber}
          </Typography>
          <Typography variant="caption" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>
            {monthName}
          </Typography>
          <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 10 }} />
            <Typography variant="caption" fontWeight="600" sx={{ fontSize: '0.6rem' }}>
              {timeString}
            </Typography>
          </Box>
        </Paper>

        {/* Modern Header Background */}
        <Box
          sx={{
            height: { xs: 120, sm: 160 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            borderRadius: { xs: '24px 24px 80px 80px', sm: '32px 32px 100px 100px' },
            position: 'relative',
            mb: { xs: -6, sm: -8 },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 30,
              left: 30,
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />
        </Box>

        {/* Profile Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pb: { xs: 4, sm: 6 },
            px: { xs: 2, sm: 4 },
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Avatar
            src={defaultAvatar}
            alt={user?.username}
            sx={{
              width: { xs: 110, sm: 140 },
              height: { xs: 110, sm: 140 },
              border: '6px solid #fff',
              boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
              mb: { xs: 2, sm: 3 },
              bgcolor: 'background.paper',
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            fontWeight="900"
            sx={{
              mb: 1,
              background: `linear-gradient(45deg, #1e293b 30%, ${theme.palette.primary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: -0.5,
            }}
          >
            {user?.username}
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{ 
              mb: 2, 
              fontWeight: 600,
              color: 'primary.main',
              bgcolor: `${theme.palette.primary.main}12`,
              px: 2,
              py: 0.5,
              borderRadius: 4,
              display: 'inline-block'
            }}
          >
            Bienvenido a tu panel 👋
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              lineHeight: 1.6,
              mb: 2,
              maxWidth: '90%',
              mx: 'auto',
              fontSize: { xs: '0.85rem', sm: '1rem' }
            }}
          >
            Aquí encontrarás la gestión de tus tareas y podrás hacer seguimiento de tus actividades hoy.
          </Typography>
          
          <Divider sx={{ width: '40%', my: { xs: 2, sm: 3 }, opacity: 0.5 }} />
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: theme.palette.primary.main }}>
            <AccessTimeIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" fontWeight="700">
              Sesión activa: {timeString}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
