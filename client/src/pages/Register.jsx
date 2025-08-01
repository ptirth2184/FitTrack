import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/user/register', form);
      alert("Registration successful! Now log in.");
      navigate('/login');
      setForm({ username: '', email: '', password: '' });
    } catch (err) {
      alert(err.response?.data?.message || "Registration error");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2} maxWidth={400} mx="auto" mt={5}>
      <h2>Register</h2>
      <TextField label="Username" name="username" value={form.username} onChange={handleChange} required />
      <TextField label="Email" name="email" value={form.email} onChange={handleChange} required />
      <TextField label="Password" name="password" value={form.password} onChange={handleChange} type="password" required />
      <Button type="submit" variant="contained" color="primary">Register</Button>
    </Box>
  );
}
