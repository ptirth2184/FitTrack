import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Goals() {
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fitness Goals
      </Typography>
      <Typography>
        Set and monitor your fitness goals here.
      </Typography>
    </Box>
  );
}
