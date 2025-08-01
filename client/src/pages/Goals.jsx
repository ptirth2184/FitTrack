import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Snackbar, Alert, LinearProgress
} from '@mui/material';
import api from '../api/axios';

export default function Goals() {
  const [goals, setGoals] = useState({
    workoutsPerWeek: '',
    dailyWaterMl: '',
    dailyCalories: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch user goals on mount
  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/goals', { headers: { Authorization: `Bearer ${token}` } });
        if (res.data) {
          setGoals({
            workoutsPerWeek: res.data.workoutsPerWeek || '',
            dailyWaterMl: res.data.dailyWaterMl || '',
            dailyCalories: res.data.dailyCalories || ''
          });
        }
      } catch (err) {
        setSnackbar({ open: true, message: 'Failed to fetch goals', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  // Handle form field changes
  const handleChange = e => setGoals({ ...goals, [e.target.name]: e.target.value });

  // Submit updated goals to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation can be added here if you like

    try {
      const token = localStorage.getItem('token');
      await api.post('/goals', goals, { headers: { Authorization: `Bearer ${token}` } });
      setSnackbar({ open: true, message: 'Goals updated successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update goals', severity: 'error' });
    }
  };

  // Example: You can show progress bars if you have actual progress data,
  // For now, just placeholders

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fitness Goals
      </Typography>

      {loading ? (
        <Typography>Loading goals...</Typography>
      ) : (
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <TextField
              label="Workouts per Week"
              name="workoutsPerWeek"
              type="number"
              value={goals.workoutsPerWeek}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              required
            />
            <TextField
              label="Daily Water Intake (ml)"
              name="dailyWaterMl"
              type="number"
              value={goals.dailyWaterMl}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              required
            />
            <TextField
              label="Daily Calories Intake"
              name="dailyCalories"
              type="number"
              value={goals.dailyCalories}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              required
            />
            <Button type="submit" variant="contained">Save Goals</Button>
          </form>
        </Paper>
      )}

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
    </Box>
  );
}
