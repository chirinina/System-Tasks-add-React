import { Box, Container, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import { type ReactNode, useState, useEffect } from 'react';
import { Header } from './Header';
import {
  Person as PersonIcon,
  Assignment as TaskIcon,
} from '@mui/icons-material';
import type { MenuType } from './types';
import { useAuth } from '../../hooks';
import { Menu } from './Menu';
import { Footer } from './Footer';

interface Props {
  children: ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { logout, user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuOptions: MenuType[] = [
    { text: 'Mi Cuenta', icon: <PersonIcon />, path: '/perfil' },
    { text: 'Mis Tareas', icon: <TaskIcon />, path: '/tasks' },
  ];

  const [openSidebar, setOpenSidebar] = useState(!isMobile);

  // Update sidebar state when switching between mobile/desktop
  useEffect(() => {
    setOpenSidebar(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => setOpenSidebar(!openSidebar);
  const closeSidebar = () => setOpenSidebar(false);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Header
        username={user?.username}
        logout={logout}
        menuOptions={menuOptions}
        onToggleSidebar={toggleSidebar}
      />
      <Toolbar />

      <Box sx={{ flex: 1, display: 'flex', position: 'relative' }}>
        <Menu
          menuOptions={menuOptions}
          open={openSidebar}
          onClose={closeSidebar}
        />
        <Container
          maxWidth={false}
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};
