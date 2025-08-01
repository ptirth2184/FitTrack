import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import api from '../api/axios';

export default function WaterTracker({ updateTotal }) {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/water', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
      const sum = res.data.reduce((acc, l) => acc + l.amount, 0);
      setTotal(sum);
      if (updateTotal) updateTotal(sum);
    } catch (err) {
      setLogs([]);
      setTotal(0);
      if (updateTotal) updateTotal(0);
    }
    finally
    {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <CircularProgress />;


  const logWater = async (ml) => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/water', { amount: ml }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLogs();
    } catch (err) {
      alert('Failed to log water');
    }
  };

  return (
    <Card sx={{ my: 3 }}>
      <CardContent>
        <Typography variant="h6">Log Water Intake</Typography>
        <Box sx={{ mb: 1 }}>
          <Button onClick={() => logWater(250)} variant="contained" sx={{ mr: 1 }}>+250ml</Button>
          <Button onClick={() => logWater(500)} variant="contained">+500ml</Button>
        </Box>
        <Typography>Total today: {total} ml</Typography>
        <ul>
          {logs.map(l => (
            <li key={l._id}>
              {l.amount} ml at {new Date(l.date).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
