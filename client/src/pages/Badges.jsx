import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import OpacityIcon from '@mui/icons-material/Opacity';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const BADGES = [
  {
    key: 'first_workout',
    name: 'First Workout',
    desc: 'Logged your first workout!',
    icon: <FitnessCenterIcon />,
    unlocked: true // Set to dynamic value later
  },
  {
    key: 'hydration_hero',
    name: 'Hydration Hero',
    desc: 'Logged 2,000ml of water in a day',
    icon: <OpacityIcon />,
    unlocked: false
  },
  {
    key: 'meal_master',
    name: 'Meal Master',
    desc: 'Logged 3 meals in one day',
    icon: <RestaurantIcon />,
    unlocked: false
  },
  {
    key: 'goal_getter',
    name: 'Goal Getter',
    desc: 'Achieved all daily goals',
    icon: <EmojiEventsIcon />,
    unlocked: false
  }
  // Add more badges as you wish!
];

export default function Badges() {
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Badges & Achievements
      </Typography>

      <Typography sx={{ mb: 3 }}>
        Collect badges as you reach fitness milestones! Locked badges will appear faded.
      </Typography>

      <Grid container spacing={3}>
        {BADGES.map(badge => (
          <Grid item xs={12} sm={6} md={4} key={badge.key}>
            <Card
              sx={{
                opacity: badge.unlocked ? 1 : 0.4,
                boxShadow: badge.unlocked ? 5 : 1,
                textAlign: 'center',
                transition: 'opacity 0.3s'
              }}
            >
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: badge.unlocked ? "success.main" : "grey.400",
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  {badge.icon}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {badge.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {badge.desc}
                </Typography>
                <Typography
                  sx={{ mt: 1, fontWeight: 'bold', color: badge.unlocked ? 'success.main' : 'grey.600' }}
                >
                  {badge.unlocked ? 'Unlocked' : 'Locked'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
