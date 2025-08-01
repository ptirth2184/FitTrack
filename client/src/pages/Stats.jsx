import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Stats() {
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Analytics & Stats
      </Typography>
      <Typography>
        Visualize your fitness journey and data trends.
      </Typography>
    </Box>
  );
}
