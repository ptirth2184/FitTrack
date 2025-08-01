import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress,Snackbar, Alert } from '@mui/material';
import api from '../api/axios';

export default function WorkoutList({ refresh, updateTotal }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/workout', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWorkouts(res.data);
        if (updateTotal) updateTotal(res.data.length);
      } catch (err) {
        setWorkouts([]);
        if (updateTotal) updateTotal(0);
      }
      finally
      {
        setLoading(false)
      }
    };
    fetchWorkouts();
  }, [refresh, updateTotal]);

  if (loading) return <CircularProgress />;

  if (!workouts || workouts.length === 0) {
    return <Typography>No workouts logged yet.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {workouts.map((w) => (
        <Grid item xs={12} md={6} key={w._id}>
          <Card>
            <CardContent>
              <Typography>
                <strong>{w.type}</strong> — {w.duration} min, {w.calories} cal <br />
                {new Date(w.date).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
