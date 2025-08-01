import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, CircularProgress
} from '@mui/material';
import api from '../api/axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0,10));
  }
  return days;
}

export default function Stats() {
  const [loading, setLoading] = useState(false);
  const [workoutData, setWorkoutData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [mealData, setMealData] = useState([]);
  const last7Days = getLast7Days();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');

        // Fetch workouts
        const workoutsRes = await api.get('/workout', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch water logs
        const waterRes = await api.get('/water', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch meal logs
        const mealsRes = await api.get('/meals', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Aggregate data by day (YYYY-MM-DD)
        const aggregateByDay = (items, field) => {
          const counts = {};
          last7Days.forEach(day => counts[day] = 0);
          items.forEach(item => {
            const dateKey = new Date(item.date).toISOString().slice(0,10);
            if (counts[dateKey] !== undefined) {
              counts[dateKey] += item[field];
            }
          });
          return last7Days.map(day => ({ date: day, value: counts[day] }));
        };

        // Workouts: sum duration per day
        setWorkoutData(
          aggregateByDay(workoutsRes.data, 'duration')
          .map(d => ({ date: d.date, Workouts: d.value }))
        );

        // Water: sum ml per day
        setWaterData(
          aggregateByDay(waterRes.data, 'amount')
          .map(d => ({ date: d.date, Water: d.value }))
        );

        // Meals: sum calories per day
        setMealData(
          aggregateByDay(mealsRes.data, 'calories')
          .map(d => ({ date: d.date, Calories: d.value }))
        );

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Analytics & Stats
      </Typography>

      {/* Workouts Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Workout Duration (minutes) in Last 7 Days
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={workoutData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Workouts" stroke="#8884d8" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Water Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Water Intake (ml) in Last 7 Days
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={waterData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Water" stroke="#82ca9d" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Meals Chart */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Calories Consumed in Last 7 Days
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={mealData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Calories" stroke="#ffc658" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}
