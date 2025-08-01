import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import api from '../api/axios';

export default function MealForm({ onMealLogged }) {
  const [form, setForm] = useState({ name: '', calories: '', time: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.calories || !form.time) {
      setSnackbar({ open: true, message: 'Please fill all fields', severity: 'warning' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await api.post('/meals', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({ open: true, message: 'Meal logged successfully!', severity: 'success' });
      setForm({ name: '', calories: '', time: '' });
      onMealLogged && onMealLogged();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to log meal', severity: 'error' });
    }
  };

  return (
    <>
      <Card sx={{ my: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Log a Meal</Typography>
          <form 
            onSubmit={handleSubmit} 
            style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}
            noValidate
          >
            <TextField
              label="Meal Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              size="small"
              required
              sx={{ minWidth: 150 }}
            />
            <TextField
              label="Calories"
              name="calories"
              type="number"
              inputProps={{ min: 0 }}
              value={form.calories}
              onChange={handleChange}
              size="small"
              required
              sx={{ width: 120 }}
            />
            <TextField
              label="Time (e.g., Breakfast)"
              name="time"
              value={form.time}
              onChange={handleChange}
              size="small"
              required
              sx={{ minWidth: 150 }}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ whiteSpace: 'nowrap' }}>
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Snackbar for feedback */}
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
