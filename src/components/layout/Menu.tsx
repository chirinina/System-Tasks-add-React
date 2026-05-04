import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import type { MenuType } from './types';
import { useNavigate, useLocation } from 'react-router-dom';

interface Props {
  menuOptions: MenuType[];
  open: boolean;
  onClose: () => void;
}

export const Menu = ({ menuOptions, open, onClose }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const drawerWidth = open ? 240 : 70;
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <>
      <Toolbar />
      <List sx={{ px: (open || isMobile) ? 1 : 0.5, pt: 2 }}>
        {menuOptions.map((option) => (
          <ListItem key={option.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(option.path)}
              selected={location.pathname === option.path}
              sx={{
                borderRadius: 1.5,
                minHeight: 45,
                justifyContent: (open || isMobile) ? 'initial' : 'center',
                px: 2.5,
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '& .MuiListItemIcon-root': { color: 'white' },
                },
                '&:hover': {
                  bgcolor: location.pathname === option.path ? 'primary.dark' : 'rgba(0,0,0,0.04)',
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: (open || isMobile) ? 2 : 'auto',
                  justifyContent: 'center',
                  color:
                    location.pathname === option.path
                      ? 'white'
                      : 'text.secondary',
                  fontSize: '1.2rem',
                }}
              >
                {option.icon}
              </ListItemIcon>
              <ListItemText 
                primary={option.text} 
                sx={{ 
                  opacity: (open || isMobile) ? 1 : 0,
                  display: (open || isMobile) ? 'block' : 'none',
                  '& .MuiListItemText-primary': {
                    fontSize: '0.85rem',
                    fontWeight: location.pathname === option.path ? 700 : 500,
                  }
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            borderRight: 'none',
            boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        transition: (theme) => theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          overflowX: 'hidden',
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
        zIndex: (theme) => theme.zIndex.drawer,
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
