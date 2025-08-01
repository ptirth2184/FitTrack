import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // your Axios instance with baseURL

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/login', form);
      // Save JWT token to localStorage
      localStorage.setItem('token', response.data.token);
      // Optionally save user info
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      maxWidth={400}
      mx="auto"
      mt={5}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <h2>Login</h2>
      <TextField
        label="Email"
        name="email"
        type="email"
        variant="outlined"
        required
        value={form.email}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        variant="outlined"
        required
        value={form.password}
        onChange={handleChange}
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Login
      </Button>
    </Box>
  );
}
