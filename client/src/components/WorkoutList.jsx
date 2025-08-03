import React, { useState, useEffect } from 'react';
import { IconButton, Grid, Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../api/axios';

export default function WorkoutList({ refresh, updateTotal }) {
  const [workouts, setWorkouts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ type: '', duration: '', calories: '' });

  const fetchWorkouts = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await api.get('/workout', { headers: { Authorization: `Bearer ${token}` } });
      setWorkouts(res.data);
      updateTotal && updateTotal(res.data.length);
    } catch {
      setWorkouts([]);
      updateTotal && updateTotal(0);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [refresh]);

  const handleDelete = async id => {
    if (!window.confirm('Delete this workout?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/workout/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchWorkouts();
    } catch {
      alert('Failed to delete workout');
    }
  };

  const startEdit = workout => {
    setEditingId(workout._id);
    setEditForm({
      type: workout.type,
      duration: workout.duration,
      calories: workout.calories
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ type: '', duration: '', calories: '' });
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/workout/${id}`, editForm, { headers: { Authorization: `Bearer ${token}` } });
      setEditingId(null);
      fetchWorkouts();
    } catch {
      alert('Failed to update workout');
    }
  };

  return (
    <Grid container spacing={2}>
      {workouts.map((w) => (
        <Grid item xs={12} md={6} key={w._id}>
          <Card sx={{ position: 'relative', p: 2 }}>
            <CardContent>
              {editingId === w._id ? (
                <>
                  <TextField
                    label="Type"
                    name="type"
                    value={editForm.type}
                    onChange={handleEditChange}
                    size="small"
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Duration (min)"
                    name="duration"
                    type="number"
                    value={editForm.duration}
                    onChange={handleEditChange}
                    size="small"
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Calories"
                    name="calories"
                    type="number"
                    value={editForm.calories}
                    onChange={handleEditChange}
                    size="small"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Box textAlign="right">
                    <Button 
                      startIcon={<SaveIcon />} 
                      variant="contained" 
                      size="small" 
                      onClick={() => submitEdit(w._id)}
                      sx={{ mr: 1 }}
                    >
                      Save
                    </Button>
                    <Button 
                      startIcon={<CancelIcon />} 
                      variant="outlined" 
                      size="small" 
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Typography>
                    <strong>{w.type}</strong> — {w.duration} min, {w.calories} cal <br />
                    {new Date(w.date).toLocaleString()}
                  </Typography>
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton aria-label="edit" size="small" onClick={() => startEdit(w)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="delete" size="small" onClick={() => handleDelete(w._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}