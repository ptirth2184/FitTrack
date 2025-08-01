import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Meals() {
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Meals Tracker (Coming Soon)
      </Typography>
      <Typography>
        This page will allow you to log meals and track your daily nutrition data.
      </Typography>
    </Box>
  );
}
