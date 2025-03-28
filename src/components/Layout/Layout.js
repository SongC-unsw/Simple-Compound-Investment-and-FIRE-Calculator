import React from 'react';
import { Box, Container, Toolbar } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Header />
      <Toolbar /> {/* 为AppBar留出空间 */}
      <Container
        maxWidth="xl"
        component="main"
        sx={{
          flex: 1,
          py: 4,
          px: { xs: 2, sm: 3 },
        }}
      >
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;