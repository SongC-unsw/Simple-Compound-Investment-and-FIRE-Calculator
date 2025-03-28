import React from 'react';
import { 
  Box, 
  Typography, 
  Link, 
  Divider,
  Container,
  useTheme
} from '@mui/material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} 复利FIRE计算器
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link 
              href="#" 
              variant="body2" 
              color="text.secondary"
              underline="hover"
            >
              关于我们
            </Link>
            <Link 
              href="#" 
              variant="body2" 
              color="text.secondary"
              underline="hover"
            >
              隐私政策
            </Link>
            <Link 
              href="#" 
              variant="body2" 
              color="text.secondary"
              underline="hover"
            >
              使用条款
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;