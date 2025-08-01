import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import api from '../api/axios';

export default function WorkoutForm({ onWorkoutLogged }) {
  const [form, setForm] = useState({ type: '', duration: '', calories: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('/workout', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ type: '', duration: '', calories: '' });
      if (onWorkoutLogged) onWorkoutLogged(); // callback to refresh list
    } catch {
      alert('Failed to log workout');
    }
  };

  return (
    <Card sx={{ my: 3 }}>
      <CardContent>
        <Typography variant="h6">Log Workout</Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <TextField label="Type" name="type" value={form.type} onChange={handleChange} size="small" required />
          <TextField label="Duration (min)" name="duration" type="number" value={form.duration} onChange={handleChange} size="small" required />
          <TextField label="Calories" name="calories" type="number" value={form.calories} onChange={handleChange} size="small" required />
          <Button type="submit" variant="contained" color="primary">Add</Button>
        </form>
      </CardContent>
    </Card>
  );
}