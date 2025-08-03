import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, CircularProgress } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import OpacityIcon from '@mui/icons-material/Opacity';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import api from '../api/axios';

export default function Badges() {
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState({
    firstWorkout: false,
    hydrationHero: false,
    mealMaster: false,
    goalGetter: false,
  });

  useEffect(() => {
    const fetchAndCheckBadges = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        // Fetch logs
        const [workoutRes, waterRes, mealRes, goalsRes] = await Promise.all([
          api.get('/workout', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/water', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/meals', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/goals', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const workouts = workoutRes.data;
        const waterLogs = waterRes.data;
        const meals = mealRes.data;
        const goals = goalsRes.data || {};

        // Helper date values
        const today = new Date().toISOString().slice(0, 10);

        // Badge checks
        const firstWorkout = workouts.length > 0;
        const totalWaterToday = waterLogs
          .filter(w => new Date(w.date).toISOString().slice(0, 10) === today)
          .reduce((sum, l) => sum + l.amount, 0);
        const hydrationHero = totalWaterToday >= 2000;

        const mealMaster = meals
          .filter(m => new Date(m.date).toISOString().slice(0, 10) === today).length >= 3;

        // "Goal Getter": must have goals set; must reach each goal today/this week
        let goalGetter = false;
        if (goals && Object.keys(goals).length) {
          // Workouts this week
          const now = new Date();
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0,0,0,0);
          const workoutsThisWeek = workouts.filter(w => new Date(w.date) >= startOfWeek).length;

          // Calories
          const totalCaloriesToday = meals
            .filter(m => new Date(m.date).toISOString().slice(0, 10) === today)
            .reduce((sum, meal) => sum + Number(meal.calories), 0);
          // All goals reached?
          goalGetter =
            (!goals.workoutsPerWeek || workoutsThisWeek >= goals.workoutsPerWeek) &&
            (!goals.dailyWaterMl || totalWaterToday >= goals.dailyWaterMl) &&
            (!goals.dailyCalories || totalCaloriesToday <= goals.dailyCalories);
        }

        setBadges({ firstWorkout, hydrationHero, mealMaster, goalGetter });
      } catch (err) {
        // Optionally show error
      } finally {
        setLoading(false);
      }
    };
    fetchAndCheckBadges();
  }, []);

  const BADGE_LIST = [
    {
      key: 'firstWorkout',
      name: 'First Workout',
      desc: 'Logged your first workout!',
      icon: <FitnessCenterIcon />,
    },
    {
      key: 'hydrationHero',
      name: 'Hydration Hero',
      desc: 'Drank 2,000ml of water in a day',
      icon: <OpacityIcon />,
    },
    {
      key: 'mealMaster',
      name: 'Meal Master',
      desc: 'Logged 3 meals in one day',
      icon: <RestaurantIcon />,
    },
    {
      key: 'goalGetter',
      name: 'Goal Getter',
      desc: 'Achieved all daily goals',
      icon: <EmojiEventsIcon />,
    },
  ];

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Badges & Achievements
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Collect badges as you reach fitness milestones! Unlocked badges are highlighted.
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 6 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {BADGE_LIST.map(badge => (
            <Grid item xs={12} sm={6} md={4} key={badge.key}>
              <Card
                sx={{
                  opacity: badges[badge.key] ? 1 : 0.4,
                  boxShadow: badges[badge.key] ? 5 : 1,
                  textAlign: 'center',
                  background: badges[badge.key] ? 'linear-gradient(120deg, #a8ff78 0%, #78ffd6 100%)' : '',
                  transition: 'opacity 0.3s, background 0.4s'
                }}
              >
                <CardContent>
                  <Avatar
                    sx={{
                      bgcolor: badges[badge.key] ? "success.main" : "grey.400",
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
                    sx={{
                      mt: 1,
                      fontWeight: 'bold',
                      color: badges[badge.key] ? 'success.main' : 'grey.600'
                    }}
                  >
                    {badges[badge.key] ? 'Unlocked' : 'Locked'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
