import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Container,
  Stack,
  Tooltip,
  useTheme,
  Zoom,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as DoneIcon,
  RadioButtonUnchecked as PendingIcon,
  Search as SearchIcon,
  Assignment as TaskIcon,
  CheckCircleOutlined as CompletedListIcon,
  HourglassEmpty as PendingListIcon,
  PlaylistAddCheck as AllListIcon,
} from '@mui/icons-material';
import { useAxios } from '../../hooks/useAxios';
import { TaskService } from '../../services/task.service';
import type { Task } from '../../interfaces';
import { useAlert } from '../../hooks/useAlert';

export const TaskPage = () => {
  const theme = useTheme();
  const axiosClient = useAxios();
  const { showAlert } = useAlert();
  const taskService = useMemo(() => new TaskService(axiosClient), [axiosClient]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskName, setNewTaskName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Edit dialog state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editName, setEditName] = useState('');
  const [isEditingLoading, setIsEditingLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showAlert('Error al cargar las tareas', 'error');
    } finally {
      setLoading(false);
    }
  }, [taskService, showAlert]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    try {
      setIsAdding(true);
      const newTask = await taskService.createTask(newTaskName);
      setTasks((prev) => [newTask, ...prev]);
      setNewTaskName('');
      showAlert('¡Tarea agregada!', 'success');
    } catch (error) {
      showAlert('No pudimos crear la tarea', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showAlert('Tarea eliminada', 'info');
    } catch (error) {
      showAlert('Error al eliminar', 'error');
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = !task.done;

    // 1. Optimistic Update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, done: newStatus } : t))
    );

    try {
      const updatedTask = await taskService.patchTask(task.id, { done: newStatus });
      // 2. Update with real data from server (robust)
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, ...updatedTask } : t))
      );
    } catch (error) {
      // 3. Rollback on error
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, done: !newStatus } : t))
      );
      showAlert('Error al actualizar estado', 'error');
    }
  };

  const handleOpenEdit = async (task: Task) => {
    setEditingTask(task);
    setEditName(task.name);
    try {
      setIsEditingLoading(true);
      const taskFromServer = await taskService.getTaskById(task.id);
      setEditName(taskFromServer.name);
    } catch (error) {
      showAlert('Error al obtener detalles', 'error');
    } finally {
      setIsEditingLoading(false);
    }
  };

  const handleCloseEdit = () => {
    setEditingTask(null);
    setEditName('');
  };

  const handleUpdateTask = async () => {
    if (!editingTask || !editName.trim()) return;

    try {
      const updatedTask = await taskService.updateTask(editingTask.id, {
        name: editName,
        done: editingTask.done,
      });
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updatedTask : t)));
      handleCloseEdit();
      showAlert('Tarea actualizada', 'success');
    } catch (error) {
      showAlert('Error al actualizar', 'error');
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Defensive check to prevent white screen
        if (!task || typeof task.name !== 'string') return false;

        const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (filter === 'pending') return matchesSearch && !task.done;
        if (filter === 'completed') return matchesSearch && task.done;
        return matchesSearch;
      })
      .sort((a, b) => {
        // Primary sort: Pending first
        if (a.done !== b.done) return a.done ? 1 : -1;
        // Secondary sort: Newest first (by ID)
        return (b.id || 0) - (a.id || 0);
      });
  }, [tasks, searchQuery, filter]);

  const pendingCount = tasks.filter((t) => !t.done).length;
  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <Container maxWidth={false} sx={{
      py: 2,
      px: { xs: 1, md: 2 },
      '& @keyframes pulse': {
        '0%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.1)' },
        '100%': { transform: 'scale(1)' },
      }
    }}>
      {/* Header & Stats Compact */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        gap: 2
      }}>
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1
            }}
          >
            Registro de Tareas
          </Typography>
        </Box>

        <Stack
          direction="row"
          sx={{
            spacing: 1.5,
            gap: 1.5, // Using gap instead of spacing to ensure it's handled by Box/Stack correctly
            alignItems: 'center'
          }}
        >
          {[
            { label: 'Total', count: tasks.length, icon: <TaskIcon fontSize="small" />, color: theme.palette.primary.main },
            { label: 'Pendientes', count: pendingCount, icon: <PendingListIcon fontSize="small" />, color: '#f59e0b' },
            { label: 'Listas', count: completedCount, icon: <CompletedListIcon fontSize="small" />, color: theme.palette.success.main },
          ].map((stat, idx) => (
            <Tooltip key={idx} title={stat.label}>
              <Paper
                elevation={0}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  bgcolor: alpha(stat.color, 0.05)
                }}
              >
                <Box sx={{ color: stat.color, display: 'flex' }}>{stat.icon}</Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: stat.color }}>{stat.count}</Typography>
              </Paper>
            </Tooltip>
          ))}
        </Stack>
      </Box>

      {/* Actions Bar Thin */}
      <Paper
        elevation={0}
        sx={{
          p: 1,
          mb: 2,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          border: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(10px)'
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            gap: 1,
            alignItems: 'center'
          }}
        >
          <Box
            component="form"
            onSubmit={handleAddTask}
            sx={{
              display: 'flex',
              gap: 1,
              flexGrow: 1,
              width: '100%',
              alignItems: 'center'
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Nueva..."
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              disabled={isAdding}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  height: 36,
                  fontSize: '0.85rem'
                }
              }}
            />
            <Button
              variant="contained"
              type="submit"
              size="small"
              disabled={isAdding || !newTaskName.trim()}
              sx={{
                borderRadius: 1.5,
                minWidth: 40,
                height: 36,
                boxShadow: 'none'
              }}
            >
              {isAdding ? <CircularProgress size={18} color="inherit" /> : <AddIcon fontSize="small" />}
            </Button>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: 'none', md: 'block' },
              mx: 1,
              height: 24,
              alignSelf: 'center'
            }}
          />

          <Stack
            direction="row"
            sx={{
              gap: 1,
              flexGrow: 1,
              width: '100%',
              alignItems: 'center'
            }}
          >
            <TextField
              size="small"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  height: 36,
                  fontSize: '0.85rem'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                )
              }}
            />
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={(_, val) => val && setFilter(val)}
              size="small"
              sx={{
                height: 36,
                '& .MuiToggleButton-root': {
                  px: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  '&.Mui-selected': {
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': { bgcolor: theme.palette.primary.dark }
                  }
                }
              }}
            >
              <ToggleButton value="all">
                <Tooltip title="Todas"><AllListIcon fontSize="small" /></Tooltip>
              </ToggleButton>
              <ToggleButton value="pending">
                <Tooltip title="Pendientes"><PendingListIcon fontSize="small" /></Tooltip>
              </ToggleButton>
              <ToggleButton value="completed">
                <Tooltip title="Finalizadas"><CompletedListIcon fontSize="small" /></Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </Paper>

      {/* Task Table */}
      <TableContainer component={Paper} elevation={0} sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper'
      }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <TableCell align="center" sx={{ fontWeight: 800, py: 1, width: 50 }}><DoneIcon fontSize="small" /></TableCell>
              <TableCell sx={{ fontWeight: 800, py: 1 }}>Detalle</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, py: 1, width: 100 }}>Estado</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, py: 1, width: 80 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">Vacío</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow
                  key={task.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    bgcolor: task.done ? alpha(theme.palette.success.main, 0.03) : 'inherit',
                    transition: 'background-color 0.3s ease, transform 0.2s ease',
                    '&:hover': {
                      bgcolor: task.done
                        ? alpha(theme.palette.success.main, 0.06)
                        : alpha(theme.palette.primary.main, 0.02),
                    }
                  }}
                >
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleToggleStatus(task)}
                      sx={{
                        color: task.done ? theme.palette.success.main : theme.palette.text.disabled,
                        transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        '&:hover': {
                          transform: 'scale(1.15)',
                          color: task.done ? theme.palette.success.main : theme.palette.primary.main,
                          bgcolor: alpha(task.done ? theme.palette.success.main : theme.palette.primary.main, 0.08)
                        },
                        '&:active': { transform: 'scale(0.9)' }
                      }}
                    >
                      {task.done ? (
                        <DoneIcon fontSize="small" sx={{ animation: 'pulse 2s infinite' }} />
                      ) : (
                        <PendingIcon fontSize="small" />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        color: task.done ? theme.palette.text.disabled : theme.palette.text.primary,
                        textDecoration: task.done ? 'line-through' : 'none',
                      }}
                    >
                      {task.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={task.done ? <DoneIcon sx={{ fontSize: '0.8rem !important' }} /> : <PendingIcon sx={{ fontSize: '0.8rem !important' }} />}
                      label={task.done ? 'Completada' : 'Pendiente'}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: task.done ? theme.palette.success.main : '#f59e0b',
                        borderColor: alpha(task.done ? theme.palette.success.main : '#f59e0b', 0.3),
                        bgcolor: alpha(task.done ? theme.palette.success.main : '#f59e0b', 0.05)
                      }}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      sx={{
                        gap: 0,
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(task)}
                        sx={{ color: theme.palette.primary.main, p: 0.5 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTask(task.id)}
                        sx={{ color: theme.palette.error.main, p: 0.5 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog Compact */}
      <Dialog
        open={!!editingTask}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 3, p: 0.5 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', py: 1.5 }}>Editar</DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          {isEditingLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              size="small"
              variant="outlined"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={handleCloseEdit} size="small" sx={{ textTransform: 'none' }}>
            X
          </Button>
          <Button
            onClick={handleUpdateTask}
            variant="contained"
            size="small"
            disabled={isEditingLoading || !editName.trim()}
            sx={{ borderRadius: 1.5, textTransform: 'none', px: 3 }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};