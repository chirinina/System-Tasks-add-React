import { Box, Typography, IconButton, Link, Stack } from "@mui/material";
import { Instagram, GitHub } from "@mui/icons-material";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: 'transparent',
        textAlign: 'center',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500 }}>
          &copy; {currentYear} | Desarrollado por <strong>Efrain Chiri</strong> con fines educativos
        </Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={0.5}
        sx={{ justifyContent: 'center' }}
      >
        <IconButton
          component={Link}
          href="https://www.instagram.com/chirinina2"
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          sx={{ color: 'primary.main' }}
        >
          <Instagram fontSize="small" />
        </IconButton>
        <IconButton
          component={Link}
          href="https://github.com/chirinina"
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          sx={{ color: 'primary.main' }}
        >
          <GitHub fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
};
