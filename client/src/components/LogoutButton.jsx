import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Button 
      variant="outlined" 
      color="secondary" 
      onClick={handleLogout}
      sx={{ position: 'fixed', top: 16, right: 16 }} // position it nicely (optional)
    >
      Logout
    </Button>
  );
}
