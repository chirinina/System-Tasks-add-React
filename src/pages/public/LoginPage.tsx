import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useActionState } from 'react';
import { schemaLogin, type LoginFormValues } from '../../models/login.model';
import type { ActionState } from '../../interfaces';
import { createInitialState, handleZodErros } from '../../helpers';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert, useAuth, useAxios } from '../../hooks';

//const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type LoginActionState = ActionState<LoginFormValues>;
const initialState = createInitialState<LoginFormValues>();
export const LoginPage = () => {
  const { showAlert } = useAlert();
  const { login } = useAuth();
  const axios = useAxios();
  const navigate = useNavigate();

  const loginApi = async (
    _: LoginActionState | undefined,
    formData: FormData,
  ): Promise<LoginActionState | undefined> => {
    const rawData: LoginFormValues = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };
    try {
      schemaLogin.parse(rawData);
      //await delay(5000);
      const response = await axios.post('login', rawData);
      if (!response?.data?.token) throw new Error('Token no existe');
      login(response.data.token, { username: rawData.username });
      showAlert(`Bienvenido estimado/a ${rawData.username}`, 'success');
      navigate('/perfil');
    } catch (error) {
      const err = handleZodErros<LoginFormValues>(error, rawData);
      console.log('error', err);
      showAlert(err.message, 'error');
      return err;
    }
  };

  const [state, submitAction, isPending] = useActionState(
    loginApi,
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
            ¡Bienvenido!
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#86868b' }}>
            Por favor, inicia sesión para continuar
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
              {isPending ? 'Ingresando...' : 'Ingresar'}
            </Button>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#86868b' }}>
                ¿No tienes una cuenta?{' '}
                <Link
                  to={'/user'}
                  style={{
                    color: '#0071e3',
                    textDecoration: 'none',
                    fontWeight: '600',
                  }}
                >
                  Regístrate aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
