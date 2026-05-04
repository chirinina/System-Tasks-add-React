import { useActionState } from 'react';
import { createInitialState, handleZodErros } from '../../helpers';
import type { ActionState } from '../../interfaces';
import { schemaUser, type UserFormValues } from '../../models';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert, useAxios } from '../../hooks';

export type UserActionState = ActionState<UserFormValues>;
const initialState = createInitialState<UserFormValues>();

export const UserPage = () => {
  const { showAlert } = useAlert();
  const axios = useAxios();
  const navigate = useNavigate();

  const createUserApi = async (
    _: UserActionState | undefined,
    formData: FormData,
  ): Promise<UserActionState | undefined> => {
    const rawData: UserFormValues = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };
    try {
      schemaUser.parse(rawData);
      await axios.post('/users', {
        username: rawData.username,
        password: rawData.password,
      });
      showAlert('Usuario creado', 'success');
      navigate('/login');
    } catch (error) {
      const err = handleZodErros<UserFormValues>(error, rawData);
      showAlert(err.message, 'error');
      return err;
    }
  };

  const [state, submitAction, isPending] = useActionState(
    createUserApi,
    initialState,
  );

  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundColor: '#f5f5f7',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            padding: 4,
            borderRadius: 4,
            backgroundColor: 'white',
            color: '#1d1d1f',
          }}
        >
          <img
            src="/favicon.svg"
            alt="logo"
            width={40}
            height={40}
            style={{ marginBottom: '16px' }}
          />

          <Typography variant="h5" fontWeight="700" gutterBottom sx={{ color: '#1d1d1f' }}>
            Crear cuenta
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#86868b' }}>
            Por favor, ingresa tus datos para registrarte
          </Typography>

          <Box component={'form'} action={submitAction} sx={{ width: '100%' }}>
            <TextField
              label="Usuario"
              name="username"
              type="text"
              fullWidth
              margin="dense"
              variant="outlined"
              size="small"
              required
              disabled={isPending}
              defaultValue={state?.formData?.username}
              error={!!state?.errors.username}
              helperText={state?.errors.username}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              label="Contraseña"
              name="password"
              type="password"
              fullWidth
              margin="dense"
              variant="outlined"
              size="small"
              required
              disabled={isPending}
              defaultValue={state?.formData?.password}
              error={!!state?.errors.password}
              helperText={state?.errors.password}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              fullWidth
              margin="dense"
              variant="outlined"
              size="small"
              required
              disabled={isPending}
              defaultValue={state?.formData?.confirmPassword}
              error={!!state?.errors.confirmPassword}
              helperText={state?.errors.confirmPassword}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <Button
              type="submit"
              disabled={isPending}
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                mb: 2,
                height: 42,
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: '600',
                borderRadius: 2,
              }}
              startIcon={
                isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isPending ? 'Registrando...' : 'Registrar'}
            </Button>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#86868b' }}>
                ¿Ya tienes una cuenta?{' '}
                <Link
                  to={'/login'}
                  style={{
                    color: '#0071e3',
                    textDecoration: 'none',
                    fontWeight: '600',
                  }}
                >
                  Inicia sesión
                </Link>
              </Typography>
            </Box>

          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
