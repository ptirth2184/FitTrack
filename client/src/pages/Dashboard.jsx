import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, Button, Avatar } from '@mui/material';
import WorkoutForm from '../components/WorkoutForm';
import WorkoutList from '../components/WorkoutList';
import WaterTracker from '../components/WaterTracker';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import OpacityIcon from '@mui/icons-material/Opacity';
import LogoutButton from '../components/LogoutButton';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // State to track which section is selected
  const [selectedSection, setSelectedSection] = useState(null);

  // Totals for summary cards
  const [workoutTotal, setWorkoutTotal] = useState(0);
  const [waterTotal, setWaterTotal] = useState(0);

  // Refresh trigger for WorkoutList after adding workout
  const [workoutRefresh, setWorkoutRefresh] = useState(0);

  // Callbacks from child components to update totals in dashboard
  const handleWorkoutListUpdate = (count) => {
    console.log("Workouts total updated:", count);
    setWorkoutTotal(count);
  };

  const handleWaterUpdate = (sum) => {
    console.log("Water total updated:", sum);
    setWaterTotal(sum);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #f7b42c 0%, #fc575e 100%)',
        py: 6,
        px: 2,
        maxWidth: 900,
        margin: '0 auto',
        position: 'relative',
      }}
    >

      {/* Banner Image with Welcome Text Overlay */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <img
          src="https://images.pexels.com/photos/3768913/pexels-photo-3768913.jpeg"
          alt="Fitness Motivation"
          style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }}
        />
        <Typography
          variant="h3"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            fontWeight: 700,
            textShadow: '0 2px 16px rgba(0,0,0,0.7)',
            background: 'rgba(0,0,0,0.25)',
            borderRadius: 2,
            px: 3,
            py: 1,
          }}
        >
          Welcome, {user.username}!
        </Typography>
      </Box>

      {/* User Avatar below Banner */}
      <Avatar
        src="https://randomuser.me/api/portraits/men/32.jpg"
        sx={{ width: 72, height: 72, margin: '0 auto', mb: 4 }}
      />

      {/* Summary Cards - Clickable to switch views */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Box
            onClick={() => setSelectedSection('workouts')}
            sx={{ cursor: 'pointer' }}
          >
            <Card
              sx={{
                background: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
                color: "#333",
                boxShadow: 3,
                '&:hover': { boxShadow: 6 },
                transition: 'box-shadow 0.3s ease',
              }}
              elevation={4}
            >
              <CardContent>
                <Box
                  sx={{
                    background: 'linear-gradient(120deg, #f7b42c 0%, #fc575e 100%)',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    marginBottom: 2,
                  }}
                >
                  <FitnessCenterIcon sx={{ color: "#fff" }} />
                </Box>
                <Typography variant="h6">Total Workouts</Typography>
                <Typography variant="h4">{workoutTotal}</Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            onClick={() => setSelectedSection('water')}
            sx={{ cursor: 'pointer' }}
          >
            <Card
              sx={{
                background: 'linear-gradient(120deg, #43cea2 0%, #185a9d 100%)',
                color: "#fff",
                boxShadow: 3,
                '&:hover': { boxShadow: 6 },
                transition: 'box-shadow 0.3s ease',
              }}
              elevation={4}
            >
              <CardContent>
                <Box
                  sx={{
                    background: 'linear-gradient(120deg, #43cea2 0%, #185a9d 100%)',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    marginBottom: 2,
                  }}
                >
                  <OpacityIcon sx={{ color: "#fff" }} />
                </Box>
                <Typography variant="h6">Water Consumed Today</Typography>
                <Typography variant="h4">{waterTotal} ml</Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Conditional Rendering of Detail Views */}
      {selectedSection === 'workouts' && (
        <>
          <WorkoutForm onWorkoutLogged={() => setWorkoutRefresh(r => r + 1)} />
          <WorkoutList refresh={workoutRefresh} updateTotal={handleWorkoutListUpdate} />
        </>
      )}

      {selectedSection === 'water' && (
        <WaterTracker updateTotal={handleWaterUpdate} />
      )}

      {!selectedSection && (
        <Typography variant="body1" align="center" color="textSecondary" sx={{ mt: 4 }}>
          Click on a card above to view details.
        </Typography>
      )}

      {/* Hide Details Button */}
      {selectedSection && (
        <Box textAlign="center" my={4}>
          <Button variant="outlined" onClick={() => setSelectedSection(null)}>
            Hide Details
          </Button>
        </Box>
      )}
    </Box>
  );
}
