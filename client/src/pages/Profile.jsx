import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Username: {user.username || 'N/A'}</Typography>
        <Typography variant="h6">Email: {user.email || 'N/A'}</Typography>
        {/* Add editable form fields here later */}
      </Paper>
    </Box>
  );
}
