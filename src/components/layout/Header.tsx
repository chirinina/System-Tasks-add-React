import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { MenuType } from './types';
import {
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import defaultAvatar from '../../assets/avatar.png';
import { useState } from 'react';

interface Props {
  username?: string;
  menuOptions: MenuType[];
  logout: () => void;
  onToggleSidebar: () => void;
}

export const Header = ({ username, menuOptions, logout, onToggleSidebar }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const getPageTitle = () => {
    const currentOption = menuOptions.find(
      (option) => option.path === location.pathname,
    );
    return currentOption?.text || 'Mi App';
  };

  return (
    <AppBar position="fixed" elevation={2} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onToggleSidebar}
            edge="start"
            sx={{ mr: { xs: 0, sm: 2 } }}
          >
            <MenuIcon />
          </IconButton>
          <img src="/favicon.svg" width="32" height="32" alt="" />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              ml: 1,
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              display: { xs: 'none', sm: 'block' }
            }}
          >
            {getPageTitle()}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          {!isMobile && (
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {username || 'Usuario'}
            </Typography>
          )}

          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              src={defaultAvatar}
              sx={{ width: 35, height: 35, bgcolor: 'primary.light', border: '2px solid rgba(255,255,255,0.3)' }}
            >
              {username?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 180,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }
            }}
          >
            {isMobile && (
              <MenuItem disabled sx={{ opacity: '1 !important', pb: 1 }}>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: '700' }}>
                  Hola, {username || 'Usuario'}
                </Typography>
              </MenuItem>
            )}
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Mi Cuenta
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
