import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Snackbar, Alert, Avatar } from '@mui/material';
import api from '../api/axios';

export default function Profile() {
  // Load user info from localStorage as a starting point
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [form, setForm] = useState({
    username: user.username || '',
    email: user.email || '',
    avatar: user.avatar || '', // Optional: for profile pic URL
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Make sure you have a backend endpoint: PUT /user/update
      await api.put('/user/update', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({ open: true, message: 'Profile updated!', severity: 'success' });
      // Optionally update localStorage user
      localStorage.setItem('user', JSON.stringify(form));
    } catch {
      setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      <Avatar
        src={form.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
        sx={{ width: 72, height: 72, mb: 3, mx: 'auto' }}
      />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <TextField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Avatar URL"
          name="avatar"
          value={form.avatar}
          onChange={handleChange}
          placeholder="Paste image URL (optional)"
        />
        <Button type="submit" variant="contained">
          Update Profile
        </Button>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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
