import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Badges() {
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Badges & Achievements
      </Typography>
      <Typography>
        View your earned badges and accomplishments.
      </Typography>
    </Box>
  );
}
