import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Snackbar,
  Alert,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import api from '../api/axios';

export default function Goals() {
  const [goals, setGoals] = useState({
    workoutsPerWeek: '',
    dailyWaterMl: '',
    dailyCalories: '',
  });
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [progress, setProgress] = useState({
    totalWaterToday: 0,
    totalCaloriesToday: 0,
    workoutsThisWeek: 0,
  });

  // Fetch user goals on mount
  useEffect(() => {
    const fetchGoals = async () => {
      setLoadingGoals(true);
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/goals', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data) {
          setGoals({
            workoutsPerWeek: res.data.workoutsPerWeek ?? '',
            dailyWaterMl: res.data.dailyWaterMl ?? '',
            dailyCalories: res.data.dailyCalories ?? '',
          });
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'Failed to fetch goals',
          severity: 'error',
        });
      } finally {
        setLoadingGoals(false);
      }
    };
    fetchGoals();
  }, []);

  // Fetch progress aggregation on mount
  useEffect(() => {
    const fetchProgress = async () => {
      setLoadingProgress(true);
      try {
        const token = localStorage.getItem('token');

        // Fetch water logs
        const waterRes = await api.get('/water', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const today = new Date().toISOString().slice(0, 10);
        const totalWaterToday = waterRes.data
          .filter((log) => new Date(log.date).toISOString().slice(0, 10) === today)
          .reduce((sum, log) => sum + log.amount, 0);

        // Fetch meal logs
        const mealsRes = await api.get('/meals', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const totalCaloriesToday = mealsRes.data
          .filter((meal) => new Date(meal.date).toISOString().slice(0, 10) === today)
          .reduce((sum, meal) => sum + Number(meal.calories), 0);

        // Fetch workouts
        const workoutRes = await api.get('/workout', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const workoutsThisWeek = workoutRes.data.filter(
          (w) => new Date(w.date) >= startOfWeek
        ).length;

        setProgress({ totalWaterToday, totalCaloriesToday, workoutsThisWeek });
      } catch (error) {
        console.error('Failed to fetch progress data:', error);
      } finally {
        setLoadingProgress(false);
      }
    };
    fetchProgress();
  }, []);

  // Handle form field changes
  const handleChange = (e) =>
    setGoals({ ...goals, [e.target.name]: e.target.value });

  // Submit updated goals to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await api.post('/goals', goals, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({
        open: true,
        message: 'Goals updated successfully!',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update goals', severity: 'error' });
    }
  };

  // Helper to safely calculate progress percentage
  const calcProgress = (current, goal) => {
    const g = Number(goal);
    const c = Number(current);
    if (!g || g <= 0) return 0;
    const val = (c / g) * 100;
    return val > 100 ? 100 : val;
  };

  // Helper to return motivational message based on progress
  const getMotivationMessage = (current, goal, type) => {
    const g = Number(goal);
    const c = Number(current);
    if (!g || g <= 0) return '';

    const progressPercent = (c / g) * 100;

    if (progressPercent >= 100) {
      return `🏆 Amazing! You've met or exceeded your ${type} goal! Keep it up!`;
    } else if (progressPercent >= 80) {
      return `👍 Almost there! Just a bit more to reach your ${type} goal.`;
    } else if (progressPercent >= 50) {
      return `😊 Good progress on your ${type} goal! Keep pushing forward!`;
    } else {
      return `Keep going! You can achieve your ${type} goal with steady effort!`;
    }
  };

  // Show combined loading while either loading goals or progress
  const loading = loadingGoals || loadingProgress;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fitness Goals
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 3 }}>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
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
            <Button type="submit" variant="contained">
              Save Goals
            </Button>
          </form>
        </Paper>
      )}

      {/* Water Progress */}
      {goals.dailyWaterMl && Number(goals.dailyWaterMl) > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Water Intake Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={calcProgress(progress.totalWaterToday, goals.dailyWaterMl)}
            sx={{ height: 10, borderRadius: 5, my: 1 }}
          />
          <Typography>
            {progress.totalWaterToday} ml / {goals.dailyWaterMl} ml
            {progress.totalWaterToday >= goals.dailyWaterMl ? ' ✅ Goal reached!' : ''}
          </Typography>
          <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
            {getMotivationMessage(progress.totalWaterToday, goals.dailyWaterMl, 'water')}
          </Typography>
        </>
      )}

      {/* Calories Progress */}
      {goals.dailyCalories && Number(goals.dailyCalories) > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Calories Intake Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={calcProgress(progress.totalCaloriesToday, goals.dailyCalories)}
            sx={{ height: 10, borderRadius: 5, my: 1 }}
            color={progress.totalCaloriesToday > goals.dailyCalories ? 'error' : 'primary'}
          />
          <Typography>
            {progress.totalCaloriesToday} kcal / {goals.dailyCalories} kcal
            {progress.totalCaloriesToday > goals.dailyCalories ? ' ⚠️ Over goal!' : ''}
          </Typography>
          <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
            {getMotivationMessage(progress.totalCaloriesToday, goals.dailyCalories, 'calories')}
          </Typography>
        </>
      )}

      {/* Workouts Progress */}
      {goals.workoutsPerWeek && Number(goals.workoutsPerWeek) > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Workouts This Week
          </Typography>
          <LinearProgress
            variant="determinate"
            value={calcProgress(progress.workoutsThisWeek, goals.workoutsPerWeek)}
            sx={{ height: 10, borderRadius: 5, my: 1 }}
          />
          <Typography>
            {progress.workoutsThisWeek} / {goals.workoutsPerWeek} workouts
            {progress.workoutsThisWeek >= goals.workoutsPerWeek ? ' 🏆 Great job!' : ''}
          </Typography>
          <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
            {getMotivationMessage(progress.workoutsThisWeek, goals.workoutsPerWeek, 'workouts')}
          </Typography>
        </>
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
