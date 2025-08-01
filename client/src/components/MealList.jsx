import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import api from '../api/axios';

export default function MealList({ refresh, updateTotal }) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/meals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeals(res.data);
      updateTotal && updateTotal(res.data.length);
    } catch (error) {
      setMeals([]);
      updateTotal && updateTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  if (loading) {
    return (
      <Typography align="center" sx={{ py: 2 }}>
        <CircularProgress />
      </Typography>
    );
  }

  if (!meals.length) {
    return (
      <Typography align="center" color="text.secondary" sx={{ py: 2 }}>
        No meals logged today.
      </Typography>
    );
  }

  

  return (
    <Grid container spacing={2}>
      {meals.map(meal => (
        <Grid item xs={12} md={6} key={meal._id}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {meal.name} ({meal.time})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {meal.calories} cal
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(meal.date).toLocaleTimeString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
