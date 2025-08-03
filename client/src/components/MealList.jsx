// import React, { useState, useEffect } from 'react';
// import { Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
// import api from '../api/axios';

// export default function MealList({ refresh, updateTotal }) {
//   const [meals, setMeals] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchMeals = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await api.get('/meals', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setMeals(res.data);
//       updateTotal && updateTotal(res.data.length);
//     } catch (error) {
//       setMeals([]);
//       updateTotal && updateTotal(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMeals();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [refresh]);

//   if (loading) {
//     return (
//       <Typography align="center" sx={{ py: 2 }}>
//         <CircularProgress />
//       </Typography>
//     );
//   }

//   if (!meals.length) {
//     return (
//       <Typography align="center" color="text.secondary" sx={{ py: 2 }}>
//         No meals logged today.
//       </Typography>
//     );
//   }

  

//   return (
//     <Grid container spacing={2}>
//       {meals.map(meal => (
//         <Grid item xs={12} md={6} key={meal._id}>
//           <Card>
//             <CardContent>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                 {meal.name} ({meal.time})
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {meal.calories} cal
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 {new Date(meal.date).toLocaleTimeString()}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, TextField, IconButton, Button, CircularProgress, Box, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../api/axios';

export default function MealList({ refresh, updateTotal }) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', calories: '', time: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/meals', { headers: { Authorization: `Bearer ${token}` } });
      setMeals(res.data);
      updateTotal && updateTotal(res.data.length);
    } catch {
      setMeals([]);
      updateTotal && updateTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMeals(); }, [refresh]);

  const handleDelete = async id => {
    if (!window.confirm("Delete this meal?")) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/meals/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSnackbar({ open: true, message: 'Meal deleted!', severity: 'success' });
      fetchMeals();
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete meal', severity: 'error' });
    }
  };

  const startEdit = meal => {
    setEditingId(meal._id);
    setEditForm({
      name: meal.name,
      calories: meal.calories,
      time: meal.time
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', calories: '', time: '' });
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const submitEdit = async id => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/meals/${id}`, editForm, { headers: { Authorization: `Bearer ${token}` } });
      setSnackbar({ open: true, message: 'Meal updated!', severity: 'success' });
      setEditingId(null);
      fetchMeals();
    } catch {
      setSnackbar({ open: true, message: 'Failed to update meal', severity: 'error' });
    }
  };

  if (loading) {
    return <Typography align="center" sx={{ py: 2 }}><CircularProgress /></Typography>;
  }
  if (!meals.length) {
    return <Typography align="center" color="text.secondary" sx={{ py: 2 }}>No meals logged today.</Typography>;
  }

  return (
    <>
      <Grid container spacing={2}>
        {meals.map(meal => (
          <Grid item xs={12} md={6} key={meal._id}>
            <Card sx={{ position: 'relative', p: 2 }}>
              <CardContent>
                {editingId === meal._id ? (
                  <>
                    <TextField
                      label="Meal Name"
                      name="name"
                      value={editForm.name}
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
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Time (e.g., Breakfast)"
                      name="time"
                      value={editForm.time}
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
                        onClick={() => submitEdit(meal._id)}
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
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {meal.name} ({meal.time})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{meal.calories} cal</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(meal.date).toLocaleTimeString()}
                    </Typography>
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <IconButton aria-label="edit" size="small" onClick={() => startEdit(meal)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton aria-label="delete" size="small" onClick={() => handleDelete(meal._id)}>
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
